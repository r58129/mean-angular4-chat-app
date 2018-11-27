import { Directive, ElementRef, OnInit , Input } from '@angular/core';
import { AuthService, TokenPayload, UserDetails } from './auth/auth.service';
import { AuthGroup } from './auth/auth.type';

@Directive({
    selector: '[HideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {
    @Input('HideIfUnauthorized') permission: AuthGroup; // Required permission passed in
    constructor(private el: ElementRef, private authService: AuthService) { }
    ngOnInit() {
        if (!this.authService.hasPermission(this.permission)) {
              this.el.nativeElement.style.display = 'none';
        }
    }
}