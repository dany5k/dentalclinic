import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public user:UserService, private router: Router) { }

  ngOnInit(): void {
    
  }

  /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
  myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  Logout() {
    console.clear();
    
    this.user.killAllRights(); // Removing all rights
    this.router.navigate(['/home']);
  }

}
