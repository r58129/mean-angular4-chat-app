import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGroup } from './auth.type';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // canActivate() {
  //   if (!this.auth.isLoggedIn()) {
  //     this.router.navigateByUrl('/');
  //     return false;
  //   }
  //   return true;
  // }

	canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    if (this.authService.isLoggedIn())  {
    
    	// console.log("in auth gurad: " + route.data['role']);
    	return this.hasRequiredPermission(route.data['role']);
      // return true;
    }
    this.router.navigateByUrl('/');
    return false;    


  }

	protected hasRequiredPermission(authGroup: AuthGroup): Promise<boolean> | boolean {
          // If user’s permissions already retrieved from the API
          // console.log('authGroup: ' +authGroup);
          // console.log('this.authService.permissions: ' +this.authService.permissions);
          if (this.authService.permissions) {
          	console.log('this.authService.permissions: ' +this.authService.permissions);
               if (authGroup) {
                    return this.authService.hasPermission(authGroup);
               } else {
                    return this.authService.hasPermission(null); }
          } else {
               // Otherwise, must request permissions from the API first
               console.log('request permissions from the API first');
               var promise = new Promise<boolean>((resolve, reject) => {
                    this.authService.initializePermissions()
                    .then(() => { 
                       if (authGroup) {
                       	  console.log('authGroup after initializePermissions: ' +authGroup);
                          
                            resolve(this.authService.hasPermission(authGroup));
                       } else {
                       		console.log('no authGroup after initializePermissions:');
                          
                            resolve(this.authService.hasPermission(null));
                       }

                    }).catch(() => {
                        resolve(false);
                    });
            });
            return promise;
        }    
    }

}