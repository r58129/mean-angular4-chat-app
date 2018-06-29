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
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import { Configs } from './configurations';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //  'Content-Type':'application/x-www-form-urlencoded'
    //'Authorization': 'my-auth-token'
  })
};

(window as any).global = window;

@Injectable()
export class AuthserviceService {

  auth0 = new auth0.WebAuth({
    clientID: 'QHj13LadXiKO4qLoj7IQaJWv3Z0s3j5D',
    domain: 'aptcmai0.auth0.com',
    responseType: 'token id_token',
    audience: 'https://aptcmai0.auth0.com/userinfo',
    // redirectUri: 'https://airpoint.com.hk:3089',
    redirectUri: this.configs.angularAddr,
    scope: 'openid'
  });

//  redirectUrl: string;
    
  constructor(public router: Router, public http: HttpClient, private configs: Configs) {}

  public login(): void {
    this.auth0.authorize();
  }

    public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
       window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['request']);
        //TODO
        //login to tinker board and register admin
        //console.log(this.loginTinker());
        this.loginTinker();
        
      } else if (err) {
        this.router.navigate(['']);
        console.log(err);
      }
    });
  }

  private tinkerUrl = this.configs.tinkerboardAddr +'/api/user/login';
  private tinkerUrlOut = this.configs.tinkerboardAddr +'/api/user/logout';

  //public sID ='111' ;
  
  private handleErrorObservable (error: Response | any) {
	console.error(error.message || error);
	return Observable.throw(error.message || error);
    }

  private logoutTinker(){
      
//      console.log('~~~ now will unreg Tinker board!!! ~~~');
      
      var sID2 = '222';
      sID2=localStorage.getItem('res.data.sessionID');
      
      this.http.post (this.configs.tinkerboardAddr+'/api/csp/unregister?action=unregister&sessionID='+sID2, 
    {}, httpOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .subscribe(
        res => {
 //           var sID = '111';
 //         console.log(res);
//            console.log(res.data.sessionID);
//            sID=res.data.sessionID;
//            console.log('sID is ' + sID); 
            //return sID;
            //'https://192.168.0.156:8011/api/csp/register?action=register'
            //'https://httpbin.org/post?sessionID='
            //this.tinkerUrlOut
            this.http.post (this.tinkerUrlOut+'?sessionID='+sID2, 
      //action: 'register',
      {}
      , httpOptions)
      .pipe(
      catchError(this.handleErrorObservable)
      )
      .subscribe(
        res => {
//            console.log(sID2);
//          console.log(res);
        });
  });
      localStorage.removeItem('res.data.sessionID');
  }
  
  private loginTinker() {
      
 //     console.log('~~~ now will login and reg Tinker board!!! ~~~');
      //this.tinkerUrl
      this.http.post (this.tinkerUrl, {
      userID: 'admin',
      Password: 'admin'
    }, httpOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .subscribe(
        res => {
            var sID = '111';
//          console.log(res);
//            console.log(res.data.sessionID);
            //sID=res.data.sessionID;
            localStorage.setItem('res.data.sessionID', res.data.sessionID);  //Lu test storage
            
            sID=localStorage.getItem('res.data.sessionID');
           console.log('localStorage sID is ' + sID); 
            //return sID;
            //'https://192.168.0.156:8011/api/csp/register?action=register&sessionID='+sID
            //'https://httpbin.org/post?sessionID='
            this.http.post (this.configs.tinkerboardAddr+'/api/csp/register?action=register&sessionID='+sID, 
      //action: 'register',
      {}
    , httpOptions)
            .pipe(
      catchError(this.handleErrorObservable)
    )
    .subscribe(
        res => {
//          console.log(res);
        });
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
      
      this.logoutTinker();
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