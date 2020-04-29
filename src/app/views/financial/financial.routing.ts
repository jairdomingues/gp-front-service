import { Routes } from "@angular/router";

import { PaymentComponent } from "./payment/payment.component";
import { ScannerComponent } from "./scanner/scanner.component";
import { QRCodeComponent } from "./qrcode/qrocde.component";
import { StatementComponent } from "./statement/statement.component";
import { AccountComponent } from "./account/account.component";
import { ScannerInformationComponent } from "./scanner/scanner-information/scanner-information.component";

export const FinancialRoutes: Routes = [
  {
    path: "account",
    component: AccountComponent,
    data: { title: "Account", breadcrumb: "Account" }
  }, 
  {
    path: "payment",
    component: PaymentComponent,
    data: { title: "Payment", breadcrumb: "Payment" }
  }, 
  { 
    path: 'qrcode/:uuid', 
    component: QRCodeComponent, 
    data: { title: 'QRCode' } 
  },
  { 
    path: 'scanner/:orderId', 
    component: ScannerComponent, 
    data: { title: 'Scanner' } 
  },
  { 
    path: 'statement', 
    component: StatementComponent, 
    data: { title: 'Statement' } 
  },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  { 
    path: 'information/:orderId', 
    component: ScannerInformationComponent, 
    data: { title: 'Information' } 
  }
];
