import { Component, OnInit, Output, EventEmitter,HostListener } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval'
import * as io from 'socket.io-client';
import * as $ from 'jquery';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report-search',
  templateUrl: './report-search.component.html',
  styleUrls: ['./report-search.component.css']
})
export class ReportSearchComponent implements OnInit {

	allChat: any;  //new request	
	// notSearch: boolean = true;
  searchRange = {start_time: '', end_time:'', filename:''};
  exportData = { customer_service:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '', request_status: '', filename: '', image: '', file_path: '', operator_request: '', type: '', people_in_room: '', updated_at:''};
 	today = new Date();
	dd = this.today.getDate();
  mm = this.today.getMonth()+1; //January is 0!
  yyyy = this.today.getFullYear();
  todayNum: number = this.yyyy*10000 + this.mm*100  + this.dd;
  startNum: number;
  endNum: number;
  

  	constructor(private chatService: ChatService, private configs: Configs) {}

  	ngOnInit() {

  		
  	}

  	private exportHistory(){
  	  // var operator_request = "true";
  	  this.startNum = parseInt(this.searchRange.start_time);
  		this.endNum = parseInt(this.searchRange.end_time);

  	  console.log ('start Time: ' + this.startNum);
  	  console.log ('end Time: ' + this.endNum);
  	  console.log ('today: ' + this.todayNum);
  	  
  	  if (this.endNum > this.todayNum){

  	  	console.log('End time cannot exceed today!');
  	  	window.alert('End time cannot exceed today!');
  	  } else {
  	  	this.chatService.exportChatHistory(this.searchRange.start_time, this.searchRange.end_time).then((res) => {  //from chatService, 
		      this.allChat = res;
		      this.saveToFs(this.allChat);
		      // console.log(this.allChat);
		    }, (err) => {
		      console.log(err);
		    });
	    	
  	  }
			
  	}

  	private saveToFs(data){
			console.log('All json data: ', data);

			var fileName = this.searchRange.filename +'.json';

			var file = new Blob([JSON.stringify(data, undefined, 2)], { 
				type: 'application/json'});
    	saveAs(file, fileName);

  	}

}
