import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { AppAlertComponent } from './app-alert.component';

interface confirmData {
  title?: string,
  message?: string
}

@Injectable()
export class AppAlertService {

  constructor(private dialog: MatDialog) { }

  public confirm(data:confirmData = {}): Observable<boolean> {
    data.title = data.title || 'Error';
    data.message = data.message || 'Erro Desconhecido';
    let dialogRef: MatDialogRef<AppAlertComponent>;
    dialogRef = this.dialog.open(AppAlertComponent, {
      width: '380px',
      disableClose: true,
      data: {title: data.title, message: data.message}
    });
    return dialogRef.afterClosed();
  }
}