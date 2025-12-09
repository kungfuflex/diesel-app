// Vault configuration data
export interface VaultConfig {
  id: string;
  name: string;
  description: string;
  tokenId: string; // Alkane ID like "2:0"
  tokenSymbol: string;
  iconPath?: string; // Direct path to token icon (e.g., "/tokens/btc_snowflake.svg")
  contractAddress: string;
  badge?: string;
  type: 'unit-vault';
  inputAsset: string;
  outputAsset: string;
  estimatedApy?: string;
  historicalApy?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'very-high';
  // Boost configuration
  hasBoost: boolean;
  boostTokenSymbol?: string; // e.g., "vxDIESEL"
  boostTokenName?: string;
  boostMultiplier?: number; // Boost multiplier value (e.g., 1.5 for 1.5x)
  isBoostComingSoon?: boolean; // For FROST-based boosts
  escrowNftName?: string; // For special vaults like dxBTC
}

// DIESEL App - Only veDIESEL vault and BTC collateral
export const AVAILABLE_VAULTS: VaultConfig[] = [
  {
    id: 've-diesel',
    name: 'veDIESEL Vault',
    description: 'Stake DIESEL for boosted yield and governance power',
    tokenId: '2:0',
    tokenSymbol: 'DIESEL',
    iconPath: 'https://asset.oyl.gg/alkanes/mainnet/2-0.png',
    contractAddress: '2:0', // DIESEL alkane contract
    badge: 'Active',
    type: 'unit-vault',
    inputAsset: 'DIESEL',
    outputAsset: 'veDIESEL',
    estimatedApy: '21',
    riskLevel: 'medium',
    hasBoost: true,
    boostTokenSymbol: 'vxDIESEL',
    boostTokenName: 'Staked DIESEL Gauge',
    boostMultiplier: 1.5,
  },
  {
    id: 'btc-collateral',
    name: 'BTC Collateral Vault',
    description: 'Deposit BTC as collateral to borrow DIESEL',
    tokenId: 'btc',
    tokenSymbol: 'BTC',
    iconPath: '/tokens/btc.svg',
    contractAddress: '4:7936', // Use dxBTC contract for collateral
    badge: 'Coming Soon',
    type: 'unit-vault',
    inputAsset: 'BTC',
    outputAsset: 'DIESEL',
    estimatedApy: '0', // Borrowing vault, not yield
    riskLevel: 'medium',
    hasBoost: false,
  },
];
