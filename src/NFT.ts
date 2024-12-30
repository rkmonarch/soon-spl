import {
  percentAmount,
  generateSigner,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { PinataSDK } from "pinata-web3";
import dotenv from "dotenv";

dotenv.config();

//change this to devnet/testnet accordingly

const umi = createUmi("https://rpc.testnet.soo.network/rpc").use(
  mplTokenMetadata()
);

// Payer secret key for signing transactions
const payerSecretKey = new Uint8Array([
  76, 60, 24, 27, 26, 104, 22, 123, 246, 52, 214, 198, 10, 246, 175, 59, 226,
  42, 241, 107, 240, 38, 153, 151, 192, 31, 225, 231, 201, 8, 121, 47, 130, 217,
  85, 194, 247, 119, 40, 178, 133, 254, 195, 158, 205, 55, 130, 98, 240, 239,
  31, 184, 237, 201, 107, 75, 71, 209, 96, 47, 5, 74, 116, 65,
]);

// Create keypair and signer
let keypair = umi.eddsa.createKeypairFromSecretKey(payerSecretKey);
const balance = await umi.rpc.getBalance(keypair.publicKey);
console.log(
  "Payer Balance:",
  (Number(balance.basisPoints) / LAMPORTS_PER_SOL).toFixed(2),
  "SOL"
);
const payer = Keypair.fromSecretKey(payerSecretKey);
console.log("Payer Public Key:", payer.publicKey.toBase58());

const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));

// Create a nft signer
const NFTsigner = generateSigner(umi);

// Main function to create a non-fungible token
async function main() {
  const metadata = {
    name: "My NFT",
    description: "This is an NFT on SOON",
    image:
      "https://pinnieblog.mypinata.cloud/ipfs/QmP4eZj61tDxCmtb6aqSwQsrxRQAN2gwxTEXkTed9TujHh?ref=pinata.cloud",
    external_url: "https://x.com/soon-svm",
    attributes: [
      {
        trait_type: "trait1",
        value: "value1",
      },
      {
        trait_type: "trait2",
        value: "value2",
      },
    ],
    properties: {
      files: [
        {
          uri: "https://pinnieblog.mypinata.cloud/ipfs/QmP4eZj61tDxCmtb6aqSwQsrxRQAN2gwxTEXkTed9TujHh?ref=pinata.cloud",
          type: "image/png",
        },
      ],
      category: "image",
    },
  };

  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: "emerald-worldwide-canid-619.mypinata.cloud",
  });

  const upload = await pinata.upload.json(metadata);

  console.log("Uploaded metadata to IPFS:", upload.IpfsHash);

  const metadatauri = `https://emerald-worldwide-canid-619.mypinata.cloud/ipfs/${upload.IpfsHash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`;
  console.log(metadatauri);
  const tx = await createNft(umi, {
    mint: NFTsigner,
    sellerFeeBasisPoints: percentAmount(5.5),
    name: "My NFT",
    uri: metadatauri,
  }).sendAndConfirm(umi);

  console.log(base58.deserialize(tx.signature)[0]);
  console.log("newly created mint:", NFTsigner.publicKey);
}

main().catch(console.error);
