# Create SPL Token on SOON Network

## Overview

Create a fungible SPL token on SOON Network using Metaplex's UMI framework and MPL Token Metadata program.

## Prerequisites

- Node.js v14 or higher
- npm or yarn
- SOON Network wallet with testnet/devnet SOL

## Installation

```bash
npm install @metaplex-foundation/umi @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi-bundle-defaults @solana/web3.js
```

## Code Example

```typescript
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

// Function to switch to SOON and register required programs
export async function umiSwitchToSoon(umi: Umi) {
  // Register Token Metadata Program
  const mplTokenMetadataTestnet = publicKey(
    "6C4GR9AtMGF25sjXKtdB7A6NVQUudEQWw97kG61pGuA1"
  );
  
  umi.programs.add(
    {
      name: "mplTokenMetadata",
      publicKey: mplTokenMetadataTestnet,
      getErrorFromCode: (code: number) => null,
      getErrorFromName: (name: string) => null,
      isOnCluster: (cluster: Cluster) => true,
    },
    true
  );
}

// Set up Umi instance
const umi = createUmi("https://rpc.testnet.soo.network/rpc").use(mplTokenMetadata());

// Your wallet secret key (Keep this secure!)
const payerSecretKey = new Uint8Array([/* Your secret key here */]);

// Create keypair and signer
let keypair = umi.eddsa.createKeypairFromSecretKey(payerSecretKey);
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));

// Create mint signer
const mint = generateSigner(umi);

// Main function
async function main() {
  await umiSwitchToSoon(umi);

  const txResponse = await createFungible(umi, {
    mint,
    name: "YOUR_TOKEN",
    uri: "YOUR_METADATA_URI",
    sellerFeeBasisPoints: percentAmount(5.5),
    decimals: some(7),
  }).sendAndConfirm(umi);

  console.log("New mint:", mint.publicKey);
  console.log("Transaction:", base58.deserialize(txResponse.signature));
}

main().catch(console.error);
```

## Configuration Options

### Program IDs

#### Testnet
- Token Metadata: `6C4GR9AtMGF25sjXKtdB7A6NVQUudEQWw97kG61pGuA1`
- Candy Machine Core: `2g5gta4shjCtCmMA6mzJ2wbj2P9QtPQuY27gK7z3pv5j`
- Candy Guard: `FFwcwSGPurGpQsu41wXFVZpgmWJgoZbpqcLF84eKNeM1`

#### Devnet
- Token Metadata: `6C4GR9AtMGF25sjXKtdB7A6NVQUudEQWw97kG61pGuA1`
- Candy Machine Core: `GFmqavo1M8wEL3a4uouSCaDX5CJapcYWXTcZ4TK6L9ad`
- Candy Guard: `3g5Pe9ZoDmhA4k1ooFhxgtMWNesTYRdrSAKWMfjr2YxH`

### Token Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| name | Token name | "BONK" |
| uri | Metadata URI | "https://..." |
| sellerFeeBasisPoints | Fee percentage (100 = 1%) | percentAmount(5.5) |
| decimals | Decimal places | some(7) |

## Running the Script

1. Save the code as `create-token.ts`
2. Update the configuration:
   - Add your wallet's secret key
   - Set your token's name and metadata URI
   - Adjust other parameters as needed
3. Run the script:
```bash
ts-node create-token.ts
```

## Security Notes

- Never commit private keys to version control
- Always test on testnet before mainnet
- Verify all parameters before deployment
- Keep dependencies updated
- Use secure metadata storage

## Troubleshooting

### Common Issues

1. RPC Connection Errors
   - Verify SOON Network RPC endpoint
   - Check network status

2. Transaction Failures
   - Ensure sufficient SOL balance
   - Verify program IDs
   - Check parameter validity

3. Metadata Issues
   - Verify URI accessibility
   - Ensure metadata format is correct

## Resources

- [SOON Network Documentation](https://docs.soo.network)
- [Metaplex Documentation](https://developers.metaplex.com/)
- [UMI Framework Guide](https://github.com/metaplex-foundation/umi)

## Support

For issues and questions:
- Create an issue in the repository
- Check SOON Discord
- Refer to Metaplex documentation
