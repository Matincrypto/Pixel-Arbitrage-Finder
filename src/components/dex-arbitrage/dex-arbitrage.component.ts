
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CryptoDataService, DexPool } from '../../services/crypto-data.service';
import { GeminiService } from '../../services/gemini.service';

type SortKey = 'liquidity' | 'apy';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-dex-arbitrage',
  templateUrl: './dex-arbitrage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DexArbitrageComponent {
  cryptoDataService = inject(CryptoDataService);
  geminiService = inject(GeminiService);

  private dexPools = this.cryptoDataService.dexPools;
  aiAnalysis = signal<string>('');
  isLoading = signal<boolean>(false);

  // New features: Sorting and Deep Analysis
  sortKey = signal<SortKey>('liquidity');
  sortDirection = signal<SortDirection>('desc');
  isDeepAnalysis = signal<boolean>(false);

  sortedDexPools = computed(() => {
    const pools = [...this.dexPools()];
    const key = this.sortKey();
    const direction = this.sortDirection();

    pools.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return pools;
  });

  async analyzeData(): Promise<void> {
    this.isLoading.set(true);
    this.aiAnalysis.set('');
    try {
      const response = await this.geminiService.analyzeDexData(this.sortedDexPools(), this.isDeepAnalysis());
      this.aiAnalysis.set(response);
    } catch (error: any) {
      console.error('Error during DEX analysis:', error);
      this.aiAnalysis.set(error.message || 'An unexpected error occurred during analysis.');
    } finally {
      this.isLoading.set(false);
    }
  }

  setSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('desc');
    }
  }
  
  toggleDeepAnalysis(): void {
    this.isDeepAnalysis.update(value => !value);
  }

  formatLiquidity(value: number): string {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
}
