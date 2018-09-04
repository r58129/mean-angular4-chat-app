import { Injectable } from '@angular/core';
//import { AuthserviceService } from './authservice.service';

@Injectable()
export class Configs {
  
  //    constructor(public authService: AuthserviceService) {}
    
  angularAddr: string = 'https://cs.roboassistant.ai:3102';
  expressAddr: string = 'https://cs.roboassistant.ai:3006';
  socketIoServerAddr: string = 'https://cs.roboassistant.ai:3005';   
  tinkerboardAddr: string = 'https://cs.roboassistant.ai';
  tinkerport: string = '8014';

  // angularAddr: string = localStorage.getItem('baseAddress');
  // expressAddr: string =localStorage.getItem('baseAddress') +":"+localStorage.getItem('expressPort');
  // socketIoServerAddr: string =localStorage.getItem('baseAddress') +":"+localStorage.getItem('sokcetioPort');
  // tinkerboardAddr: string =localStorage.getItem('baseAddress');
  // tinkerport: string =localStorage.getItem('tinkerPort');

  multiChatAddr: string = 'https://51a4596b.ngrok.io';
  // multiChatAddr: string = 'https://a76d2e33.ngrok.io';
  multiChatPort: string = '3993';
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