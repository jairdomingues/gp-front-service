import { Routes } from "@angular/router";

import { TransactionComponent } from "./transaction/transaction.component";

export const ReleaseRoutes: Routes = [
  // { 
  //   path: 'scanner', 
  //   component: ScannerComponent, 
  //   data: { title: 'Scanner' } 
  // },
  { 
    path: 'transaction', 
    component: TransactionComponent, 
    data: { title: 'Transaction' } 
  },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
];
