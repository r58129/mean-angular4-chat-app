import { Injectable } from '@angular/core';

@Injectable()
export class Configs {
  
  angularAddr: string = 'https://airpoint.com.hk:4080';
  expressAddr: string = 'https://airpoint.com.hk:4060';
  socketIoServerAddr: string = 'https://airpoint.com.hk:3637';
  tinkerboardAddr: string = 'https://airpoint.com.hk:8006';
  
// update server express addr in app.js
// global.expressIp = 'https://192.168.0.102';
// global.expressPort = 4060;
}