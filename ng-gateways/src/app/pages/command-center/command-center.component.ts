import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-command-center',
  templateUrl: './command-center.component.html',
  styleUrls: ['./command-center.component.sass']
})
export class CommandCenterComponent implements OnInit {
  title = 'Gateways';
  
  constructor() { }

  ngOnInit(): void {
  }

}
