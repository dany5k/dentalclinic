import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-site-status',
  templateUrl: './site-status.component.html',
  styleUrls: ['./site-status.component.css']
})
export class SiteStatusComponent implements OnInit {
  site_info;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
  }

  Info(dato){
    this.site_info = dato;
  }

  OpenSite() {
    this.firebaseService.OpenSite();
  }

}
