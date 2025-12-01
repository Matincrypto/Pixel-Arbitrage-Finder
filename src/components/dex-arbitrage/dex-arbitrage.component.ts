
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CryptoDataService } from '../../services/crypto-data.service';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-dex-arbitrage',
  templateUrl: './dex-arbitrage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DexArbitrageComponent {
  cryptoDataService = inject(CryptoDataService);
  geminiService = inject(GeminiService);

  dexPools = this.cryptoDataService.dexPools;
  aiAnalysis = signal<string>('');
  isLoading = signal<boolean>(false);

  async analyzeData(): Promise<void> {
    this.isLoading.set(true);
    this.aiAnalysis.set('');
    try {
      const response = await this.geminiService.analyzeDexData(this.dexPools());
      this.aiAnalysis.set(response);
    } catch (error) {
      console.error('Error during DEX analysis:', error);
      this.aiAnalysis.set('An unexpected error occurred during analysis. Please check the console for details.');
    } finally {
      this.isLoading.set(false);
    }
  }

  formatLiquidity(value: number): string {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
}