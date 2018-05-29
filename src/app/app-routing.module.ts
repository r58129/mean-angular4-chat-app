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
import { OperatorComponent } from './operator/operator.component';
import { RequestComponent } from './request/request.component';
import { ServiceComponent } from './service/service.component';

import { AuthguardGuard } from './authguard.guard';


const appRoutes: Routes = [
  //{ path: '', redirectTo: '/request', pathMatch: 'full' },
  //{ path: '', redirectTo: '/login' , pathMatch: 'full' },
  { path: '', component: ApploginComponent, pathMatch: 'full'},

  // { path: 'service', component: ServiceComponent, children: [
  //     { path: 'request', component: RequestComponent, outlet:'requestOutlet' },
  //     { path: 'chat', component: ChatComponent, outlet:'chatOutlet'},
  // ]},
  { path: 'request', component: RequestComponent, children:[
      { path: 'chatbox/:id', component: ChatComponent, outlet:'chatOutlet'},
  ], canActivate: [AuthguardGuard]},
  { path: 'admin', component: AdminComponent , canActivate: [AuthguardGuard]},
  { path: 'operator', component: OperatorComponent, canActivate: [AuthguardGuard] },
  { path: '**', component: PagenotfoundComponent}

  // { path: '**', component: PagenotfoundComponent}
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes //,
        //{ useHash: false }
      //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}