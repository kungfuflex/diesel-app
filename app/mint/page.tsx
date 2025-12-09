'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { useAlkanesSDK } from '@/context/AlkanesSDKContext';
import AlkanesMainWrapper from '@/app/components/AlkanesMainWrapper';
import PageContent from '@/app/components/PageContent';
import TokenIcon from '@/app/components/TokenIcon';

// DIESEL alkane ID
const DIESEL_ALKANE_ID = '2:0';

type AlkaneReflection = {
  id: string;
  name: string;
  symbol: string;
  total_supply: string;
  cap: string;
  minted: string;
  value_per_mint: string;
  decimals: number;
};

function formatNumber(n: string | number, decimals = 8): string {
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num)) return '0';
  return (num / Math.pow(10, decimals)).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
  });
}

export default function MintPage() {
  const { isConnected, address, onConnectModalOpenChange } = useWallet() as any;
  const { provider, isInitialized } = useAlkanesSDK();

  const [tokenData, setTokenData] = useState<AlkaneReflection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mintAmount, setMintAmount] = useState('1');
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{ txid: string } | null>(null);

  // Fetch DIESEL token data
  useEffect(() => {
    async function fetchTokenData() {
      if (!provider || !isInitialized) return;

      setIsLoading(true);
      setError(null);

      try {
        const reflection = await provider.alkanesReflect(DIESEL_ALKANE_ID);
        console.log('[MintPage] DIESEL reflection:', reflection);
        setTokenData(reflection);
      } catch (err) {
        console.error('[MintPage] Failed to fetch DIESEL data:', err);
        setError('Failed to load DIESEL token data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokenData();
  }, [provider, isInitialized]);

  const handleMint = async () => {
    if (!provider || !isConnected || !tokenData) return;

    setIsMinting(true);
    setError(null);
    setMintResult(null);

    try {
      // For DIESEL minting, we need to call the mint function
      // The exact implementation depends on the alkane contract
      // This is a placeholder - actual implementation may vary

      const [block, tx] = DIESEL_ALKANE_ID.split(':');
      const mintOpcode = '77'; // Common mint opcode - may need adjustment

      // Build protostone for mint
      const cellpack = [block, tx, mintOpcode, mintAmount].join(',');
      const protostone = `[${cellpack}]:0:0`;

      // Execute mint transaction
      const result = await provider.alkanesExecuteWithStrings(
        JSON.stringify([address]), // to addresses
        '', // no input requirements for basic mint
        protostone,
        10, // fee rate
        '', // no envelope
        JSON.stringify({}) // options
      );

      console.log('[MintPage] Mint result:', result);

      if (result?.txid || result?.reveal_txid) {
        setMintResult({ txid: result.txid || result.reveal_txid });
      } else {
        throw new Error('Mint transaction failed - no txid returned');
      }
    } catch (err: any) {
      console.error('[MintPage] Mint failed:', err);
      setError(err.message || 'Mint transaction failed');
    } finally {
      setIsMinting(false);
    }
  };

  // Calculate mint stats
  const mintProgress = tokenData
    ? (parseFloat(tokenData.minted) / parseFloat(tokenData.cap)) * 100
    : 0;
  const isMintActive = tokenData
    ? parseFloat(tokenData.cap) > 0 && parseFloat(tokenData.minted) < parseFloat(tokenData.cap)
    : false;

  return (
    <AlkanesMainWrapper>
      <PageContent className="px-4 md:px-5">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6">
          {/* Header */}
          <div className="text-center py-4">
            <h1 className="text-3xl font-bold text-[color:var(--sf-text)] mb-2">
              Mint <span className="text-[color:var(--sf-primary)]">DIESEL</span>
            </h1>
            <div className="diesel-rainbow-bar max-w-xs mx-auto rounded-full mb-3"></div>
            <p className="text-[color:var(--sf-muted)]">
              Mint DIESEL tokens using alkanes-web-sys
            </p>
          </div>

          {/* Main card */}
          <div className="rounded-2xl border-2 border-[color:var(--sf-glass-border)] bg-[color:var(--sf-glass-bg)] backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            <div className="diesel-rainbow-bar"></div>

            {isLoading ? (
              <div className="p-8 animate-pulse">
                <div className="h-20 bg-[color:var(--sf-primary)]/10 rounded-lg mb-4"></div>
                <div className="h-12 bg-[color:var(--sf-primary)]/10 rounded-lg"></div>
              </div>
            ) : error && !tokenData ? (
              <div className="p-8 text-center">
                <div className="text-[color:var(--sf-info-red-title)] mb-2">{error}</div>
                <p className="text-[color:var(--sf-muted)] text-sm">
                  Unable to load DIESEL token information
                </p>
              </div>
            ) : tokenData ? (
              <div className="p-6">
                {/* Token info */}
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-[color:var(--sf-surface)]/50 border border-[color:var(--sf-outline)]">
                  <div className="h-16 w-16 rounded-full border-2 border-[color:var(--sf-primary)]/30 bg-[color:var(--sf-primary)]/10 flex items-center justify-center">
                    <TokenIcon id={DIESEL_ALKANE_ID} symbol="DIESEL" size="lg" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-[color:var(--sf-text)]">
                      {tokenData.name || 'DIESEL'}
                    </div>
                    <div className="text-[color:var(--sf-muted)]">
                      {tokenData.symbol || 'DIESEL'} (Alkane {DIESEL_ALKANE_ID})
                    </div>
                  </div>
                </div>

                {/* Mint progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[color:var(--sf-muted)]">Mint Progress</span>
                    <span className="text-[color:var(--sf-text)] font-medium">
                      {mintProgress.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(mintProgress, 100)}%`,
                        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 text-[color:var(--sf-muted)]">
                    <span>Minted: {formatNumber(tokenData.minted, tokenData.decimals)}</span>
                    <span>Cap: {formatNumber(tokenData.cap, tokenData.decimals)}</span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-4 border border-[color:var(--sf-outline)]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                      Per Mint
                    </div>
                    <div className="font-bold text-lg text-[color:var(--sf-text)]">
                      {formatNumber(tokenData.value_per_mint, tokenData.decimals)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[color:var(--sf-surface)]/50 p-4 border border-[color:var(--sf-outline)]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--sf-muted)] mb-1">
                      Total Supply
                    </div>
                    <div className="font-bold text-lg text-[color:var(--sf-text)]">
                      {formatNumber(tokenData.total_supply, tokenData.decimals)}
                    </div>
                  </div>
                </div>

                {/* Mint input */}
                {isMintActive ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-[color:var(--sf-text)] mb-2">
                        Number of Mints
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        className="w-full rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] px-4 py-3 text-lg font-bold text-[color:var(--sf-text)] focus:outline-none focus:border-[color:var(--sf-primary)]"
                      />
                      <div className="text-sm text-[color:var(--sf-muted)] mt-1">
                        You will receive: {formatNumber(
                          (parseFloat(mintAmount) * parseFloat(tokenData.value_per_mint)).toString(),
                          tokenData.decimals
                        )} DIESEL
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="mb-4 p-3 rounded-lg bg-[color:var(--sf-info-red-bg)] border border-[color:var(--sf-info-red-border)]">
                        <div className="text-sm text-[color:var(--sf-info-red-title)]">{error}</div>
                      </div>
                    )}

                    {/* Success message */}
                    {mintResult && (
                      <div className="mb-4 p-3 rounded-lg bg-[color:var(--sf-info-green-bg)] border border-[color:var(--sf-info-green-border)]">
                        <div className="text-sm text-[color:var(--sf-info-green-title)] mb-1">
                          Mint successful!
                        </div>
                        <div className="text-xs text-[color:var(--sf-info-green-text)] font-mono break-all">
                          TX: {mintResult.txid}
                        </div>
                      </div>
                    )}

                    {/* Mint button */}
                    {isConnected ? (
                      <button
                        onClick={handleMint}
                        disabled={isMinting}
                        className="w-full rounded-xl bg-[color:var(--sf-primary)] px-6 py-4 text-lg font-bold text-black transition-colors hover:bg-[color:var(--sf-primary-pressed)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMinting ? 'Minting...' : 'Mint DIESEL'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onConnectModalOpenChange(true)}
                        className="w-full rounded-xl bg-[color:var(--sf-primary)] px-6 py-4 text-lg font-bold text-black transition-colors hover:bg-[color:var(--sf-primary-pressed)] focus:outline-none"
                      >
                        Connect Wallet to Mint
                      </button>
                    )}
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-[color:var(--sf-info-yellow-bg)] border border-[color:var(--sf-info-yellow-border)]">
                    <div className="text-sm font-medium text-[color:var(--sf-info-yellow-title)] mb-1">
                      Minting Unavailable
                    </div>
                    <div className="text-xs text-[color:var(--sf-info-yellow-text)]">
                      {parseFloat(tokenData.minted) >= parseFloat(tokenData.cap)
                        ? 'DIESEL has reached its maximum supply cap.'
                        : 'Minting is currently disabled for this token.'}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Info section */}
          <div className="rounded-xl bg-[color:var(--sf-info-blue-bg)] border border-[color:var(--sf-info-blue-border)] p-4">
            <h3 className="text-sm font-bold text-[color:var(--sf-info-blue-title)] mb-2">
              About DIESEL Minting
            </h3>
            <ul className="text-sm text-[color:var(--sf-info-blue-text)] space-y-1">
              <li>DIESEL is an Alkane token (ID: 2:0) on Bitcoin</li>
              <li>Each mint operation creates a fixed amount of tokens</li>
              <li>Minting requires a Bitcoin transaction with network fees</li>
              <li>After minting, stake your DIESEL in the veDIESEL vault for yield</li>
            </ul>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-4">
            <Link
              href="/vaults"
              className="text-sm font-medium text-[color:var(--sf-primary)] hover:text-[color:var(--sf-primary-pressed)]"
            >
              Stake DIESEL
            </Link>
            <span className="text-[color:var(--sf-muted)]">|</span>
            <Link
              href="/swap"
              className="text-sm font-medium text-[color:var(--sf-primary)] hover:text-[color:var(--sf-primary-pressed)]"
            >
              Swap DIESEL
            </Link>
          </div>
        </div>
      </PageContent>
    </AlkanesMainWrapper>
  );
}
