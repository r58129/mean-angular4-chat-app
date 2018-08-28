import { Injectable } from '@angular/core';
//import { AuthserviceService } from './authservice.service';

@Injectable()
export class Configs {
  
  //    constructor(public authService: AuthserviceService) {}
    
  angularAddr: string = 'https://airpoint.com.hk:4080';
  expressAddr: string = 'https://airpoint.com.hk:4060';
  socketIoServerAddr: string = 'https://airpoint.com.hk:3637';   
  tinkerboardAddr: string = 'https://airpoint.com.hk';
  tinkerport: string = '8006';

  // angularAddr: string = localStorage.getItem('baseAddress');
  // expressAddr: string =localStorage.getItem('baseAddress') +":"+localStorage.getItem('expressPort');
  // socketIoServerAddr: string =localStorage.getItem('baseAddress') +":"+localStorage.getItem('sokcetioPort');
  // tinkerboardAddr: string =localStorage.getItem('baseAddress');
  // tinkerport: string =localStorage.getItem('tinkerPort');

  multiChatdAddr: string = 'https://ea6aa49f.ngrok.io';
  // multiChatport: string = '3991';
  multiChatCode: string = 'Aptc123456';
  

  // angularAddr: string = 'https://airpoint.com.hk:4080';
  // expressAddr: string = 'https://airpoint.com.hk';
  // socketIoServerAddr: string = 'https://airpoint.com.hk';   
  // tinkerboardAddr: string = 'https://airpoint.com.hk';
  
   // loginTinkerDone:string="0";
    
// update server express addr in app.js
 //global.expressIp = 'https://192.168.0.102';
 //global.expressPort = 3088;

// update mongodb addr and name in app.js
 //global.dbIp = 'mongodb://192.168.0.102/';
 //global.dbName = 'luChatService';
}