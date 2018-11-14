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
  searchRange = {start_time: '', end_time:'', filename:'', format:''};
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

  	public exportHistory(){
  	  // var operator_request = "true";
  	  this.startNum = parseInt(this.searchRange.start_time);
  		this.endNum = parseInt(this.searchRange.end_time);

  	  console.log ('start Time: ' + this.startNum);
  	  console.log ('end Time: ' + this.endNum);
  	  console.log ('today: ' + this.todayNum);
  	  
  	  if ((this.endNum > this.todayNum) ||(this.endNum < this.startNum)){

  	  	console.log('There is something wrong with the input date!');
  	  	window.alert('There is something wrong with the input date!');
  	  } else {

        console.log(this.searchRange.format);

  	  	this.chatService.exportChatHistory(this.searchRange.start_time, this.searchRange.end_time).then((res) => {  //from chatService, 
		      this.allChat = res;
          // console.log(this.allChat);
          
          if (this.allChat.length == 0){
            window.alert('No Content is found within the period!');
          } else {

            if (this.searchRange.format == 'json'){
  		        this.exportToJson(this.allChat);
            }

            if (this.searchRange.format == 'csv'){
              this.exportToCsv(this.allChat);
            }

            window.alert('Downloaded file can be found in broswer default path!');            
          }
          
		    }, (err) => {
		      console.log(err);
		    });	    	
  	  }			
  	}


  	private exportToJson(data){
			// console.log('All json data: ', data);

			var fileName = this.searchRange.filename +'.json';

			var file = new Blob([JSON.stringify(data)], { 
      // var file = new Blob([JSON.stringify(data, undefined, 2)], { 
				type: 'application/json'});
    	saveAs(file, fileName);
  	}
    
    private exportToCsv(data){
      // console.log('All csv data: ', data);

      const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      var fileName = this.searchRange.filename +'.csv';

      var file = new Blob([csvArray], { 
        type: 'text/csv'});
      saveAs(file, fileName);

    }  
}
