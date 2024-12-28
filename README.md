# Create SPL Tokens on SOON Testnet

This guide demonstrates how to create Solana Program Library (SPL) tokens on the SOON testnet using the Metaplex Foundation's UMI framework and MPL Token Metadata program.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Basic understanding of Solana and SPL tokens

## Installation

Install the required dependencies:

```bash
pnpm i
```

## Setup

1. Clone this repository or create a new directory for your project
2. Make sure you have a funded wallet on SOON testnet

## Configuration

The code uses the following main components:

- UMI instance connected to SOON testnet
- Payer keypair for signing transactions
- Mint signer for the new token

### Important Variables

- `umi`: UMI instance connected to SOON testnet RPC endpoint
- `payerSecretKey`: Your wallet's secret key (Keep this secure!)
- `mint`: Newly generated token mint address

## Token Parameters

The token is created with the following parameters:

- Name: "BONK"
- Decimals: 7
- Seller Fee: 5.5%
- URI: Points to metadata stored on Arweave

## Usage

1. Replace the `payerSecretKey` with your own wallet's secret key
2. Modify the token parameters in the `main()` function as needed:
   - `name`: Your token's name
   - `uri`: Link to your token's metadata
   - `sellerFeeBasisPoints`: Seller fee percentage
   - `decimals`: Number of decimal places

3. Run the script:
```bash
pnpm start
```

## Output

The script will output:
- Payer's SOL balance
- Payer's public key
- New token's mint address
- Transaction hash

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
