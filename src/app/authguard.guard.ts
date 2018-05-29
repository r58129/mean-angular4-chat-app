import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthserviceService }      from './authservice.service';


@Injectable()
export class AuthguardGuard implements CanActivate {
//  canActivate(
//    next: ActivatedRouteSnapshot,
//    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
    constructor(private authService: AuthserviceService, private router: Router) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
//    if (this.authService.isLoggedIn) { return true; }
      if (this.authService.isAuthenticated()) { return true; }

    // Store the attempted URL for redirecting
    //this.authService.redirectUrl = url;

      console.log ("lu test here login failed??");
      
    // Navigate to the login page with extras
    this.router.navigate(['']);
    return false;
  }
}
