import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthService, TokenPayload, UserDetails } from './auth/auth.service';
import { AuthGroup } from './auth/auth.type';

@Directive({
    selector: '[DisableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {

  @Input('DisableIfUnauthorized') whoIsAllowed: AuthGroup; // Required permission passed in

  // staffRole: string;

    constructor(private el: ElementRef, private authService: AuthService) { }
    
    	ngOnInit() {
    	// console.log("disabled UI: " +this.el.nativeElement.disabled);    	
    	// console.log("who can read this page: " + this.whoIsAllowed);
    	// console.log("this.staffRole" +this.staffRole);

    // 	if (this.staffRole != undefined){

	   //    if ( this.whoIsAllowed.includes(this.staffRole)){
	   //    console.log(this.whoIsAllowed.includes(this.staffRole));    
	        
	   //     this.el.nativeElement.disabled = false;
	   //    }
	   //      this.el.nativeElement.disabled = true;  

    // 	} else {

		  //   this.authService.profile().subscribe(user => {
		  //     this.staffRole = user.role;
		  //     // this.showMenuBarItem(this.staffRole);
		  //     console.log('my role in menubar: ' + this.staffRole);
		  //   }, (err) => {
		  //     console.error(err);
		  //   });
		  // }

    	// console.log("can i read this page: " +this.authService.hasPermission(this.whoIsAllowed));
        if (!this.authService.hasPermission(this.whoIsAllowed)) {
        		
              this.el.nativeElement.disabled = true;
              // console.log("disabled UI: " +this.el.nativeElement.disabled);
        }
    }
}
