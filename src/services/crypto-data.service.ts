
import { Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';

// New interfaces for the signal API
export interface Signal {
  coin: string;
  entry_price: string;
  exchange: string;
  pair: string;
  profit_percent: string;
  signal_grade: string;
  signal_time: string;
  strategy_name: string;
  target_price: string;
}

// Keep this for the DEX page
export interface DexPool {
  platform: string;
  pair: string;
  liquidity: number;
  apy: number;
}

@Injectable({ providedIn: 'root' })
export class CryptoDataService implements OnDestroy {
  signals: WritableSignal<Signal[]> = signal([]); // Replaces cexData
  dexPools: WritableSignal<DexPool[]> = signal([]);
  isPaused = signal(false);

  private intervalId: number;
  private dexPlatforms = ['Uniswap', 'Sushiswap', 'Pancakeswap', 'Curve'];


  constructor() {
    this.updateData();
    this.intervalId = window.setInterval(() => {
      if (!this.isPaused()) {
        this.updateData();
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  togglePause(): void {
    this.isPaused.update(paused => !paused);
  }

  private updateData(): void {
    this.updateSignalData();
    this.updateDexPools();
  }

  private updateSignalData(): void {
    const sampleSignals: Omit<Signal, 'entry_price' | 'target_price' | 'profit_percent' | 'signal_time'>[] = [
      { coin: 'ALICE', exchange: 'Wallex', pair: 'TMN', signal_grade: 'Q2', strategy_name: 'Internal' },
      { coin: 'ALGO', exchange: 'Wallex', pair: 'TMN', signal_grade: 'Q2', strategy_name: 'Internal' },
      { coin: 'SAHARA', exchange: 'Wallex', pair: 'TMN', signal_grade: 'Q2', strategy_name: 'Internal' },
      { coin: 'YFI', exchange: 'Wallex', pair: 'TMN', signal_grade: 'Q1', strategy_name: 'Internal' },
      { coin: 'BTC', exchange: 'Binance', pair: 'USDT', signal_grade: 'Q1', strategy_name: 'Breakout' },
      { coin: 'ETH', exchange: 'Coinbase', pair: 'USDT', signal_grade: 'Q2', strategy_name: 'Momentum' },
      { coin: 'SOL', exchange: 'Kraken', pair: 'USDT', signal_grade: 'Q3', strategy_name: 'Internal' }
    ];

    const generatedSignals = sampleSignals.map(baseSignal => {
      const entry_price = (baseSignal.coin === 'YFI' || baseSignal.coin === 'BTC') 
          ? Math.random() * 50000 + 20000 
          : (baseSignal.coin === 'ETH')
          ? Math.random() * 2000 + 3000
          : Math.random() * 100 + 1;
      const profit_percent = (Math.random() * 10 + 1).toFixed(2);
      const target_price = entry_price * (1 + parseFloat(profit_percent) / 100);
      
      const now = new Date();
      const signal_time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      return {
        ...baseSignal,
        entry_price: String(entry_price.toFixed(2)),
        target_price: String(target_price.toFixed(2)),
        profit_percent: profit_percent,
        signal_time: signal_time
      };
    }).sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 5); // Randomize and show 5-7 signals

    this.signals.set(generatedSignals);
  }

  // updateDexPools remains for the other page
  private updateDexPools(): void {
    const newPools = this.dexPlatforms.flatMap(platform => [
      {
        platform,
        pair: 'ETH/USDC',
        liquidity: 10000000 + (Math.random() * 5000000 - 2500000),
        apy: 5 + (Math.random() * 2 - 1),
      },
      {
        platform,
        pair: 'WBTC/ETH',
        liquidity: 5000000 + (Math.random() * 2000000 - 1000000),
        apy: 3 + (Math.random() * 1.5 - 0.75),
      },
       {
        platform,
        pair: 'SOL/USDT',
        liquidity: 8000000 + (Math.random() * 3000000 - 1500000),
        apy: 8 + (Math.random() * 3 - 1.5),
      },
    ]);
    const formattedPools = newPools.map(pool => ({
        ...pool,
        liquidity: parseFloat(pool.liquidity.toFixed(0)),
        apy: parseFloat(pool.apy.toFixed(2))
    }));

    this.dexPools.set(formattedPools);
  }
}