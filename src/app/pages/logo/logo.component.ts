import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service'; // For retrieving user online status

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {
  info = "Atencion: Este es un Trabajo Práctico !";

  @Output() advice: EventEmitter<any> = new EventEmitter();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.advice.emit(this.info); //Output
  }

  sonar() {
    var audio = new Audio("/assets/imagenes/riza.mp3")
    audio.play();
  }

}
