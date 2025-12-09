'use client';

import { useMemo } from 'react';
import { usePools } from '@/hooks/usePools';
import { useAlkanesSDK } from '@/context/AlkanesSDKContext';
import TokenIcon from '@/app/components/TokenIcon';

function formatPrice(n: number, decimals = 8): string {
  if (n === 0) return '0';
  if (n < 0.00000001) return n.toExponential(2);
  if (n < 0.0001) return n.toFixed(8);
  if (n < 1) return n.toFixed(6);
  if (n < 100) return n.toFixed(4);
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatUsd(n: number): string {
  if (n === 0) return '$0.00';
  if (n < 0.01) return `$${n.toFixed(6)}`;
  if (n < 1) return `$${n.toFixed(4)}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(n);
}

export default function DieselPriceCard() {
  const { data: poolsData, isLoading } = usePools({ sortBy: 'tvl', order: 'desc', limit: 200 });
  const { bitcoinPrice } = useAlkanesSDK();

  // Find DIESEL pools and calculate price
  const dieselData = useMemo(() => {
    if (!poolsData?.items) return null;

    // Find pools with DIESEL
    const dieselPools = poolsData.items.filter(
      p => p.token0.symbol === 'DIESEL' || p.token1.symbol === 'DIESEL'
    );

    if (dieselPools.length === 0) return null;

    // Get the highest TVL DIESEL pool for price
    const topPool = dieselPools[0];

    // Calculate DIESEL price in BTC from pool ratio
    // This is a simplified calculation - real price would need reserves
    const totalTvl = dieselPools.reduce((sum, p) => sum + (p.tvlUsd || 0), 0);
    const totalVol = dieselPools.reduce((sum, p) => sum + (p.vol24hUsd || 0), 0);

    // Estimate price from TVL (very rough approximation)
    // Better would be to get actual reserves
    // Assume 1M DIESEL per side for estimation
    const btcPriceUsd = bitcoinPrice?.usd || 0;
    const estimatedPriceInBtc = topPool.tvlUsd && btcPriceUsd
      ? (topPool.tvlUsd / 2) / (btcPriceUsd * 1000000)
      : 0.00001;

    const priceInUsd = estimatedPriceInBtc * btcPriceUsd;

    return {
      priceInBtc: estimatedPriceInBtc,
      priceInUsd,
      totalTvl,
      totalVol24h: totalVol,
      poolCount: dieselPools.length,
      topPool,
      btcPriceUsd,
    };
  }, [poolsData, bitcoinPrice]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border-2 border-[color:var(--sf-glass-border)] bg-[color:var(--sf-glass-bg)] backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="diesel-rainbow-bar"></div>
        <div className="p-6 animate-pulse">
          <div className="h-8 bg-[color:var(--sf-primary)]/10 rounded mb-4"></div>
          <div className="h-12 bg-[color:var(--sf-primary)]/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[color:var(--sf-glass-border)] bg-[color:var(--sf-glass-bg)] backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      <div className="diesel-rainbow-bar"></div>
      <div className="px-6 py-4 border-b-2 border-[color:var(--sf-glass-border)] bg-[color:var(--sf-surface)]/40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[color:var(--sf-glass-border)] bg-[color:var(--sf-primary)]/10 flex items-center justify-center">
            <TokenIcon id="2:0" symbol="DIESEL" size="md" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[color:var(--sf-text)]">DIESEL</h3>
            <span className="text-xs text-[color:var(--sf-muted)]">Alkane 2:0</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {dieselData ? (
          <>
            {/* Price display */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-[color:var(--sf-primary)] mb-1">
                {formatPrice(dieselData.priceInBtc)} BTC
              </div>
              <div className="text-lg text-[color:var(--sf-muted)]">
                {formatUsd(dieselData.priceInUsd)}
              </div>
            </div>

            {/* Mini chart placeholder - would need historical data */}
            <div className="mb-6 h-24 rounded-lg bg-[color:var(--sf-surface)]/50 border border-[color:var(--sf-outline)] flex items-center justify-center">
              <div className="flex flex-col items-center text-[color:var(--sf-muted)]">
                <svg className="w-8 h-8 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <span className="text-xs">Historical chart coming soon</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-3 border border-[color:var(--sf-outline)]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                  Total TVL
                </div>
                <div className="font-bold text-[color:var(--sf-text)]">
                  {dieselData.totalTvl > 0 ? formatUsd(dieselData.totalTvl) : '-'}
                </div>
              </div>
              <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-3 border border-[color:var(--sf-outline)]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                  24h Volume
                </div>
                <div className="font-bold text-[color:var(--sf-text)]">
                  {dieselData.totalVol24h > 0 ? formatUsd(dieselData.totalVol24h) : '-'}
                </div>
              </div>
              <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-3 border border-[color:var(--sf-outline)]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                  Active Pools
                </div>
                <div className="font-bold text-[color:var(--sf-text)]">
                  {dieselData.poolCount}
                </div>
              </div>
              <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-3 border border-[color:var(--sf-outline)]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                  BTC Price
                </div>
                <div className="font-bold text-[color:var(--sf-text)]">
                  {dieselData.btcPriceUsd ? formatUsd(dieselData.btcPriceUsd) : '-'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-[color:var(--sf-muted)] mb-2">No DIESEL pools found</div>
            <div className="text-sm text-[color:var(--sf-muted)]/60">
              Price data will appear when DIESEL liquidity pools are available
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
