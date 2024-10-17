import {
  percentAmount,
  generateSigner,
  some,
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
  Cluster,
  Umi,
} from "@metaplex-foundation/umi";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { Keypair } from "@solana/web3.js";
import { base58 } from "@metaplex-foundation/umi/serializers";

// Function to switch to SOON Devnet and register required programs
export async function umiSwitchToSoonDevnet(umi: Umi) {
  // Register Token Metadata Program
  umi.programs.add(
    {
      name: "mplTokenMetadata",
      publicKey: publicKey("6C4GR9AtMGF25sjXKtdB7A6NVQUudEQWw97kG61pGuA1"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
    },
    true
  );

  // Register Candy Machine Core Program
  umi.programs.add(
    {
      name: "mplCandyMachineCore",
      publicKey: publicKey("GFmqavo1M8wEL3a4uouSCaDX5CJapcYWXTcZ4TK6L9ad"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
    },
    true
  );

  // Register Candy Machine Program
  umi.programs.add(
    {
      name: "mplCandyMachine",
      publicKey: publicKey("GFmqavo1M8wEL3a4uouSCaDX5CJapcYWXTcZ4TK6L9ad"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
    },
    true
  );

  (umi.programs as any).add(
    {
      name: "mplCandyGuard",
      publicKey: publicKey("3g5Pe9ZoDmhA4k1ooFhxgtMWNesTYRdrSAKWMfjr2YxH"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
      // ignore errors
      availableGuards: [
        "botTax",
        "solPayment",
        "tokenPayment",
        "startDate",
        "thirdPartySigner",
        "tokenGate",
        "gatekeeper",
        "endDate",
        "allowList",
        "mintLimit",
        "nftPayment",
        "redeemedAmount",
        "addressGate",
        "nftGate",
        "nftBurn",
        "tokenBurn",
        "freezeSolPayment",
        "freezeTokenPayment",
        "programGate",
        "allocation",
        "token2022Payment",
      ],
    },
    true
  );
}
// Set up the Umi instance
const umi = createUmi("https://rpc.devnet.soo.network/rpc").use(
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
const payer = Keypair.fromSecretKey(payerSecretKey);
console.log("Payer Public Key:", payer.publicKey.toBase58());

const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));

// Create a mint signer
const mint = generateSigner(umi);

// Main function to create a fungible token
async function main() {
  // Switch Umi instance to SOON Devnet by adding necessary programs
  await umiSwitchToSoonDevnet(umi);

  // Create the fungible token (e.g., BONK)
  const txResponse = await createFungible(umi, {
    mint,
    name: "BONK",
    uri: "https://idylufmhksp63vptfnctn2qcjphffwwryc5cbw4wd2xnyiqzf3ga.arweave.net/QPC6FYdUn-3V8ytFNuoCS85S2tHAuiDblh6u3CIZLsw",
    sellerFeeBasisPoints: percentAmount(5.5),
    decimals: some(7),
  }).sendAndConfirm(umi);

  const txHash = base58.deserialize(txResponse.signature);
  console.log("Transaction hash:", txHash);
}

main().catch(console.error);
