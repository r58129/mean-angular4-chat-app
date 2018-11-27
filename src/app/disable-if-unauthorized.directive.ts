import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthService, TokenPayload, UserDetails } from './auth/auth.service';
import { AuthGroup } from './auth/auth.type';

@Directive({
    selector: '[DisableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {
    @Input('DisableIfUnauthorized') permission: AuthGroup; // Required permission passed in
    constructor(private el: ElementRef, private authService: AuthService) { }
    ngOnInit() {
    	console.log("permission" + this.permission);
        if (!this.authService.hasPermission(this.permission)) {
              this.el.nativeElement.disabled = true;
        }
    }
}
