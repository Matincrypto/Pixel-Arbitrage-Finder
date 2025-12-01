
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CryptoDataService } from '../../services/crypto-data.service';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-cex-arbitrage',
  templateUrl: './cex-arbitrage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CexArbitrageComponent {
  cryptoDataService = inject(CryptoDataService);
  geminiService = inject(GeminiService);

  signals = this.cryptoDataService.signals;
  aiAnalysis = signal<string>('');
  isLoading = signal<boolean>(false);

  async analyzeData(): Promise<void> {
    this.isLoading.set(true);
    this.aiAnalysis.set('');
    try {
      const response = await this.geminiService.analyzeCexData(this.signals());
      this.aiAnalysis.set(response);
    } catch (error) {
      console.error('Error during CEX analysis:', error);
      this.aiAnalysis.set('An unexpected error occurred during analysis. Please check the console for details.');
    } finally {
      this.isLoading.set(false);
    }
  }
  
  formatSignalPrice(price: string): string {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
      return price;
    }
    return priceNum.toLocaleString('en-US');
  }

  formatTime(timestamp: string): string {
    return timestamp.split(' ')[1] || '';
  }
}