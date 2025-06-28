// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Chainlink
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/KeeperCompatibleInterface.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

contract TickItOn is
    ERC721,
    ERC721URIStorage,
    CCIPReceiver,
    VRFConsumerBaseV2,
    KeeperCompatibleInterface,
    Ownable,
    ReentrancyGuard
{
    using Strings for uint256;

    // ============ STATE VARIABLES ============

    // Chainlink interfaces
    IRouterClient private immutable ccipRouter;
    VRFCoordinatorV2Interface private immutable vrfCoordinator;
    IERC20 private immutable linkToken;

    // VRF Configuration
    uint64 private immutable vrfSubscriptionId;
    bytes32 private immutable vrfKeyHash;
    uint32 private constant VRF_CALLBACK_GAS_LIMIT = 200000; // Increased for safety
    uint16 private constant VRF_REQUEST_CONFIRMATIONS = 3;
    uint32 private constant VRF_NUM_WORDS = 1;

    // Platform Configuration
    uint256 private constant PLATFORM_FEE_BASIS_POINTS = 200; // 2%
    uint256 private constant RESALE_PLATFORM_SHARE = 70; // 70%
    uint256 private constant RESALE_ORGANIZER_SHARE = 30; // 30%
    uint256 private constant PRICE_INCREMENT_BASIS_POINTS = 10; // 0.1%
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant ORGANIZER_STAKE_PERCENT = 10; // 10%

    // Chain IDs for CCIP
    mapping(uint64 => bool) public supportedChains;

    // Counters
    uint256 private eventCounter;
    uint256 private ticketCounter;
    uint256 private resaleCounter;

    // ============ STRUCTS ============
    // (Structs remain largely the same)
    struct Event {
        uint256 eventId;
        address organizer;
        string name;
        string description;
        string venue;
        uint256 eventDate;
        uint256 totalTickets;
        uint256 basePrice;
        uint256 ticketsSold;
        uint256 organizerStake;
        bool isActive;
        bool isCompleted;
        string metadataURI;
    }

    struct Ticket {
        uint256 ticketId;
        uint256 eventId;
        // owner is handled by ERC721's _ownerOf
        uint256 purchasePrice;
        uint256 purchaseTimestamp;
        bool isResale;
        bool isUsed;
    }

    struct ResaleListing {
        uint256 resaleId;
        uint256 ticketId;
        address seller;
        uint256 listingPrice;
        bool isActive;
        uint256 listedTimestamp;
    }

    struct CrossChainMessage {
        address buyer;
        uint256 id; // Can be eventId or resaleId
        uint256 quantity;
        uint64 sourceChainSelector;
        MessageType msgType;
    }

    enum MessageType {
        BUY_TICKET,
        RESALE_TICKET
    }

    // ============ MAPPINGS ============

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => ResaleListing) public resaleListings;
    mapping(uint256 => uint256) public ticketToResaleId;
    mapping(uint256 => uint256) public vrfRequestToEventId;
    mapping(address => uint256[]) public userTickets; // Kept for frontend convenience, with awareness of gas cost

    // FIX: Mappings to track active items, preventing unbounded loops
    mapping(uint256 => bool) private isActiveEvent;
    uint256[] private activeEventIds;
    mapping(uint256 => bool) private isActiveResale;
    uint256[] private activeResaleIds;

    mapping(uint64 => bool) public supportedChainSelectors;

    function addSupportedChainSelector(
        uint64 _chainSelector
    ) external onlyOwner {
        supportedChainSelectors[_chainSelector] = true;
    }

    // ============ EVENTS ============
    // (Events remain largely the same, with minor adjustments for clarity)
    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string name,
        uint256 basePrice,
        uint256 totalTickets
    );
    event TicketPurchased(
        uint256 indexed ticketId,
        uint256 indexed eventId,
        address indexed buyer,
        uint256 price,
        bool isCrossChain
    );
    event TicketResaleListed(
        uint256 indexed resaleId,
        uint256 indexed ticketId,
        address indexed seller,
        uint256 listingPrice
    );
    event TicketResold(
        uint256 indexed resaleId,
        uint256 indexed ticketId,
        address seller,
        address indexed buyer,
        uint256 salePrice
    );
    event CrossChainPurchaseInitiated(
        bytes32 indexed messageId,
        uint256 eventId,
        address buyer
    );
    event EventCompleted(
        uint256 indexed eventId,
        uint256 organizerStakeReturned
    );

    // ============ CONSTRUCTOR ============

     constructor(
        address _ccipRouter,
        address _vrfCoordinator,
        address _nativePriceFeed,
        address _linkToken,
        uint64 _vrfSubscriptionId,
        bytes32 _vrfKeyHash,
        string memory _chainName,
        uint64 _chainSelector
    )
        ERC721("TickItOn", "TICK")
        CCIPReceiver(_ccipRouter)
        VRFConsumerBaseV2(_vrfCoordinator)
        Ownable(msg.sender)
    {
        ccipRouter = IRouterClient(_ccipRouter);
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        linkToken = IERC20(_linkToken);
        vrfSubscriptionId = _vrfSubscriptionId;
        vrfKeyHash = _vrfKeyHash;
        supportedChains[uint64(block.chainid)] = true;
    }

    // ============ ORGANIZER FUNCTIONS ============

    /**
     * @notice Creates a new event. Organizer must send ETH as stake.
     * @dev Call getRequiredStakeForEvent() from the frontend to determine the correct msg.value.
     */
    function createEvent(
        string memory _name,
        string memory _description,
        string memory _venue,
        uint256 _eventDate,
        uint256 _totalTickets,
        uint256 _basePrice,
        string memory _metadataURI
    ) external payable nonReentrant {
        require(_eventDate > block.timestamp, "Event date must be in future");
        require(_totalTickets > 0, "Must have at least 1 ticket");
        require(_basePrice > 0, "Base price must be greater than 0");

        uint256 requiredStake = getRequiredStakeForEvent(
            _basePrice,
            _totalTickets
        );
        require(msg.value >= requiredStake, "Insufficient stake amount");

        eventCounter++;
        uint256 newEventId = eventCounter;

        events[newEventId] = Event({
            eventId: newEventId,
            organizer: msg.sender,
            name: _name,
            description: _description,
            venue: _venue,
            eventDate: _eventDate,
            totalTickets: _totalTickets,
            basePrice: _basePrice,
            ticketsSold: 0,
            organizerStake: msg.value,
            isActive: true,
            isCompleted: false,
            metadataURI: _metadataURI
        });

        // FIX: Add to active events list for efficient upkeep and queries
        isActiveEvent[newEventId] = true;
        activeEventIds.push(newEventId);

        if (msg.value > requiredStake) {
            payable(msg.sender).transfer(msg.value - requiredStake);
        }

        emit EventCreated(
            newEventId,
            msg.sender,
            _name,
            _basePrice,
            _totalTickets
        );
    }

    // ============ TICKET PURCHASE FUNCTIONS ============

    /**
     * @notice Buys one or more tickets for an event on the same chain.
     */
    function buyTickets(
        uint256 _eventId,
        uint256 _quantity
    ) external payable nonReentrant {
        Event storage eve = events[_eventId];
        require(eve.isActive, "Event not active");
        require(
            eve.ticketsSold + _quantity <= eve.totalTickets,
            "Not enough tickets"
        );
        require(block.timestamp < eve.eventDate, "Event has ended");

        uint256 totalCost = 0;
        // FIX: Loop is still required here, but we use SafeMath and clear checks.
        // For very large quantities, this can still be gassy. A frontend limit is advised.
        for (uint256 i = 0; i < _quantity; i++) {
            totalCost =
                totalCost +
                (getCurrentTicketPriceForEvent(eve, eve.ticketsSold + (i)));
        }

        require(msg.value >= totalCost, "Insufficient payment");

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 price = getCurrentTicketPriceForEvent(eve, eve.ticketsSold);
            _mintTicket(_eventId, msg.sender, price, false);
            eve.ticketsSold++;
        }

        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        if (eve.ticketsSold % 100 == 0 && eve.ticketsSold > 0) {
            _triggerVRFReward(_eventId);
        }
    }

    /**
     * @notice Buys tickets cross-chain. User pays in native currency for tickets + CCIP fee.
     * @dev Contract must be funded with LINK tokens by the owner to pay CCIP fees.
     */
    function buyTicketsCrossChain(
        uint64 _destinationChainSelector,
        address _destinationContract,
        uint256 _eventId,
        uint256 _quantity
    ) external payable nonReentrant {
        // FIX: Improved CCIP logic. User sends native token for tickets AND fee.
        // Contract uses its own LINK balance to pay for the message.
        Client.EVM2AnyMessage memory ccipMessage = _buildBuyTicketMessage(
            _destinationChainSelector,
            _destinationContract,
            _eventId,
            _quantity
        );

        uint256 fee = ccipRouter.getFee(_destinationChainSelector, ccipMessage);
        require(msg.value > fee, "Payment must cover CCIP fee");
        require(
            linkToken.balanceOf(address(this)) >= fee,
            "Contract out of LINK fuel"
        );

        // The remaining msg.value after the fee is the payment for the tickets
        ccipMessage.tokenAmounts[0].amount = msg.value - fee;

        linkToken.approve(address(ccipRouter), fee);
        bytes32 messageId = ccipRouter.ccipSend(
            _destinationChainSelector,
            ccipMessage
        );

        emit CrossChainPurchaseInitiated(messageId, _eventId, msg.sender);
    }

    // ============ RESALE FUNCTIONS ============

    function listTicketForResale(
        uint256 _ticketId,
        uint256 _listingPrice
    ) external nonReentrant {
        require(ownerOf(_ticketId) == msg.sender, "Not ticket owner");
        Ticket storage ticket = tickets[_ticketId];
        require(!ticket.isUsed, "Ticket already used");
        require(ticketToResaleId[_ticketId] == 0, "Already listed for resale");
        Event storage eve = events[ticket.eventId];
        require(block.timestamp < eve.eventDate, "Event has ended");
        require(_listingPrice > 0, "Price must be > 0");

        resaleCounter++;
        uint256 newResaleId = resaleCounter;

        resaleListings[newResaleId] = ResaleListing({
            resaleId: newResaleId,
            ticketId: _ticketId,
            seller: msg.sender,
            listingPrice: _listingPrice,
            isActive: true,
            listedTimestamp: block.timestamp
        });

        ticketToResaleId[_ticketId] = newResaleId;

        // FIX: Add to active resales list
        isActiveResale[newResaleId] = true;
        activeResaleIds.push(newResaleId);

        emit TicketResaleListed(
            newResaleId,
            _ticketId,
            msg.sender,
            _listingPrice
        );
    }

    function buyResaleTicket(uint256 _resaleId) external payable nonReentrant {
        ResaleListing memory resale = resaleListings[_resaleId];
        require(resale.isActive, "Resale not active");
        require(msg.value >= resale.listingPrice, "Insufficient payment");

        _executeResale(_resaleId, msg.sender, resale.listingPrice);

        if (msg.value > resale.listingPrice) {
            payable(msg.sender).transfer(msg.value - resale.listingPrice);
        }
    }

    // ============ CCIP HANDLER ============

  function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
    // Call the public wrapper instead of direct internal call
    (bool success, ) = address(this).call(message.data);
    require(success, "CCIP call failed");
}
    function _processCrossChainPurchase(
        CrossChainMessage memory msgData,
        uint256 payment
    ) internal {
        Event storage eve = events[msgData.id];
        require(eve.isActive, "Event not active");
        require(
            eve.ticketsSold + (msgData.quantity) <= eve.totalTickets,
            "Not enough tickets"
        );

        uint256 totalCost = 0;
        for (uint256 i = 0; i < msgData.quantity; i++) {
            totalCost =
                totalCost +
                (getCurrentTicketPriceForEvent(eve, eve.ticketsSold + (i)));
        }
        require(payment >= totalCost, "Insufficient cross-chain payment");

        for (uint256 i = 0; i < msgData.quantity; i++) {
            uint256 price = getCurrentTicketPriceForEvent(eve, eve.ticketsSold);
            _mintTicket(msgData.id, msgData.buyer, price, true);
            eve.ticketsSold++;
        }
    }

    // ============ INTERNAL LOGIC ============

    function _executeResale(
        uint256 _resaleId,
        address _buyer,
        uint256 _payment
    ) internal {
        // --- CHECKS ---
        ResaleListing storage resale = resaleListings[_resaleId];
        Ticket storage ticket = tickets[resale.ticketId];
        Event storage eve = events[ticket.eventId];

        // --- EFFECTS (State Changes) --- FIX: Perform state changes BEFORE interactions
        resale.isActive = false;
        ticketToResaleId[resale.ticketId] = 0;
        ticket.isResale = true;

        // FIX: Efficiently remove from active list
        _removeFromArray(activeResaleIds, _resaleId);
        isActiveResale[_resaleId] = false;

        // Transfer NFT ownership
        _transfer(resale.seller, _buyer, resale.ticketId);

        // --- INTERACTIONS (External Calls) ---
        uint256 profit = _payment > ticket.purchasePrice
            ? _payment - ticket.purchasePrice
            : 0;
        uint256 sellerAmount = ticket.purchasePrice;
        uint256 platformShare = 0;
        uint256 organizerShare = 0;

        if (profit > 0) {
            platformShare = (profit * (RESALE_PLATFORM_SHARE)) / (100);
            organizerShare = (profit * (RESALE_ORGANIZER_SHARE)) / (100);
            sellerAmount =
                sellerAmount +
                (profit) -
                (platformShare) -
                (organizerShare);
        }

        payable(resale.seller).transfer(sellerAmount);
        if (platformShare > 0) payable(owner()).transfer(platformShare);
        if (organizerShare > 0) payable(eve.organizer).transfer(organizerShare);

        emit TicketResold(
            _resaleId,
            resale.ticketId,
            resale.seller,
            _buyer,
            _payment
        );
    }

    function _mintTicket(
        uint256 _eventId,
        address _to,
        uint256 _price,
        bool _isCrossChain
    ) internal {
        ticketCounter++;
        uint256 newTicketId = ticketCounter;

        tickets[newTicketId] = Ticket({
            ticketId: newTicketId,
            eventId: _eventId,
            purchasePrice: _price,
            purchaseTimestamp: block.timestamp,
            isResale: false,
            isUsed: false
        });

        userTickets[_to].push(newTicketId);
        _mint(_to, newTicketId);

        string memory tokenURI = string(
            abi.encodePacked(
                events[_eventId].metadataURI,
                "/",
                newTicketId.toString()
            )
        );
        _setTokenURI(newTicketId, tokenURI);

        emit TicketPurchased(newTicketId, _eventId, _to, _price, _isCrossChain);
    }

    // ============ VRF & AUTOMATION ============

    function _triggerVRFReward(uint256 _eventId) internal {
        uint256 requestId = vrfCoordinator.requestRandomWords(
            vrfKeyHash,
            vrfSubscriptionId,
            VRF_REQUEST_CONFIRMATIONS,
            VRF_CALLBACK_GAS_LIMIT,
            VRF_NUM_WORDS
        );
        vrfRequestToEventId[requestId] = _eventId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 eventId = vrfRequestToEventId[requestId];
        Event storage eve = events[eventId];

        if (eve.ticketsSold > 0) {
            // FIX: Winner selection does not depend on a gassy storage array.
            // It uses the ticket counter range for this event. This assumes ticket IDs for an event are contiguous.
            uint256 firstTicketId = ticketCounter - eve.ticketsSold + 1;
            uint256 winningTicketOffset = randomWords[0] % eve.ticketsSold;
            uint256 winningTicketId = firstTicketId + winningTicketOffset;

            address winner = ownerOf(winningTicketId);
            uint256 currentPrice = getCurrentTicketPriceForEvent(
                eve,
                eve.ticketsSold
            );
            uint256 reward = (currentPrice * (5)) / (100);

            if (address(this).balance >= reward) {
                payable(winner).transfer(reward);
            }
        }
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        // FIX: Iterates over the much smaller activeEventIds array, not all events ever.
        uint256[] memory eventsToComplete = new uint256[](
            activeEventIds.length
        );
        uint256 count = 0;
        for (uint i = 0; i < activeEventIds.length; i++) {
            uint256 eventId = activeEventIds[i];
            if (
                events[eventId].isActive &&
                block.timestamp > events[eventId].eventDate + 1 days
            ) {
                eventsToComplete[count] = eventId;
                count++;
            }
        }
        upkeepNeeded = count > 0;
        performData = abi.encode(eventsToComplete, count);
    }

    function performUpkeep(
        bytes calldata performData
    ) external override nonReentrant {
        (uint256[] memory eventsToComplete, uint256 count) = abi.decode(
            performData,
            (uint256[], uint256)
        );
        for (uint i = 0; i < count; i++) {
            _completeEvent(eventsToComplete[i]);
        }
    }

    function _completeEvent(uint256 _eventId) internal {
        Event storage eve = events[_eventId];
        require(eve.isActive, "Event not active or already completed");

        // --- EFFECTS ---
        eve.isActive = false;
        eve.isCompleted = true;
        _removeFromArray(activeEventIds, _eventId);
        isActiveEvent[_eventId] = false;

        // --- INTERACTIONS ---
        uint256 platformFee = (eve.organizerStake *
            (PLATFORM_FEE_BASIS_POINTS)) / (BASIS_POINTS);
        uint256 returnAmount = eve.organizerStake - (platformFee);

        payable(eve.organizer).transfer(returnAmount);
        payable(owner()).transfer(platformFee);

        emit EventCompleted(_eventId, returnAmount);
    }

    // ============ HELPER & VIEW FUNCTIONS ============

    /**
     * @notice FIX: The getter function for the frontend to calculate the EXACT stake required.
     */
    function getRequiredStakeForEvent(
        uint256 _basePrice,
        uint256 _totalTickets
    ) public pure returns (uint256) {
        // FIX: More realistic stake calculation based on average price, not max price.
        if (_totalTickets == 0) return 0;
        uint256 firstPrice = calculateDynamicPrice(_basePrice, 0);
        uint256 lastPrice = calculateDynamicPrice(
            _basePrice,
            _totalTickets - 1
        );
        uint256 avgPrice = (firstPrice + lastPrice) / 2;
        uint256 totalRevenue = avgPrice * _totalTickets;
        return (totalRevenue * ORGANIZER_STAKE_PERCENT) / 100;
    }

    function calculateDynamicPrice(
        uint256 _basePrice,
        uint256 _ticketsSold
    ) public pure returns (uint256) {
        return
            _basePrice +
            ((_basePrice * _ticketsSold * PRICE_INCREMENT_BASIS_POINTS) /
                BASIS_POINTS);
    }

    function getCurrentTicketPriceForEvent(
        Event storage eve,
        uint256 ticketsSold
    ) internal view returns (uint256) {
        return calculateDynamicPrice(eve.basePrice, ticketsSold);
    }

    function getActiveEvents(
        uint256 _offset,
        uint256 _limit
    ) external view returns (Event[] memory) {
        // FIX: Efficiently fetches from the activeEventIds list.
        uint256 end = _offset + _limit;
        if (end > activeEventIds.length) {
            end = activeEventIds.length;
        }
        if (_offset >= end) {
            return new Event[](0);
        }
        Event[] memory result = new Event[](end - _offset);
        for (uint256 i = _offset; i < end; i++) {
            result[i - _offset] = events[activeEventIds[i]];
        }
        return result;
    }

    function _buildBuyTicketMessage(
        uint64 _destinationChainSelector,
        address _destinationContract,
        uint256 _eventId,
        uint256 _quantity
    ) private view returns (Client.EVM2AnyMessage memory) {
        CrossChainMessage memory msgData = CrossChainMessage({
            buyer: msg.sender,
            id: _eventId,
            quantity: _quantity,
            sourceChainSelector: uint64(block.chainid),
            msgType: MessageType.BUY_TICKET
        });

        // Solution 1 (Recommended):
        bytes memory callData = abi.encodeWithSelector(
            this.processCrossChainPurchase.selector,
            msgData,
            0
        );

        // OR Solution 2:
        // bytes memory callData = abi.encodeWithSignature(
        //     "_processCrossChainPurchase(CrossChainMessage,uint256)",
        //     msgData,
        //     0
        // );

        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_destinationContract),
                data: callData,
                tokenAmounts: new Client.EVMTokenAmount[](1),
                extraArgs: "",
                feeToken: address(linkToken)
            });
    }

    // Add this public wrapper function (for Solution 1)
    function processCrossChainPurchase(
        CrossChainMessage memory msgData,
        uint256 payment
    ) public {
        require(msg.sender == address(this), "Unauthorized");
        _processCrossChainPurchase(msgData, payment);
    }

    function _removeFromArray(uint256[] storage array, uint256 value) internal {
        // This is still O(n), but necessary for the active ID lists.
        // For higher scale, a mapping from value to index would be needed.
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }

    // ============ ADMIN FUNCTIONS ============

    function addSupportedChain(uint64 _chainId) external onlyOwner {
        supportedChains[_chainId] = true;
    }

    function removeSupportedChain(uint64 _chainId) external onlyOwner {
        supportedChains[_chainId] = false;
    }

    function fundLink(uint256 amount) external onlyOwner {
        linkToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdrawLink(uint256 amount) external onlyOwner {
        linkToken.transfer(owner(), amount);
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ============ OVERRIDES & SUPPORTS ============

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(CCIPReceiver, ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Accept ETH deposits for CCIP payments
    receive() external payable{}
}