import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  declarations: [ScannerInformationComponent, AccountComponent, PaymentComponent, QRCodeComponent, ScannerComponent, ScannerInformationComponent, StatementComponent, AccountTablePopupComponent, PaymentTablePopupComponent, ScannerTablePopupComponent],
  providers: [CrudService],
  entryComponents: [AccountTablePopupComponent, PaymentTablePopupComponent, ScannerTablePopupComponent],
  exports: []
})
export class FinancialModule {

}