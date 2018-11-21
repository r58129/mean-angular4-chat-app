import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit {


  @HostBinding('class.view-campaign') 
  viewCampaign: any;

  campaign: any =[];
  editDetail: boolean = false;
  viewDetail: boolean = true;
  addCampaignPage: boolean = false;
  editCampaignPage: boolean = false;

  // campaignPeriod = {startTime: '', endTime:''};
  campaignDetail = { startTime: '', endTime:'', type:'', beforeCampaignMessage: '', duringCampaignMessage: {withNameCard:'',withoutNameCard:''} , afterCampaignMessage:'', registerFailedMessage: {nameCardCampaign:'',phoneNumCampaign:''}, keyword:'', eventName:'',createdBy:'',companyName:'', newUser:'', updated_at: Date, reserve1:'', reserve2:''};  //campaign detail
  newCampaign = { startTime:'', endTime: '', type:'', beforeCampaignMessage: '', duringCampaignMessage: {withNameCard:'',withoutNameCard:''} , afterCampaignMessage:'',registerFailedMessage: {nameCardCampaign:'',phoneNumCampaign:''}, keyword:'', eventName:'',createdBy:'',companyName:''};  //campaign detail

 	today = new Date();
	dd = this.today.getDate();
  mm = this.today.getMonth()+1; //January is 0!
  yyyy = this.today.getFullYear();
  todayNum: number = this.yyyy*10000 + this.mm*100  + this.dd;
  startNum: number;
  endNum: number;
  updateStartNum: number;
  updateEndNum: number;
  // startDate: any;
  // endDate:any;

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {}

  ngOnInit() {

    this.chatService.change.subscribe(viewCampaign => {
      console.log("this.viewCampaign.keyword: "+viewCampaign.keyword);
      console.log("this.viewCampaign.eventName: "+viewCampaign.eventName);
      this.campaignDetail = viewCampaign;

      this.showCampaignDetail(this.campaignDetail.keyword);

    });

  }

  showCampaignDetail(keyword){

		this.chatService.showCampaign(keyword).then((res) => {  //from chatService, 
	      this.campaign = res;
	    }, (err) => {
	      console.log(err);
	    });
  }
   
  saveCampaignDetail(){

 	  this.startNum = parseInt(this.newCampaign.startTime);
  	this.endNum = parseInt(this.newCampaign.endTime);

  	  console.log ('start Time: ' + this.startNum);
  	  console.log ('end Time: ' + this.endNum);
  	  console.log ('today: ' + this.todayNum);
  	  
  	  if ((this.endNum < this.todayNum) ||(this.endNum < this.startNum)){
  	  	
  	  	window.alert('Please check the campaign start and end date again!');
  	  } else {

		  	console.log(this.newCampaign.keyword);  	

				this.chatService.saveCampaign(this.newCampaign).then((res) => {  //from chatService, 
			      
			    window.alert('New Campaign is added successfully!');
			  }, (err) => {
			    console.log(err);
			    window.alert('Add campaign failed!');
			  });           	
  	  }	  	

		this.viewCampaignDetail();

  }

  updateCampaignDetail(){

 	  this.updateStartNum = parseInt(this.campaignDetail.startTime);	//20181201
  	this.updateEndNum = parseInt(this.campaignDetail.endTime);	//20181220

	    console.log ('start Time: ' + this.updateStartNum);
	    console.log ('end Time: ' + this.updateEndNum);
	  	console.log ('today: ' + this.todayNum);
	  	  
  	  if ((this.updateEndNum < this.todayNum) ||(this.updateEndNum < this.updateStartNum)){
  	  	
  	  	window.alert('Please check the campaign start and end date again!');
  	  } else {

				this.chatService.updateCampaign(this.campaignDetail.keyword, this.campaignDetail).then((res) => {  //from chatService, 
			      
			    window.alert('Campaign detail is updated successfully!\nPress "View" button in Campagin List to view updated data!');
			  }, (err) => {
			    console.log(err);
			    window.alert('Update campaign detail failed!');
			  });          	
  	  }	   	

		this.viewCampaignDetail();
  }

  viewCampaignDetail(){

		this.editDetail = false;
		this.viewDetail = true;
		this.editCampaignPage = false; 
		this.addCampaignPage = false;   	

  	console.log('view campaign detail!');
  }

  editCampaignDetail(){

		this.editDetail = true;
		this.viewDetail = false;
		this.editCampaignPage = true; 
		this.addCampaignPage = false; 	

  	console.log('edit Campaign detail!');
  }

  createCampaign(){

  	this.editDetail = true;
		this.viewDetail = false;
		this.editCampaignPage = false; 
		this.addCampaignPage = true; 
  	console.log(' add Campaign!');

  }

  exit() {
    console.log("Exit the campaign Detail");
    this.editDetail = false;
  }    

  deleteCampaign(){
    console.log('campaignDetail.keyword: ' +this.campaignDetail.keyword)
    if (window.confirm('Campaign will be deleted!')){
      this.chatService.deleteCampaign(this.campaignDetail.keyword).then((res) => {  //from chatService,    
      }, (err) => {
        console.log(err);
      });
    } else {
      console.log('do nothing!')
    }
  	this.viewCampaignDetail();
  }
}

