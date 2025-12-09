# DIESEL

A Bitcoin DeFi application for DIESEL token - stake, swap, and earn on Bitcoin using Alkanes.

## Features

- **veDIESEL Staking** - Stake DIESEL tokens for boosted yield and governance power
- **Token Swapping** - Swap DIESEL with other Alkane tokens via AMM pools
- **DIESEL Minting** - Mint new DIESEL tokens directly from the alkane contract
- **BTC Collateral** - (Coming Soon) Deposit BTC as collateral to borrow DIESEL
- **Price Tracking** - Real-time DIESEL price from liquidity pools
- **Wallet Integration** - Connect via Unisat, Xverse, or OYL wallets
- **Dark Mode** - Orange-accented dark theme with rainbow gradient highlights

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript 5
- **Tailwind CSS 4**
- **alkanes-web-sys** - WASM bindings for Alkanes protocol
- **TanStack React Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/subfrost/diesel-app.git
cd diesel-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
diesel-app/
├── app/
│   ├── components/          # Shared UI components
│   │   ├── DieselPriceCard.tsx    # DIESEL price display
│   │   ├── Header.tsx             # Navigation header
│   │   ├── TokenIcon.tsx          # Token icon component
│   │   └── ...
│   ├── mint/                # DIESEL minting page
│   ├── swap/                # Token swap interface
│   ├── vaults/              # Staking vaults
│   │   ├── components/
│   │   │   ├── VaultDetail.tsx           # veDIESEL staking
│   │   │   └── CollateralVaultDetail.tsx # BTC collateral
│   │   └── constants.ts     # Vault configurations
│   └── page.tsx             # Home page
├── context/
│   ├── WalletContext.tsx    # Wallet connection state
│   ├── AlkanesSDKContext.tsx # alkanes-web-sys provider
│   └── ExchangeContext.tsx  # Token/pool data
├── hooks/                   # React hooks
└── lib/                     # Utilities and API clients
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Home - DIESEL price, vault tiles, trending pairs |
| `/swap` | Swap DIESEL with other tokens |
| `/vaults` | Stake DIESEL in veDIESEL vault |
| `/mint` | Mint new DIESEL tokens |

## DIESEL Token

- **Alkane ID:** `2:0`
- **Symbol:** DIESEL
- **Network:** Bitcoin (mainnet/testnet)

## Vaults

### veDIESEL Vault
Stake DIESEL tokens to receive veDIESEL, which provides:
- Boosted yield from protocol fees
- Governance voting power
- Lock periods from 1 week to 4 years

### BTC Collateral Vault (Coming Soon)
Deposit BTC as collateral to borrow DIESEL:
- 150% collateralization ratio
- 66.67% max LTV
- 80% liquidation threshold

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Custom RPC endpoints
NEXT_PUBLIC_BITCOIN_RPC_URL=https://your-rpc-url
```

### Network Selection

The app supports mainnet and testnet. Network selection is available in the wallet connection modal.

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## Deployment

### Vercel (Recommended)

Deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/subfrost/diesel-app)

### Manual Deployment

```bash
npm run build
npm start
```

The app runs on port 3000 by default.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT

## Links

- [Alkanes Protocol](https://github.com/kungfuflex/alkanes-rs)
- [alkanes-web-sys](https://github.com/kungfuflex/alkanes-web-sys)
