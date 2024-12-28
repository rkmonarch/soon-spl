import {
  percentAmount,
  generateSigner,
  some,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { base58 } from "@metaplex-foundation/umi/serializers";

//change this to devnet/testnet accordingly
const umi = createUmi("https://rpc.testnet.soo.network/rpc");

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

// Create a mint signer
const mint = generateSigner(umi);

// Main function to create a fungible token
async function main() {
  // Create the fungible token (e.g., BONK)
  const txResponse = await createFungible(umi, {
    mint,
    name: "BONK",
    uri: "https://idylufmhksp63vptfnctn2qcjphffwwryc5cbw4wd2xnyiqzf3ga.arweave.net/QPC6FYdUn-3V8ytFNuoCS85S2tHAuiDblh6u3CIZLsw",
    sellerFeeBasisPoints: percentAmount(5.5),
    decimals: some(7),
  }).sendAndConfirm(umi);

  const txHash = base58.deserialize(txResponse.signature);
  console.log("newly created mint:", mint.publicKey);
  console.log("Transaction hash:", txHash);
}

main().catch(console.error);
