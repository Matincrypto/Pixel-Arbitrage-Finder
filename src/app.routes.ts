
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CexArbitrageComponent } from './components/cex-arbitrage/cex-arbitrage.component';
import { DexArbitrageComponent } from './components/dex-arbitrage/dex-arbitrage.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cex-opportunities', component: CexArbitrageComponent },
  { path: 'dex-liquidity', component: DexArbitrageComponent },
  { path: '**', redirectTo: '' }
];