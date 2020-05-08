import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'app/service/order/order.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-scanner-information',
  templateUrl: './scanner-information.component.html'
})
export class ScannerInformationComponent implements OnInit {

  salesOrder: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loader: AppLoaderService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    let orderId  = this.route.snapshot.params['orderId'];
    this.getSalesOrder(orderId);
  }

  async getSalesOrder(orderId) {
    await this.orderService.getSalesOrder(orderId).subscribe((salesOrder: any) => {
      this.salesOrder = salesOrder;
    });
  }

}
