import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-qrcode',
    templateUrl: './qrcode.component.html',
    styleUrls: ['./qrcode.component.css']
})
export class QRCodeComponent {

    elementType: 'url' | 'canvas' | 'img' = 'url';
    value: string;
    display = false;
    href: string;

    constructor(private router: Router,
                private route: ActivatedRoute) 
    {}

    ngOnInit() {
        this.value  = this.route.snapshot.params['uuid'];
        this.display = true;
    }

    downloadImage() {
        this.href = document.getElementsByTagName('img')[4].src;
        var elements = document.body.getElementsByTagName('img');
        for (var i = 0; i < elements.length; i++) {
            //elements[i].innerHTML = "foo";
            console.log(elements[i]);
        }​
    }

}
