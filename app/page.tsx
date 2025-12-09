import TrendingPairs from "@/app/components/TrendingPairs";
import VaultTiles from "@/app/components/VaultTiles";
import DieselPriceCard from "@/app/components/DieselPriceCard";
import ActivityFeed from "@/app/components/ActivityFeed";
import AlkanesMainWrapper from "@/app/components/AlkanesMainWrapper";
import PageContent from "@/app/components/PageContent";

export default function Home() {
  return (
    <AlkanesMainWrapper>
      <PageContent className="px-4 md:px-5">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
          {/* Hero section with DIESEL branding */}
          <div className="text-center py-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[color:var(--sf-text)] mb-2">
              <span className="text-[color:var(--sf-primary)]">DIESEL</span>
            </h1>
            <div className="diesel-rainbow-bar max-w-xs mx-auto rounded-full mb-4"></div>
            <p className="text-[color:var(--sf-muted)] text-lg">
              Stake, Swap & Earn on Bitcoin with Alkanes
            </p>
          </div>

          {/* Main content: Price card + Vaults */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <DieselPriceCard />
            </div>
            <div className="lg:col-span-2">
              <VaultTiles />
            </div>
          </div>

          {/* Trending pair */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <TrendingPairs />
            </div>
            <div className="lg:col-span-2">
              {/* Activity feed */}
              <ActivityFeed maxHeightClass="max-h-[35vh]" />
            </div>
          </div>
        </div>
      </PageContent>
    </AlkanesMainWrapper>
  );
}
