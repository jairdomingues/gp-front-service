import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
    public subject = new Observable<any>();

    sendMessage(message: string) {
      this.subject = new Observable(observer => {
        observer.next({ text: message });
      })
    }

}