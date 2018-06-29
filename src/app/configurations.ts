import { Injectable } from '@angular/core';

@Injectable()
export class Configs {
  
  angularAddr: string = 'https://airpoint.com.hk:4080';
  expressAddr: string = 'https://airpoint.com.hk:4060';
  socketIoServerAddr: string = 'https://airpoint.com.hk:3637';
  tinkerboardAddr: string = 'https://airpoint.com.hk:8006';
  // remember to update the express port number in bin/www
  // update mongodb address and name and express port as needed in app.js
}