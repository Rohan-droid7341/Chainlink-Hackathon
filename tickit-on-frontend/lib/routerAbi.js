// lib/routerAbi.js
export const routerAbi = [
    {
        "inputs": [
            { "internalType": "uint64", "name": "destinationChainSelector", "type": "uint64" },
            {
                "components": [
                    { "internalType": "bytes", "name": "receiver", "type": "bytes" },
                    { "internalType": "bytes", "name": "data", "type": "bytes" },
                    { "internalType": "tuple[]", "name": "tokenAmounts", "type": "tuple[]", "components": [ { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ] },
                    { "internalType": "address", "name": "feeToken", "type": "address" },
                    { "internalType": "bytes", "name": "extraArgs", "type": "bytes" }
                ],
                "internalType": "struct Client.EVM2AnyMessage",
                "name": "message",
                "type": "tuple"
            }
        ],
        "name": "getFee",
        "outputs": [ { "internalType": "uint256", "name": "fee", "type": "uint256" } ],
        "stateMutability": "view",
        "type": "function"
    }
];