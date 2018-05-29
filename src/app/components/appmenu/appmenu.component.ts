import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../authservice.service';

@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.css']
})
export class AppmenuComponent implements OnInit {

  constructor(public authService: AuthserviceService) { }

  ngOnInit() {
  }

}
