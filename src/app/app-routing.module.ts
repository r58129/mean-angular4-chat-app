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

const appRoutes: Routes = [
  { path: 'login', component: ApploginComponent},
  { path: 'chats', component: ChatComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'operator', component: OperatorComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent}
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}