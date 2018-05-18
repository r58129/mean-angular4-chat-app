import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'

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
    OperatorComponent,
    RequestComponent,
    ServiceComponent
    // ApphovertableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
    // RouterModule.forRoot(ROUTES)
  ],
  providers: [
    ChatService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
