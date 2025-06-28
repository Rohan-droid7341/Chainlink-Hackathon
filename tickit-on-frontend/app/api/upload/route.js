// app/api/upload/route.js
import { NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');
    const eventName = data.get('name');
    const eventDescription = data.get('description');

    if (!file || !eventName || !eventDescription) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 });
    }

    // 1. Upload image to Pinata
    const fileBuffer = await buffer(file.stream());
    const stream = Readable.from(fileBuffer);
    const imageResult = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: { name: `${eventName}-image` },
    });
    const imageUri = `ipfs://${imageResult.IpfsHash}`;

    // 2. Create and upload metadata JSON
    const metadata = {
      name: eventName,
      description: eventDescription,
      image: imageUri,
    };
    const metadataResult = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: { name: `${eventName}-metadata` },
    });
    
    // This is the base URI for all tickets of this event
    const baseMetadataUri = `ipfs://${metadataResult.IpfsHash}`;

    return NextResponse.json({ success: true, ipfsUri: baseMetadataUri }, { status: 200 });

  } catch (error) {
    console.error('Pinata upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}