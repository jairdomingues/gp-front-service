import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-scanner-table-popup1',
  templateUrl: './scanner-table-popup.component.html'
})
export class ScannerTablePopupComponent implements OnInit {

  value = "";
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ScannerTablePopupComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.value)
  }
}
