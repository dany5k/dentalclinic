import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css']
})
export class AdviceComponent implements OnInit {

  @Input() siteinfo;

  constructor() { }

  ngOnInit(): void {
  }

}
