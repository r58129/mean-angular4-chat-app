import { Component, OnInit, Output, EventEmitter,HostListener } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-history-search',
  templateUrl: './history-search.component.html',
  styleUrls: ['./history-search.component.css']
})
export class HistorySearchComponent implements OnInit {

  contacts: any;  //contacts
  searchName: any;
  notSearch: boolean = true;
  searchUser:any;
  userInfo = {id:'', name:'', package:'' };

  constructor(private chatService: ChatService) {}

  @HostListener('click')
  clickedCopy(searchUser) {

    if (searchUser !=undefined){

    console.log('this.searchUser.id: ' +searchUser.id);
    console.log('this.searchUser.package: ' + searchUser.package);

    this.chatService.copyInfo(searchUser);
    }
  }

  ngOnInit() {
  }

  returnToTable(){
    this.notSearch = true;
    console.log("return to table view");
  }

  search(){
  this.notSearch = false;
  console.log("searching: " + this.searchName);

    if ((this.searchName == undefined) || (this.searchName == "")){
      this.chatService.getAllContact().then((res) => {  //from chatService, 
        this.contacts = res;
      }, (err) => {
        console.log(err);
      });

    } else {

    this.chatService.getContactByName(this.searchName).then((res) => {  //from chatService, 
        this.contacts = res;
      }, (err) => {
        console.log(err);
      });
    }
  }

}
