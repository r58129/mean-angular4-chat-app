import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
//import { Configs } from './../configurations';
import { Configs } from './../../environments/environment';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email?: string;
  password?: string;
  name?: string;
  resetToken?: string;
  online?: string;
  tinkerSessionId?: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //  'Content-Type':'application/x-www-form-urlencoded'
    //'Authorization': 'my-auth-token'
  })
};




@Injectable()
export class AuthService {

private token: string;
private resetToken: string;
private staff: any=[];
private sessionId: any=[];
private onlineCount: any;

  credentials: TokenPayload = {
    online:'',
    tinkerSessionId:''
  };

  constructor(private http: HttpClient, private router: Router, private configs: Configs) {}

  private serverUrl = this.configs.expressAddr;

  private saveToken(token: string): void {
    sessionStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {

    if (!this.token) {
      this.token = sessionStorage.getItem('mean-token');
      // console.log("getToken: " +this.token);
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    // console.log("getUserDetails: ");
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get'|'put', type: 'login'|'register'|'profile'|'forgotpwd'|'resetpwd', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      // console.log("request post");
      // base = this.http.post(`/api/${type}`, user);
      if (type === 'register') {
      base = this.http.post(this.configs.expressAddr +'/api/register', user);
      console.log("register http post");
      }
      if (type === 'login') {
      base = this.http.post(this.configs.expressAddr +'/api/login', user);
      console.log("login http post");
      }
      if (type === 'forgotpwd') {
      base = this.http.post(this.configs.expressAddr +'/api/forgotpwd', user);
      console.log("forgotpwd http post");
      }
      if (type === 'resetpwd') {
      base = this.http.post(this.configs.expressAddr +'/api/resetpwd', user);
      console.log("resetpwd http post");
      }
      
    } else if (method === 'get'){

      console.log("sent get user profile request" );
      // base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      base = this.http.get(this.configs.expressAddr +'/api/profile', { headers: { Authorization: `Bearer ${this.getToken()}` }});
    } else if (method === 'put'){

      console.log("send update user profile request" );
      // base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      base = this.http.put(this.configs.expressAddr +'/api/profile', user, { headers: { Authorization: `Bearer ${this.getToken()}` }});

    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        // console.log("before data.token" );
        if (data.token) {
          // console.log("inside data.token" );
          // if (type === 'login'){
            this.saveToken(data.token);
          // }
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    console.log("inside register auth.service");
    console.log("name: " + user.name);
    console.log("email: " + user.email);
    console.log("password: " + user.password);
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    console.log("inside login auth.service");
    return this.request('post', 'login', user);
  }

  public forgotPassword(user: TokenPayload): Observable<any> {
    console.log("inside forgotPassword auth.service");
    console.log("email: " + user.email);
    return this.request('post', 'forgotpwd', user);
  }

  public resetPassword(user: TokenPayload): Observable<any> {
    console.log("inside resetPassword auth.service");
    console.log("password: " + user.password);
    console.log("token: " + user.resetToken);
    return this.request('post', 'resetpwd', user);
  }

  public profile(): Observable<any> {
    // console.log("inside profile auth.service");
    return this.request('get', 'profile');
  }

  public profileUpdate(user: TokenPayload): Observable<any> {
    console.log("inside profile auth.service");
    return this.request('put', 'profile', user);
  }

  public logout(): void {
    // this.token = '';
    // window.localStorage.removeItem('mean-token');
    this.logoutTinker();
    // console.log("logout tinker");
    
    // sessionStorage.removeItem('expressport');
    // sessionStorage.removeItem('socketioport');
    // sessionStorage.removeItem('tinkerport');
    // sessionStorage.clear();

    this.router.navigateByUrl('/');
    console.log("logout user");
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  // public loginTinker(port:string) :boolean{
  public loginTinker() {
    console.log('check if need to login tinker & mutlichat');

    this.getStaffTinkerSessionId().then((res) => {  //from chatService
      this.sessionId = res;
      if (this.sessionId !=""){ // found existing session id

        console.log("sessionId: " +this.sessionId[0].tinkerSessionId);                        
        console.log("Found tinkerSessionId, reuse this session id but don't login to tinker ");

        localStorage.setItem('res.data.sessionID', this.sessionId[0].tinkerSessionId);  //copy session id
        sessionStorage.setItem('loginTinkerDone', "1");
        console.log('copy session id from Db');

        this.credentials.tinkerSessionId = this.sessionId[0].tinkerSessionId;  // upload existing sid to db
        this.credentials.online = "true";

        this.profileUpdate(this.credentials).subscribe(user => {
          this.staff = user;
            console.log('update user profile online ');
            // console.log('name: ' +this.staff.name);
            // console.log('online: ' +this.staff.online);
            // console.log('tinkerSessionId: ' +this.staff.tinkerSessionId);
            // console.log('expressPort: ' +user.expressPort);
            // console.log('tinkerPort: ' +user.tinkerPort);
            // console.log('sokcetIoPort: ' +user.sokcetIoPort);
            console.log('No need to register to tinker and mutlichat  again');  
        }, (err) => {
          console.log(err);
        });
        
      } else {  // login to tinker and mutlichat server
        console.log(" No tinkerSessionId found, login to tinker and upload the session id!");
    
        this.http.post (this.configs.tinkerboardAddr+':'+this.configs.tinkerport+'/api/user/login', {
          userID: 'admin',
          Password: 'admin'
        }, httpOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        )
        .subscribe(
          res => {
            localStorage.setItem('res.data.sessionID', res.data.sessionID);  //Lu test storage
            sessionStorage.setItem('loginTinkerDone', "1");
            console.log('loginTinker is done');
            // this.router.navigate(['/chat/request']);
            // console.log('redirect the link to request');

            // update session id and online to staff profile
            this.credentials.tinkerSessionId = res.data.sessionID;
            this.credentials.online = "true";

            this.profileUpdate(this.credentials).subscribe(user => {
              this.staff = user;
              console.log('update user profile online ');
              // console.log('name: ' +this.staff.name);
              // console.log('online: ' +this.staff.online);
              // console.log('tinkerSessionId: ' +this.staff.tinkerSessionId);
              // console.log('expressPort: ' +user.expressPort);
              // console.log('tinkerPort: ' +user.tinkerPort);
              // console.log('sokcetIoPort: ' +user.sokcetIoPort);
            }, (err) => {
              console.log(err);
            });

            // console.log('before register to tinker, session id: ' + localStorage.getItem('res.data.sessionID'))
            this.http.post (this.configs.tinkerboardAddr+":"+this.configs.tinkerport+'/api/csp/register?action=register&sessionID='+localStorage.getItem('res.data.sessionID'), 
            // this.http.post (localStorage.getItem('baseAddress')+":"+localStorage.getItem('tinkerPort')+'/api/csp/register?action=register&sessionID='+localStorage.getItem('res.data.sessionID'), 
            {}, httpOptions)
            .pipe(
              catchError(this.handleErrorObservable)
            ).subscribe(
              res => {
              console.log('register to tinker');  
            });

            this.loginMutliChat();

          // return true;
        });

      }
    }, (err) => {
      console.log(err);
    });
    // return true;
  }

  // public logoutTinker(port:string): boolean{
  public logoutTinker(){
    var sID = '222';
    sID=localStorage.getItem('res.data.sessionID');

    this.getOnlineStaffCount().then((res) => {
      this.onlineCount = res;
      
      this.credentials.tinkerSessionId = "";  // clear db sID
      this.credentials.online = "false";  //offline

      // console.log("onlineCount: " +this.onlineCount);

      if (this.onlineCount <=1){ 

        console.log("onlineCount: " +this.onlineCount);

        this.profileUpdate(this.credentials).subscribe(user => {
          // this.staff = user;
          console.log('clear sesson id and set offline');
          
          // if (sID!=null){
          // this.http.post (this.configs.tinkerboardAddr+":"+sessionStorage.getItem("tinkerport")+'/api/csp/unregister?action=unregister&sessionID='+localStorage.getItem('res.data.sessionID'), 
          this.http.post (this.configs.tinkerboardAddr+":"+this.configs.tinkerport+'/api/csp/unregister?action=unregister&sessionID='+localStorage.getItem('res.data.sessionID'), 
            {}, httpOptions)
            .pipe(
              catchError(this.handleErrorObservable)
            )
            .subscribe(
              res => {
                console.log('unregister tinker');
                // return true;
            });        
          // } //end if tPort !=null
            
          // this.http.post (this.configs.tinkerboardAddr+":"+sessionStorage.getItem("tinkerport")+'/api/user/logout'+'?sessionID='+sID2, {
          this.http.post (this.configs.tinkerboardAddr+':'+this.configs.tinkerport+'/api/user/logout'+'?sessionID='+sID, {
            }, httpOptions)
            .pipe(
              catchError(this.handleErrorObservable)
            )
            .subscribe(
              res => {
                localStorage.removeItem('res.data.sessionID');
                console.log('logout tinker');
                // return true;
            });

            this.logoutMutliChat();

        }, (err) => {
          console.log(err);
        });
        
        localStorage.removeItem('emittedOpeartorSocket');
        localStorage.removeItem('ng2Idle.main.idling');
        localStorage.removeItem('ng2Idle.main.expiry');
        sessionStorage.setItem('loginTinkerDone','0');
        // sessionStorage.removeItem('loginTinkerDone');

        // remove token after all http requests are sent
        this.token = '';
        window.sessionStorage.removeItem('mean-token');        

      } else {  //more than 1 admin online
    
        console.log("onlineCount: " +this.onlineCount);
        
        this.profileUpdate(this.credentials).subscribe(user => {
          // this.staff = user;
          console.log('clear sesson id and set offline');
        }, (err) => {
          console.log(err);
        });

        localStorage.removeItem('res.data.sessionID');
        sessionStorage.removeItem('emittedOpeartorSocket');
        localStorage.removeItem('ng2Idle.main.idling');
        localStorage.removeItem('ng2Idle.main.expiry');
        sessionStorage.setItem('loginTinkerDone','0');
        console.log("update profile and logout but do not unregister tinker and mutichat!");

        // remove token after all http requests are sent
        this.token = '';
        window.sessionStorage.removeItem('mean-token');
      }

    }, (err) => {
      console.log(err);
    });

    // return true;      
  }

  //mutliChat login
  public loginMutliChat(){
    console.log('login mutlichat server');

    // register to multichat server 
    if (this.configs.ngrok){  // use ngrok
          this.http.post (this.configs.multiChatNgrokAddr+'/api/csp/register?action=register&sessionID='+this.configs.multiChatCode, 
          {}, httpOptions)
          .pipe(
          catchError(this.handleErrorObservable)
          ).subscribe(
            res => {      
              console.log('register to mutlichat server with ngrok');  
              return true;
            });
         } else {  //use 443 route server
            this.http.post (this.configs.multiChatAddr+'/api/csp/register'+this.configs.multiChatPort+'?action=register&sessionID='+this.configs.multiChatCode, 
            {}, httpOptions)
            .pipe(
            catchError(this.handleErrorObservable)
            ).subscribe(
              res => {      
              console.log('register to mutlichat server with 443');  
              return true;
            });
    }    
  }

  public logoutMutliChat(){
    console.log('logout mutlichat server');
    //unregister multichat server
    
    if (this.configs.ngrok){  //ngrok
      this.http.post (this.configs.multiChatNgrokAddr+'/api/csp/unregister?action=unregister&sessionID='+this.configs.multiChatCode,   
      {}, httpOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        )
        .subscribe(
          res => {
            console.log('unregister multichat server');
            return true;
          });
      } else { //443 server
        this.http.post (this.configs.multiChatAddr+'/api/csp/unregister'+this.configs.multiChatPort+'?action=unregister&sessionID='+this.configs.multiChatCode, 
        {}, httpOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        )
        .subscribe(
          res => {
            console.log('unregister multichat server');
            return true;
          });
      }
  }


  // get staff session id count from staff model
  public getStaffTinkerSessionId(){
    return new Promise((resolve, reject) => {
        // this.updateUrl();
      this.http.get(this.serverUrl+'/chat/staff/session_id', { headers: { Authorization: `Bearer ${this.getToken()}` }} )
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  // get staff session id count from staff model
  public getOnlineStaffCount(){
    return new Promise((resolve, reject) => {
        // this.updateUrl();
      this.http.get(this.serverUrl+'/chat/staff/online_count', { headers: { Authorization: `Bearer ${this.getToken()}` }} )
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  // get staff session id count from staff model
  public getOnlineStaffNickname(){
    return new Promise((resolve, reject) => {
        // this.updateUrl();
      this.http.get(this.serverUrl+'/chat/staff/online_nickname', { headers: { Authorization: `Bearer ${this.getToken()}` }} )
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}

