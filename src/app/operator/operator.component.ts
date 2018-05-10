import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
