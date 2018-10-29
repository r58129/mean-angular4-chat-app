import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  // @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  //Ben

  url = '';
  getUrl = '';
  ImageObject = {};
  displayImage = '';
  selectedFile: File;
  compressedFile: File;
  getFile: any;
  chats: any =[];
  appName: string ='whatsapp';
  joinned: boolean = false;
  notSelected: boolean = true;
  chatRoom: any;

  newUser = { type:'', nickname: '', room: '' ,socket_id: '', db_id:'', request_status:'', people_in_room:''};
  msgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: { data:Buffer, contentType:'' }};
  imgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: '' };
  CusImgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '', file_path:'', image: '' };
  CusMsgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // socket = io('http://localhost:4000');
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  //socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  socket = io(this.configs.socketIoServerAddr,{secure: true});

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {
    // console.log("inside chat constructor" +this.route.snapshot.params);
  }

  ngOnInit() {
//      history.pushState({},"Edit","");

    // console.log(this.configs.socketIoServerAddr); 
    // console.log(this.configs.expressAddr); 
    // console.log(this.configs.tinkerboardAddr); 


    this.route.params.subscribe(params =>{
      // console.log(params);
      this.newUser.room = params['id'];
      // console.log(this.newUser.room);     
    });

    this.route.params.subscribe(params =>{
      // console.log(params);
      this.newUser.socket_id = params['id2'];
      // console.log(this.newUser.socket_id);     
    });

    this.route.params.subscribe(params =>{
      // console.log(params);
      this.newUser.db_id = params['id3'];
      // console.log(this.newUser.db_id);     
    });

    this.route.params.subscribe(params =>{
      // console.log(params);
      this.newUser.request_status = params['id4'];
      // console.log(this.newUser.request_status);     
    });

    this.route.params.subscribe(params =>{
      // console.log(params);
      if (this.newUser.type != undefined){
        this.newUser.type = params['id5'];
      } else {
        this.newUser.type = "whatsapp";
      }
      // console.log(this.newUser.request_status);     
    });

    var user = JSON.parse(sessionStorage.getItem("user"));
    // var request = JSON.parse(localStorage.getItem("request"));

  this.socket.on('chat', (msg) =>{
    // this.socket.on('chat', (userid, msg) =>{
    // if (sessionStorage.getItem("user")!=null){  
      var date = new Date();
      console.log("print customer message object:" +msg);

      // modify this to json object
      var obj = JSON.parse(msg);
      var phoneNum = obj.sessionID;
      var message = obj.message;
      var filePath = obj.photoPath;

      console.log("print customer phoneNum:" +phoneNum);
      console.log("print customer message:" +message);
      console.log("print customer photoPath:" +filePath);

      // get Apps type
      // var type=localStorage.getItem('user.type');

      if (msg !== 'undefine'){

        if (!message.includes('\uD83D\uDCF7')){
          if (filePath == 'nonwhatsapp'){
          
            this.appName = 'nonwhatsapp';
            console.log('filePath in nonwhatsapp : ' +filePath);
            console.log('text message in nonwhatsapp : ' +this.appName);
          } else {
            this.appName = 'whatsapp';
            console.log('text message from in whatsapp: ' +this.appName);
          }
      
          this.CusMsgData = { type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: message };
          // console.log(this.CusMsgData.room);
          // console.log(this.CusMsgData.phone_number);
          // console.log(this.CusMsgData.socket_id);
          // console.log(this.CusMsgData.message);
          
          this.chatService.saveChat(this.CusMsgData).then((result) => {
            this.socket.emit('save-message', result);
          }, (err) => {
            console.log(err);
          });
        } else { //else  (message.includes('\uD83D\uDCF7'))

            if ((!filePath) || (filePath == "Timeout")){
              console.log("filePath is null or Timeout");

              this.CusMsgData = { type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: "Sent Photo Failed!" };
              // console.log(this.CusMsgData.room);
              // console.log(this.CusMsgData.phone_number);
              // console.log(this.CusMsgData.socket_id);
              // console.log(this.CusMsgData.message);
            
              this.chatService.saveChat(this.CusMsgData).then((result) => {
                this.socket.emit('save-message', result);
              }, (err) => {
                console.log(err);
              });

            } else {  // else (filePath == 'nonwhatsapp')
              if (filePath == 'nonwhatsapp'){
                // extract non whatsapp image from message
                // var base64header = ((message).split(".")[1]);
                var base64Image = ((message).split(".")[1]);
                console.log('base64Image: ' +base64Image);

                //save to DB 
                  this.CusImgData = { type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: '', file_path:filePath, image:base64Image };
                  console.log('receive image from customer');
                  console.log(this.CusImgData.room);
                  console.log(this.CusImgData.phone_number);
                  console.log(this.CusImgData.socket_id);
                  console.log(this.CusImgData.message);
                  console.log(this.CusImgData.image);
                  console.log(this.CusImgData.file_path);

                  this.chatService.saveImage(this.CusImgData).then((result) => {
                    console.log('save data to DB');
                    this.socket.emit('save-image', result);
                  }, (err) => {
                    console.log(err);
                  });

              } else {  // whatsapp flow will provide valid file path
                  // get admin sessionID
                  var sID=localStorage.getItem('res.data.sessionID');
                  var fileType = ((filePath).split(".")[1]);
                  var path = 'sessionID='+sID +'&path='+filePath;
                  // var completePath = 'https://airpoint.com.hk:'+sessionStorage.getItem("tinkerport")+'/api/csp/getimage?'+path;  //save complete path to db
                  var completePath = this.configs.tinkerboardAddr+':'+this.configs.tinkerport+'/api/csp/getimage?'+path;  //save complete path to db

                  console.log("sID: " + sID);
                  console.log("tinkerPath: " + filePath);
                  console.log("complete path: " + completePath);
                  console.log("fileType: " + fileType);

                  this.chatService.getImageFromNode(path).then((res) => {  //from chatService
                    console.log(" get image from tinker");
                  
                    var blob = new Blob(
                        [res],
                        // Mime type is important for data url
                        // {type : 'text/html'}
                        {type : 'image/' +fileType}
                        );


                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend =(evt:any) =>{
                      // Capture result here
                      var getImage = evt.target.result;
                      console.log(evt.target.result);

                      this.CusImgData = { type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: message, file_path:completePath, image:getImage };
                      console.log('receive image from customer');
                      console.log(this.CusImgData.room);
                      console.log(this.CusImgData.phone_number);
                      console.log(this.CusImgData.socket_id);
                      console.log(this.CusImgData.message);
                      console.log(this.CusImgData.image);
                      console.log(this.CusImgData.file_path);

                      this.chatService.saveImage(this.CusImgData).then((result) => {
                        console.log('save Image from tinker');
                        this.socket.emit('save-image', result);
                      }, (err) => {
                        console.log(err);
                      });

                    };
                 

                  }, (err) => {
                    console.log(err);
                  });
          
                  //sessionID=193bc1f1-9799-40e7-a899-47b3aa1fbde3&path=/storage/emulated/0/WhatsApp/Media/WhatsApp%20Images/avator105.jpg
              }  // end else whatsapp flow will provide valid file path
            }  // end else (filePath == 'nonwhatsapp')
        }  //end else (message.includes('\uD83D\uDCF7'))
      }  // end if (msg !== 'undefine')
    // }  // end if (sessionStorage.getItem("user")!=null)
  });

  this.socket.on('disconnect', function(userid){
    console.log('Disconnect: ' + userid);
    var message = "User is disconnected!";

    // var goodbye = "Goodbye";
    // this.SendForm(goodbye);
    // console.log("goodbye");
    if (userid != 'transport close'){
      this.CusMsgData = { type: this.newUser.type, phone_number: userid, socket_id: 'socket_id', room:userid , nickname:userid , message: message };
        console.log(this.CusMsgData.room);
        console.log(this.CusMsgData.phone_number);
        console.log(this.CusMsgData.socket_id);
        console.log(this.CusMsgData.message);
        
        this.chatService.saveChat(this.CusMsgData).then((result) => {
        this.socket.emit('save-message', result);
        }, (err) => {
          console.log(err);
        });
    }
  }.bind(this));
  // end of from johnson


    if(user!==null) {
      // this.getChatByRoom(user.room);  //from chatService
      // this.getRequestByRoom(request.phone_number);  //testing
      this.msgData = { type: user.type, phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }
    
    this.socket.on('new-message', function (data) {
      // console.log("data.message.room: " + data.message.room);
      // console.log("JSON.parse(localStorage.getItem('user')).room: " + (JSON.parse(localStorage.getItem("user")).room));
      
    if (sessionStorage.getItem("user")!=null){
      console.log("new-message: " + data.message.message);
      if(data.message.room === JSON.parse(sessionStorage.getItem("user")).room) {
          user=JSON.parse(sessionStorage.getItem("user"));
        this.chats.push(data.message);
        this.msgData = { type: user.type, phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
            }
        }
    }.bind(this));


    this.socket.on('new-image', function (data) {
      
      
      if (sessionStorage.getItem("user")!=null){
        console.log("new-image: " + data.room);

        if(data.room === JSON.parse(sessionStorage.getItem("user")).room) {
        console.log("new-image inside if: " + data.room);

          if (data.filename !== 'undefined'){
            // this.chats.push(data.message, data.filename);
            console.log("new-image: " + data.filename);
            this.chats.push(data);
            this.imgData = { type: user.type, phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '', 
            filename: user.filename, image: user.image}
            // this.RetrievePhoto(data);
            this.scrollToBottom();
          }
        }
      }
      
    }.bind(this));

    // console.log(this.ImageObject);

  }

  ngOnDestroy(){
        
        //socket.emit('forceDisconnect');
    // this.socket.disconnect();
    // if (this.timer){
    //   clearInterval(this.timer);
    //   console.log('stop refreshing');
    // }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    // this.scrollTableToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    console.log("inside getChatbyRoom" +room);
    this.chatService.getChatByRoom(room).then((res) => {  //from chatService
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    var socket_id =this.newUser.socket_id;
    console.log('joinRoom using socket_id: ' +socket_id);
    this.Connect(socket_id);  //connect to customer socket
    var date = new Date();
    sessionStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = {type: this.newUser.type, phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', {type: this.newUser.type, phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });

    //get db id
    var db_id = this.newUser.db_id;
    var currentStatus = this.newUser.request_status;
    var updateStatus = { request_status:"Working", people_in_room:"2"};

    // console.log('request_id: ' +db_id);
    console.log('request status: ' +currentStatus)

    //update request_status to working when admin has joined the room
    if (currentStatus == "New")
    {
      this.chatService.updateChat(db_id, updateStatus).then((res) => {  //from chatService
        console.log("status updated");
      }, (err) => {
        console.log(err);
      });

    } else {  //wont' udpate when status is Working, Done and Quit
      console.log("status is NOT updated");
      this.chatService.showChat(db_id).then((res) => {  
        this.chatRoom =res;  //show number of people in room
        console.log(" join this.chatRoom.people_in_room: " +this.chatRoom.people_in_room);
        if (this.chatRoom.people_in_room != undefined){
          console.log("people in this room: " +this.chatRoom.people_in_room);
          
          var peopleNumber = parseInt(this.chatRoom.people_in_room);
          peopleNumber =peopleNumber +1;
          console.log(" new people in this room: " +peopleNumber);

          var updatePeopleInRoom ={people_in_room: peopleNumber};
          
          this.chatService.updateChat(db_id, updatePeopleInRoom).then((res) => {  //from chatService
            console.log("people number updated");
          }, (err) => {
            console.log(err);
          });
        }
      }, (err) => {
        console.log(err);
      });
    }   
  }

  sendMessage() {
    var message = this.msgData.message;

    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
    this.SendForm(message);
  }

  logout() {

    var date = new Date();
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.socket.emit('save-message', { type:user.type, phone_number:user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    sessionStorage.removeItem("user");
    this.joinned = false;

    //update request_status to Done after logout
    var db_id = this.newUser.db_id;
    var currentStatus = this.newUser.request_status;
    console.log('request_id: ' +db_id);
    var updateStatus = { request_status:"Done", people_in_room:"0"};

   if ((currentStatus == "New") || (currentStatus == "Working"))
    {
      this.chatService.showChat(db_id).then((res) => {  
        this.chatRoom =res;  //show number of people in room
        var peopleNumber = parseInt(this.chatRoom.people_in_room)
        console.log(" logout this.chatRoom.people_in_room: " +peopleNumber);
        
        if (peopleNumber <=2){

          this.chatService.updateChat(db_id, updateStatus).then((res) => {  //from chatService
            console.log("status updated");

            //send goodbye message when there are only 2 people left
            var goodbye = "Goodbye";
            this.SendForm(goodbye);
            console.log("goodbye");
            console.log("disconnect customer and logout the room");
          
          }, (err) => {
            console.log(err);
          });


        } else {
          
          // var peopleNumber = parseInt(this.chatRoom.people_in_room);
          peopleNumber =peopleNumber - 1;

          // this.chatRoom.people_in_room = this.chatRoom.people_in_room -1;

          var updatePeopleInRoom ={people_in_room: peopleNumber};
          
          this.chatService.updateChat(db_id, updatePeopleInRoom).then((res) => {  //from chatService
            console.log("people number updated");
          }, (err) => {
            console.log(err);
          });

        }

      }, (err) => {
        console.log(err);
      });
    } else {  //Done and Quit case

      this.chatService.showChat(db_id).then((res) => {  
        
        this.chatRoom =res;  //show number of people in room
        var peopleNumber = parseInt(this.chatRoom.people_in_room)
        console.log("this.chatRoom.people_in_room: " +peopleNumber);
                  
        if (peopleNumber > 0){
          peopleNumber =peopleNumber - 1;

          // this.chatRoom.people_in_room = this.chatRoom.people_in_room -1;

          var updatePeopleInRoom ={people_in_room: peopleNumber};
          
          this.chatService.updateChat(db_id, updatePeopleInRoom).then((res) => {  //from chatService
            console.log("people number updated");
          }, (err) => {
            console.log(err);
          });
        } else {
        console.log("people number is not updated");
        }

      }, (err) => {
        console.log(err);
      });


    }


    console.log("status is NOT updated");

    //send goodbye message when logout()
    // var goodbye = "Goodbye";
    // this.SendForm(goodbye);
    // console.log("goodbye");

  }

  SendForm(message){
    if (this.appName == 'whatsapp'){ 
      console.log("admin is sending a message: " +message);
      // this.socket.emit('chat message',message);  //from admin to customer
      var obj = { type:"text", path:"null", message: message };
      this.socket.emit('chat message', obj, );  //send json object from admin to customer
      console.log("admin is sending object: " +obj);
      // return false;
    } else if (this.appName == 'nonwhatsapp') {
      console.log("adminNonAndroid is sending a message: " +message);
      // this.socket.emit('chat message',message);  //from admin to customer
      var objNA = { type:"text", path:"null", message: message, sender:this.newUser.room, package: this.newUser.type };
      this.socket.emit('chat message', objNA, this.newUser.type );  //send json object from op to customer
      console.log("adminNonAndroid is sending object: " +objNA + this.newUser.type);

    }

  }

  Connect(socket_id){
    console.log("admin join the room with socket_id: " +socket_id);
     this.socket.emit('connectuser', socket_id);
   
    // return false;
  }

  selectPhoto() {
    console.log('inside select Photo' );
    this.notSelected = false;
    this.url ='';
    
  }


  onFileSelected(event) {    

    // this.compressedFile = event.target.files[0];

    // this.selectedFile = this.compressFile();
    this.selectedFile = event.target.files[0];


    console.log("event.target.files[0]: " +this.selectedFile);
    console.log("onFileSelected name: " +this.selectedFile.name);
    // console.log("event.target.files: " +event.target.files);  //file list

    if (event.target.files && event.target.files[0]) {

      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile); // read file as data url
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

                this.compressedFile = new File([blob], this.selectedFile.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
              }, 'image/jpeg', 1.0);
            }  

            if ((roundedImageSize >= 100) && (roundedImageSize <500))  {

              this.url=ctx.canvas.toDataURL('image/jpeg', 0.7) ;

              console.log (this.url);

              ctx.canvas.toBlob((blob) => {

                this.compressedFile = new File([blob], this.selectedFile.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
              }, 'image/jpeg', 0.7);
            }            

            if ((roundedImageSize >= 500) && (roundedImageSize <5000)){

              this.url=ctx.canvas.toDataURL('image/jpeg', 0.5) ;

              console.log (this.url);

              ctx.canvas.toBlob((blob) => {

                this.compressedFile = new File([blob], this.selectedFile.name, {
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

                this.compressedFile = new File([blob], this.selectedFile.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
              }, 'image/jpeg', 0.2);
            }            

            if (roundedImageSize >= 16000) {
              
              window.alert('Not supported! Image size is too large!');
              this.url = '';
              this.compressedFile = null;

            }

          },
            reader.onerror = error => console.log(error)
        }
    
    }

  } 
 
  SendPhoto(){

    console.log("admin is sending a photo: " +this.url );
    console.log("filename: " +this.selectedFile.name );
    console.log("nickname: " + this.newUser.nickname);
    console.log("room: " + this.newUser.room);
    console.log("socket_id: " + this.newUser.socket_id);
    console.log("message: " + this.msgData.message);
    console.log("flow: " + this.appName);
    console.log("type: " + this.newUser.type);

    var flow = this.appName;
    console.log("appname: " + flow);    


    //save to DB
    this.imgData = {type:this.newUser.type, phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, 
      // message: this.msgData.message, filename: this.selectedFile.name, image:uploadImage }; 
            message: this.msgData.message, filename: this.selectedFile.name, image:this.url }; 

    this.chatService.saveImage(this.imgData).then((result) => {
      console.log('inside saveImage');
      this.socket.emit('save-image', result);
    }, (err) => {
      console.log(err);
    });
    
    if (this.appName == 'whatsapp'){
      // get admin sessionID
      var sID=localStorage.getItem('res.data.sessionID');
      
      //construct form data
      var formDataImage = new FormData();
      formDataImage.append('sessionID', sID);
      formDataImage.append('imagefilename', this.selectedFile.name);
      formDataImage.append('imagefile', this.compressedFile);

      console.log('formDataImage.sessionID: ' +sID);
      console.log('formDataImage.imagefilename: ' +this.selectedFile.name);
      // console.log('formDataImage.imagefile: ' +this.url);  //base64
      
      //post formdata to tinker
      this.chatService.postImage2Node(formDataImage).then((res) => {  //from chatService
        console.log("Image posted to tinker");
      }, (err) => {
        console.log(err);
      });

      //emit socket to android
      // console.log("admin is sending a photo: " +onFileSelected.fileName);
      var jsonMesg = {type:'', path:'', message:''};
      jsonMesg.type = "image";
      jsonMesg.path = "/storage/emulated/0/" +this.selectedFile.name;
      jsonMesg.message = this.msgData.message;
      console.log('jsonMesg.type: ' +jsonMesg.type);
      console.log('jsonMesg.path: ' +jsonMesg.path);
      console.log('jsonMesg.message: ' +jsonMesg.message);
      
      this.socket.emit('chat message', jsonMesg);
      this.notSelected = true;

      } else if (this.appName == 'nonwhatsapp'){

      console.log('skip posting to tinker board');
      var jsonMesgNA = {type:'', path:'', message:'', sender:'', package:''};
      jsonMesgNA.type = "image";
      jsonMesgNA.path = this.selectedFile.name;

      // jsonMesg.message = this.url;
      jsonMesgNA.message = ((this.url).split(",")[1]);
      console.log('jsonMesg.type: ' +jsonMesgNA.type);
      console.log('jsonMesg.path: ' +jsonMesgNA.path);
      console.log('jsonMesg.message: ' +jsonMesgNA.message);

      jsonMesgNA.sender = this.newUser.room;
      jsonMesgNA.package = this.newUser.type;
      
      this.socket.emit('chat message', jsonMesgNA);
      this.notSelected = true;

    }



      // console.log(this.selectedFile.name);
      // this.selectedFile.name = '';
      // console.log(this.selectedFile.name);
    
  }

  CancelPhoto(){
    console.log('clicked cancel Photo' );
    this.notSelected = true;
    
    // console.log(this.selectedFile.name);
    // this.selectedFile.name = null;
    // console.log(this.selectedFile.name);
  }

}
