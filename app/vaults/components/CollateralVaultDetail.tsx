'use client';

import { useState } from 'react';
import { VaultConfig } from '../constants';
import TokenIcon from '@/app/components/TokenIcon';
import { useWallet } from '@/context/WalletContext';

type Props = {
  vault: VaultConfig;
};

export default function CollateralVaultDetail({ vault }: Props) {
  const { isConnected, onConnectModalOpenChange } = useWallet() as any;
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');

  // Mock collateral ratio
  const collateralRatio = 150; // 150% collateralization
  const maxBorrowRatio = 66.67; // Can borrow up to 66.67% of collateral value

  // Calculate max borrow based on collateral
  const calculateMaxBorrow = (btcAmount: string) => {
    const btc = parseFloat(btcAmount) || 0;
    // Assuming 1 BTC = 100,000 DIESEL (mock rate)
    const dieselPerBtc = 100000;
    return (btc * dieselPerBtc * (maxBorrowRatio / 100)).toFixed(2);
  };

  // Calculate health factor
  const calculateHealthFactor = () => {
    const collateral = parseFloat(collateralAmount) || 0;
    const borrow = parseFloat(borrowAmount) || 0;
    if (borrow === 0) return 'N/A';
    const dieselPerBtc = 100000;
    const collateralValue = collateral * dieselPerBtc;
    const healthFactor = collateralValue / borrow;
    return healthFactor.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl border-2 border-[color:var(--sf-glass-border)] bg-[color:var(--sf-glass-bg)] backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="diesel-rainbow-bar"></div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full border-2 border-[color:var(--sf-primary)]/30 bg-[color:var(--sf-primary)]/10 flex items-center justify-center">
              <TokenIcon id={vault.tokenId} symbol={vault.tokenSymbol} size="lg" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[color:var(--sf-text)]">{vault.name}</h1>
              <p className="text-[color:var(--sf-muted)]">{vault.description}</p>
            </div>
            <div className="rounded-full bg-[color:var(--sf-info-yellow-bg)] border border-[color:var(--sf-info-yellow-border)] px-4 py-1">
              <span className="text-sm font-bold text-[color:var(--sf-info-yellow-title)]">
                {vault.badge}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-4 border border-[color:var(--sf-outline)]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                Collateral Ratio
              </div>
              <div className="text-xl font-bold text-[color:var(--sf-text)]">{collateralRatio}%</div>
            </div>
            <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-4 border border-[color:var(--sf-outline)]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                Max LTV
              </div>
              <div className="text-xl font-bold text-[color:var(--sf-text)]">{maxBorrowRatio}%</div>
            </div>
            <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-4 border border-[color:var(--sf-outline)]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                Liquidation Threshold
              </div>
              <div className="text-xl font-bold text-[color:var(--sf-text)]">80%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Collateral input */}
        <div className="rounded-xl border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]/60 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-[color:var(--sf-text)] mb-4">Deposit Collateral</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[color:var(--sf-muted)] mb-2">
              BTC Amount
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="w-full rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] px-4 py-3 text-lg font-bold text-[color:var(--sf-text)] focus:outline-none focus:border-[color:var(--sf-primary)] pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <TokenIcon id="btc" symbol="BTC" size="sm" />
                <span className="text-sm font-bold text-[color:var(--sf-text)]">BTC</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[color:var(--sf-info-blue-bg)] border border-[color:var(--sf-info-blue-border)]">
            <div className="text-sm text-[color:var(--sf-info-blue-title)] mb-1">
              Maximum DIESEL you can borrow:
            </div>
            <div className="text-xl font-bold text-[color:var(--sf-info-blue-text)]">
              {calculateMaxBorrow(collateralAmount)} DIESEL
            </div>
          </div>
        </div>

        {/* Right: Borrow input */}
        <div className="rounded-xl border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]/60 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-[color:var(--sf-text)] mb-4">Borrow DIESEL</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[color:var(--sf-muted)] mb-2">
              DIESEL Amount
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="w-full rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] px-4 py-3 text-lg font-bold text-[color:var(--sf-text)] focus:outline-none focus:border-[color:var(--sf-primary)] pr-24"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <TokenIcon id="2:0" symbol="DIESEL" size="sm" />
                <span className="text-sm font-bold text-[color:var(--sf-text)]">DIESEL</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[color:var(--sf-surface)]/50 border border-[color:var(--sf-outline)]">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[color:var(--sf-muted)]">Health Factor:</span>
              <span className={`text-sm font-bold ${
                parseFloat(calculateHealthFactor()) >= 1.5
                  ? 'text-[color:var(--sf-info-green-title)]'
                  : parseFloat(calculateHealthFactor()) >= 1.2
                  ? 'text-[color:var(--sf-info-yellow-title)]'
                  : 'text-[color:var(--sf-info-red-title)]'
              }`}>
                {calculateHealthFactor()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[color:var(--sf-muted)]">Borrow APR:</span>
              <span className="text-sm font-bold text-[color:var(--sf-text)]">5.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="rounded-xl border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]/60 p-6 backdrop-blur-sm">
        {vault.badge === 'Coming Soon' ? (
          <div className="text-center">
            <div className="p-4 rounded-lg bg-[color:var(--sf-info-yellow-bg)] border border-[color:var(--sf-info-yellow-border)] mb-4">
              <div className="text-lg font-bold text-[color:var(--sf-info-yellow-title)] mb-1">
                Coming Soon
              </div>
              <div className="text-sm text-[color:var(--sf-info-yellow-text)]">
                BTC collateral borrowing for DIESEL is under development.
                Join our community to be notified when this feature launches.
              </div>
            </div>
            <button
              disabled
              className="w-full rounded-xl bg-[color:var(--sf-outline)] px-6 py-4 text-lg font-bold text-[color:var(--sf-muted)] cursor-not-allowed"
            >
              Borrowing Coming Soon
            </button>
          </div>
        ) : isConnected ? (
          <button
            className="w-full rounded-xl bg-[color:var(--sf-primary)] px-6 py-4 text-lg font-bold text-black transition-colors hover:bg-[color:var(--sf-primary-pressed)] focus:outline-none"
          >
            Deposit Collateral & Borrow
          </button>
        ) : (
          <button
            onClick={() => onConnectModalOpenChange(true)}
            className="w-full rounded-xl bg-[color:var(--sf-primary)] px-6 py-4 text-lg font-bold text-black transition-colors hover:bg-[color:var(--sf-primary-pressed)] focus:outline-none"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Info section */}
      <div className="rounded-xl bg-[color:var(--sf-info-blue-bg)] border border-[color:var(--sf-info-blue-border)] p-4">
        <h3 className="text-sm font-bold text-[color:var(--sf-info-blue-title)] mb-2">
          How BTC Collateral Works
        </h3>
        <ul className="text-sm text-[color:var(--sf-info-blue-text)] space-y-1">
          <li>1. Deposit BTC as collateral to the vault</li>
          <li>2. Borrow up to {maxBorrowRatio}% of your collateral value in DIESEL</li>
          <li>3. Pay back your DIESEL debt plus interest to withdraw your BTC</li>
          <li>4. If your health factor falls below 1.0, your collateral may be liquidated</li>
        </ul>
      </div>
    </div>
  );
}
