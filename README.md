Here's the updated README file with the additional information:

# Create SPL Tokens and NFTs on SOON Testnet

This guide demonstrates how to create Solana Program Library (SPL) tokens and Non-Fungible Tokens (NFTs) on the SOON testnet using the Metaplex Foundation's UMI framework and MPL Token Metadata program.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Basic understanding of Solana, SPL tokens, and NFTs
- Pinata account and API keys (from [Pinata.cloud](https://pinata.cloud))

## Installation

Install the required dependencies:

```bash
pnpm i
```

## Setup

1. Clone this repository or create a new directory for your project
2. Make sure you have a funded wallet on SOON testnet
3. Obtain your Pinata API keys from the [Pinata.cloud](https://pinata.cloud) website and add them to a `.env` file in the project directory:
   ```
   PINATA_JWT=your_pinata_jwt_here
   PINATA_GATEWAY_TOKEN=your_pinata_gateway_token_here
   ```

## Configuration

The code uses the following main components:

- UMI instance connected to SOON testnet
- Payer keypair for signing transactions
- Mint signer for the new token and NFT

### Important Variables

- `umi`: UMI instance connected to SOON testnet RPC endpoint
- `payerSecretKey`: Your wallet's secret key (Keep this secure!)
- `mint`: Newly generated token mint address
- `NFTsigner`: Signer for creating the new NFT

## SPL Token Parameters

The SPL token is created with the following parameters:

- Name: "BONK"
- Decimals: 7
- Seller Fee: 5.5%
- URI: Points to metadata stored on Pinata

## NFT Parameters

The NFT is created with the following parameters:

- Name: "My NFT"
- Description: "This is an NFT on SOON"
- Image: Hosted on Pinata
- External URL: "https://x.com/soon-svm"
- Attributes: "trait1" and "trait2"

## Usage

1. Replace the `payerSecretKey` with your own wallet's secret key
2. Modify the token and NFT parameters in the `main()` function as needed:
   - SPL Token: `name`, `uri`, `sellerFeeBasisPoints`, `decimals`
   - NFT: `name`, `description`, `image`, `external_url`, `attributes`
3. Run the script:

```bash
pnpm nft
```

## Output

The script will output:

- Payer's SOL balance
- Payer's public key
- New token's mint address
- New NFT's mint address
- Transaction hashes

## Security Considerations

- Never commit your secret key to version control
- Store sensitive information in environment variables
- Ensure your wallet has sufficient SOL for transaction fees

## Network Selection

The code is configured for SOON testnet. To use different networks:

- [Devnet](https://rpc.devnet.soo.network/rpc)
- [Testnet](https://rpc.testnet.soo.network/rpc)

## Contributing

Feel free to submit issues and enhancement requests!
