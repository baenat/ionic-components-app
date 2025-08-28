import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {

  porcentage: number = 0.02;

  constructor() { }

  ngOnInit() {
  }

  rangeChange(event: any) {
    const { value } = event.detail;
    this.porcentage = value / 100;
    console.log(this.porcentage)
  }

}
