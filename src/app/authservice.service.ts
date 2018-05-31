//import { Injectable } from '@angular/core';
//
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/of';
//import 'rxjs/add/operator/do';
//import 'rxjs/add/operator/delay';
//
//@Injectable()
//export class AuthserviceService {
//  isLoggedIn = false;
//
//  // store the URL so we can redirect after logging in
//  redirectUrl: string;
//
//  login(): Observable<boolean> {
//    return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
//  }
//
//  logout(): void {
//    this.isLoggedIn = false;
//  }
//}


// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthserviceService {

  auth0 = new auth0.WebAuth({
    clientID: 'QHj13LadXiKO4qLoj7IQaJWv3Z0s3j5D',
    domain: 'aptcmai0.auth0.com',
    responseType: 'token id_token',
    audience: 'https://aptcmai0.auth0.com/userinfo',
    redirectUri: 'https://192.168.0.102:3088',
    scope: 'openid'
  });

//  redirectUrl: string;
    
  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

    public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
       window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['']);
      } else if (err) {
        this.router.navigate(['']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
    //  return true;
  }
}