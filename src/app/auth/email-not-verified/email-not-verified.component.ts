import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-email-not-verified',
  templateUrl: './email-not-verified.component.html',
  styleUrls: ['./email-not-verified.component.css']
})
export class EmailNotVerifiedComponent {

  EMAIL = "YOUR_EMAIL";

  constructor(public userService: UserService) { }


}
