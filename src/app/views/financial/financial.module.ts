import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatDialog,
  MatDialogModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

import  {NgxQRCodeModule} from  'ngx-qrcode2' ; 
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { FinancialRoutes } from "./financial.routing";
import { PaymentComponent } from './payment/payment.component';
import { QRCodeComponent } from './qrcode/qrocde.component';
import { ScannerComponent } from './scanner/scanner.component';
import { StatementComponent } from './statement/statement.component';
import { CrudService } from './crud.service';
import { TranslateModule } from '@ngx-translate/core';
import { AccountComponent } from './account/account.component';
import { AccountTablePopupComponent } from './account/account-table-popup/account-table-popup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentTablePopupComponent } from './payment/payment-table-popup/payment-table-popup.component';
import { ScannerTablePopupComponent } from './scanner/scanner-table-popup/scanner-table-popup.component';
import { ScannerInformationComponent } from './scanner/scanner-information/scanner-information.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatGridListModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    FlexLayoutModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    NgxQRCodeModule,    
    ZXingScannerModule,
    TranslateModule,
    RouterModule.forChild(FinancialRoutes)
  ],
  declarations: [AccountComponent, PaymentComponent, QRCodeComponent, ScannerComponent, ScannerInformationComponent, StatementComponent, AccountTablePopupComponent, PaymentTablePopupComponent, ScannerTablePopupComponent],
  providers: [CrudService],
  entryComponents: [AccountTablePopupComponent, PaymentTablePopupComponent, ScannerTablePopupComponent],
  exports: []
})
export class FinancialModule {

}