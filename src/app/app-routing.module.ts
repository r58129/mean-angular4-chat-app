import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat/chat.component';
import { AppheaderComponent } from './components/appheader/appheader.component';
import { AppfooterComponent } from './components/appfooter/appfooter.component';
import { AppmenuComponent } from './components/appmenu/appmenu.component';
import { AppsettingsComponent } from './components/appsettings/appsettings.component';
import { ApploginComponent } from './components/applogin/applogin.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AdminComponent } from './admin/admin.component';
// import { OperatorComponent } from './operator/operator.component';
import { RequestComponent } from './request/request.component';
//import { ServiceComponent } from './service/service.component';
// import { AuthguardGuard } from './authguard.guard';
// import { AuthserviceService } from './authservice.service';
// import { HistoryComponent } from './history/history.component';
import { OpchatComponent } from './opchat/opchat.component';
import { OprequestComponent } from './oprequest/oprequest.component';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth.guard.service';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HistoryComponent } from './history/history.component';
import { MultichatComponent } from './multichat/multichat.component';
import { MultichatReqComponent } from './multichat-req/multichat-req.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HistorySearchComponent } from './history-search/history-search.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';


const appRoutes: Routes = [
    // { path: '', component: HomeComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'api/registerID/0a6O85y4h5cVsBfRB-57n4l4DBN6WmMlA2f94I_oaNs', component: RegisterComponent },
  { path: 'api/forgotpwd', component: ForgotPasswordComponent },
  { path: 'api/resetpwd/:token', component: ResetPasswordComponent },
  { path: 'api/profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  
  // { path: '', component: ApploginComponent, pathMatch: 'full'},
  
  { path: 'chat/request', component: RequestComponent, 
    children:[
      { path: 'chatbox/:id/:id2/:id3/:id4/:id5', component: ChatComponent, outlet:'chatOutlet',canActivate: [AuthGuardService]},
  ], canActivate: [AuthGuardService]},
  
  { path: 'chat/operator', component: OprequestComponent, 
    children:[
      { path: 'opchatbox/:id/:id2', component: OpchatComponent, outlet:'opchatOutlet',canActivate: [AuthGuardService]},
  ], canActivate: [AuthGuardService]},

  // { path: 'chat/multichat', component: MultichatReqComponent, 
  //   children:[
  //     { path: 'multichatbox/:id', component: MultichatComponent, outlet:'multichatOutlet',canActivate: [AuthGuardService]},
  // ], canActivate: [AuthGuardService]},
 
  { path: 'chat/history', component: HistorySearchComponent, 
    children:[
      { path: 'historybox/:id', component: HistoryComponent, outlet:'historyOutlet',canActivate: [AuthGuardService]},
  ], canActivate: [AuthGuardService]},

  { path: 'chat/userSettingPage', component: UsersComponent, 
    children:[
      { path: 'userdetailbox/:id', component: UserDetailComponent, outlet:'userdetailOutlet',canActivate: [AuthGuardService]},
  ], canActivate: [AuthGuardService]},
  // { path: 'opchat', component: OpchatComponent, canActivate: [AuthguardGuard] },
  // { path: 'admin', component: AdminComponent , canActivate: [AuthguardGuard]},
  // { path: 'oldoperator', component: OperatorComponent, canActivate: [AuthguardGuard] },
  { path: '**', component: PagenotfoundComponent}
  // { path: '', redirectTo: '/login', pathMatch: 'full', canActivate: [AuthguardGuard] },
  // { path: 'login', component: ApploginComponent},
  // { path: 'service', component: ServiceComponent, children: [
  //     { path: 'request', component: RequestComponent, outlet:'requestOutlet' },
  //     { path: 'chat', component: ChatComponent, outlet:'chatOutlet'},
  // ]},
  // { path: 'request', component: RequestComponent, children:[
  //     { path: 'chatbox/:id/:id2', component: ChatComponent, outlet:'chatOutlet'},
  // ]},
  // { path: 'admin', component: AdminComponent },
  // { path: 'operator', component: OperatorComponent },
  // { path: '**', component: PagenotfoundComponent}
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      //{ useHash: false }
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}