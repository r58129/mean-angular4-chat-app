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
    redirectUri: 'https://airpoint.com.hk:3089',
    //redirectUri: 'https://airpoint.com.hk:4080',
    scope: 'openid profile email'
  });

//  redirectUrl: string;
    
  constructor(public router: Router, public http: HttpClient) {}

  public userProfile: any;
    public profileLu:object;
    
  public login(): void {
      
      
      
    this.auth0.authorize();
      //this.auth0.handleAuthentication();
      // Parse the URL and extract the Access Token
//  this.auth0.parseHash(window.location.hash, function(err, authResult) {
//    if (err) {
//      return console.log(err);
//    }
//    this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
//        // This method will make a request to the /userinfo endpoint
//        // and return the user object, which contains the user's information,
//        // similar to the response below.
//        
//        this.userProfile=user;
//    });
 // });
//});
  }

    
    
   // tPort:any;
     //namespace:any;
    //atoken:any;
//...
public getProfile(cb): void {
    
    
    
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    //if (!this.atoken) {
    return;
    //throw new Error('Access Token must exist to fetch profile');
  }

  const self = this;
  this.auth0.client.userInfo(accessToken, (err, profile) => {
    if (profile) {
      self.userProfile = profile;
    }
    cb(err, profile);
  });
}
    

    
    public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
        
       //this.router.navigate(['']);
       //this.router.navigate(['']);
        
      if (authResult && authResult.accessToken && authResult.idToken) {
       window.location.hash = '';
//        
//        
//        
//            this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
//        // This method will make a request to the /userinfo endpoint
//        // and return the user object, which contains the user's information,
//        // similar to the response below.
//        if (this.auth0.alreadyExists(this.profileLu.sub)){
//        
//        
//        if (user!=undefined){
//        
//        this.profileLu=user;
//            }
//        }
//
//    });
        this.setSession(authResult);
        //TODO
        //login to tinker board and register admin
        //console.log(this.loginTinker());
//        this.delay(10000);
        
        //this.router.navigate(['request']);
//        this.loginTinker();
        
        this.router.navigate(['']);
          //return this.profileLu;
          
      } else if (err) {
        this.router.navigate(['']);
        console.log(err);
      }
    });
  }
  
  private tinkerUrl = 'https://airpoint.com.hk:8007/api/user/login';
  private tinkerUrlOut = 'https://airpoint.com.hk:8007/api/user/logout';
  
  

  //public sID ='111' ;
  
  private handleErrorObservable (error: Response | any) {
	console.error(error.message || error);
	return Observable.throw(error.message || error);
    }

  private logoutTinker(){
      
//      console.log('~~~ now will unreg Tinker board!!! ~~~');
      
      var sID2 = '222';
      sID2=localStorage.getItem('res.data.sessionID');
      
      this.http.post ('https://airpoint.com.hk:8007/api/csp/unregister?action=unregister&sessionID='+sID2, 
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
  tPort='0';
pp:any;

private async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
}

  public loginTinker() {
      
//          if (this.authService.userProfile) {
//      this.profile = this.authService.userProfile;
//     } else {
//      this.authService.getProfile((err, profile) => {
//        this.profile = profile;
//      });
//    }
      
      

//      
    //this.tPort=this.pp.nickname;
                      
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
            console.log('tPort is ' + this.tPort); 
            //return sID;
            //'https://192.168.0.156:8011/api/csp/register?action=register&sessionID='+sID
            //'https://httpbin.org/post?sessionID='
            this.http.post ('https://airpoint.com.hk:8007/api/csp/register?action=register&sessionID='+sID, 
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
//      this.atoken=authResult.accessToken;
      
//                if (this.userProfile) {
//      this.pp = this.userProfile;
//     }else{
//      this.getProfile((err, profilex) => {
//        this.pp = profilex;
//      });
//     }

//      localStorage.setItem('test1', this.pp.nickname);
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