import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-broadcast-detail',
  templateUrl: './broadcast-detail.component.html',
  styleUrls: ['./broadcast-detail.component.css']
})
export class BroadcastDetailComponent implements OnInit {

  @HostBinding('class.view-broadcast') 
  viewBroadcast: any;
  broadcast: any =[];
  editDetail: boolean = false;
  viewDetail: boolean = true;
  addBroadcastPage: boolean = false;
  editBroadcastPage: boolean = false;
  notSelected: boolean = true;
  selectedImage: File;
  compressedImage: File;
  url = '';  


  broadcastDetail = { jobID:'', message: '', contactListCsvName:'', imagefile:'', imagefilename:'', notSendAck:'', prependContactName:'', jobStatus:''
  // jobDetail comes from android
  // , jobDetail:{[success:'',messageID:'', message:'', image:'', jobEntires:[{name:'', number:'', location:'', hasContact:'', sent:''}]]}
	};  
  
  newBroadcast = { jobID:'', message:'', contactListCsvName: '', imagefile:'', imagefilename:'', notSendAck:'',prependContactName:'', jobStatus:'' };  

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {}

  ngOnInit() {

    this.chatService.change.subscribe(viewBroadcast => {
      console.log("this.viewBroadcast.jobID: "+viewBroadcast.jobID);
      this.broadcastDetail = viewBroadcast;

      this.showBroadcastDetail(this.broadcastDetail.jobID);

    });

  }

  showBroadcastDetail(jobID){

		this.chatService.getBroadcastbyJobId(jobID).then((res) => {  //from chatService, 
	      this.broadcast = res;
	    }, (err) => {
	      console.log(err);
	    });
  }
   
  saveBroadcastDetail(){

  	console.log("create new broadcast job");  	
	     
	  if (window.confirm('Once broadcast job is submitted, opeartor and administrator chat services will not be available until the job is completed!')){
			
			this.chatService.saveBroadcast(this.newBroadcast).then((res) => {  //from chatService, 
		      
		    window.alert('Broadcast job is submitted successfully!');
		  }, (err) => {
		    console.log(err);
		    window.alert('Add Broadcast job failed!');
		  });	  	

	  }else {
	  	console.log('Broadcast job is cancelled')
	  }


		this.viewBroadcastDetail();

  }

  updateBroadcastDetail(){
  	// this.editUser = this.user;
  	// console.log(this.userDetail.phone_number);
  	// console.log(this.userDetail.nickname);

		this.chatService.updateBroadcast(this.broadcastDetail.jobID, this.broadcastDetail).then((res) => {  //from chatService, 
	      
	    window.alert('Broadcast detail is updated successfully!\nPress "View" button in User List to view updated data!');
	  }, (err) => {
	    console.log(err);
	    window.alert('Update user detail failed!');
	  });
		this.viewBroadcastDetail();
  }

  viewBroadcastDetail(){

		this.editDetail = false;
		this.viewDetail = true;
		this.editBroadcastPage = false; 
		this.addBroadcastPage = false;   	

  	console.log('view Broadcast detail!');
  }

  editBroadcastDetail(){

		this.editDetail = true;
		this.viewDetail = false;
		this.editBroadcastPage = true; 
		this.addBroadcastPage = false; 	

  	console.log('edit Broadcast detail!');
  }

  createBroadcast(){

  	this.editDetail = true;
		this.viewDetail = false;
		this.editBroadcastPage = false; 
		this.addBroadcastPage = true; 
  	console.log(' add Broadcast!');

  }

  exit() {
    console.log("Exit the Broadcast Detail");
    this.editDetail = false;
  }    

  onImageFileSelected(event) {    

    // this.compressedFile = event.target.files[0];

    // this.selectedFile = this.compressFile();
    this.selectedImage = event.target.files[0];


    console.log("event.target.files[0]: " +this.selectedImage);
    console.log("onFileSelected name: " +this.selectedImage.name);
    // console.log("event.target.files: " +event.target.files);  //file list

    if (event.target.files && event.target.files[0]) {

      var reader = new FileReader();
      reader.readAsDataURL(this.selectedImage); // read file as data url
      // reader.readAsArrayBuffer(event.target.files[0]);  //read as Array buffer
      reader.onload = (event:any) => { // called once readAsDataURL is completed        
        // this.url = event.target.result;
        // console.log("url: " +this.url);    //base64

        var img = new Image();
        var imageSize:any;
        var roundedImageSize:any;

        img.src = event.target.result;        

        //jpeg -> base64, size increase 33%. scale factor = 0.75 to get the actual file size
        imageSize = (encodeURI(img.src).split(/%..|./).length - 1)*0.75/1024;
        roundedImageSize = Math.round(imageSize);  

        console.log('image size : ' + roundedImageSize +'kB');        

        // console.log('image: ' + img.src );

        img.onload = () => {
           
            var canvas: HTMLCanvasElement = document.createElement("canvas");
            var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

            console.log('img.width: ' +img.width);
            console.log('img.height: ' +img.height);           

            canvas.width = img.width;
            canvas.height = img.height;
            
            // img.width and img.height will give the original dimensions
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log('drawing image: ' + canvas.width +',' + canvas.height);

            if (roundedImageSize < 100) {

              this.url=ctx.canvas.toDataURL('image/jpeg', 1.0) ;

              console.log (this.url);

              ctx.canvas.toBlob((blob) => {

                this.compressedImage = new File([blob], this.selectedImage.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
              }, 'image/jpeg', 1.0);
            }  

            if ((roundedImageSize >= 100) && (roundedImageSize <500))  {

              this.url=ctx.canvas.toDataURL('image/jpeg', 0.7) ;

              console.log (this.url);

              ctx.canvas.toBlob((blob) => {

                this.compressedImage = new File([blob], this.selectedImage.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
              }, 'image/jpeg', 0.7);
            }            

            if ((roundedImageSize >= 500) && (roundedImageSize <5000)){

              this.url=ctx.canvas.toDataURL('image/jpeg', 0.5) ;

              console.log (this.url);

              ctx.canvas.toBlob((blob) => {

                this.compressedImage = new File([blob], this.selectedImage.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
              }, 'image/jpeg', 0.5);
            }

            if ((roundedImageSize >= 5000) && (roundedImageSize <16000)){

              window.alert('Image will be compressed significantly as the file is large!');

              this.url=ctx.canvas.toDataURL('image/jpeg', 0.2) ;

              console.log (this.url);

              ctx.canvas.toBlob((blob) => {

                this.compressedImage = new File([blob], this.selectedImage.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
              }, 'image/jpeg', 0.2);
            }            

            if (roundedImageSize >= 16000) {
              
              window.alert('Not supported! Image size is too large!');
              this.url = '';
              this.compressedImage = null;

            }

          },
            reader.onerror = error => console.log(error)
        }
    
    }

  } 
  // deleteUser(){
  //   console.log('userDetail: ' +this.userDetail.phone_number)
  //   if (window.confirm('User will be deleted!')){
  //     this.chatService.deleteUser(this.userDetail.phone_number).then((res) => {  //from chatService,    
  //     }, (err) => {
  //       console.log(err);
  //     });
  //   } else {
  //     console.log('do nothing!')
  //   }
  // 	this.viewUserDetail();
  // }
}
