import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// import { RouterModule } from '@angular/router';
//import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

// this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; 

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'

//import { Configs } from './configurations';
import { Configs } from './../environments/environment';

import { ChatService } from './chat.service';
// import { AuthguardGuard } from './authguard.guard';
// import { AuthserviceService } from './authservice.service';
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
import { OpchatComponent } from './opchat/opchat.component';
import { OprequestComponent } from './oprequest/oprequest.component';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth.guard.service';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HistoryComponent } from './history/history.component';
// import { MultichatComponent } from './multichat/multichat.component';
// import { MultichatReqComponent } from './multichat-req/multichat-req.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HistorySearchComponent } from './history-search/history-search.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
// import { ExportHistoryComponent } from './export-history/export-history.component';
import { ReportSearchComponent } from './report-search/report-search.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { CommandListComponent } from './command-list/command-list.component';
import { WhitelistComponent } from './whitelist/whitelist.component';
import { SettingComponent } from './setting/setting.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { StaffPlanComponent } from './staff-plan/staff-plan.component';
import { DisableIfUnauthorizedDirective } from './disable-if-unauthorized.directive';
import { HideIfUnauthorizedDirective } from './hide-if-unauthorized.directive';
import { BroadcastDetailComponent } from './broadcast-detail/broadcast-detail.component';
import { BroadcastComponent } from './broadcast/broadcast.component';

// import { EmojiModule } from 'angular-emoji/dist';

// import { ApphovertableComponent } from './components/apphovertable/apphovertable.component';

// const ROUTES = [
//   { path: 'login', component: ApploginComponent},
//   { path: 'chats', component: ChatComponent },
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: '**', component: PagenotfoundComponent}
// ];

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppmenuComponent,
    AppsettingsComponent,
    ApploginComponent,
    PagenotfoundComponent,
    AdminComponent,
    // OperatorComponent,
    RequestComponent,
    OpchatComponent,
    OprequestComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    HistoryComponent,
    // MultichatComponent,
    // MultichatReqComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HistorySearchComponent,
    UsersComponent,
    UserDetailComponent,
    // ExportHistoryComponent,
    ReportSearchComponent,
    OurServicesComponent,
    CommandListComponent,
    WhitelistComponent,
    SettingComponent,
    CampaignDetailComponent,
    CampaignsComponent,
    StaffPlanComponent,
    DisableIfUnauthorizedDirective,
    HideIfUnauthorizedDirective,
    BroadcastDetailComponent,
    BroadcastComponent
    //CallbackComponent
    // ApphovertableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // HttpModule,
    HttpClientModule,
    AppRoutingModule,    
    NgIdleKeepaliveModule.forRoot()
    // UserIdleModule.forRoot({idle: 60, timeout: 30, ping: 10}) // unit: s
    // EmojiModule
    // RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AuthService,
    AuthGuardService,
    // AuthserviceService,
    // AuthguardGuard,
    ChatService,
    Configs,
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
  