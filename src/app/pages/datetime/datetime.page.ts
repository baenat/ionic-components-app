import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.page.html',
  styleUrls: ['./datetime.page.scss'],
})
export class DatetimePage implements OnInit {

  fecNacimiento: Date = new Date();
  customYearValues = [1997, 1998, 1999, 2000, 2025];
  customPickerOptions = {
    buttons: [
      {
        text: 'Save',
        handler: (event) => {
          console.log('Clicked Save', event);
        }
      },
      {
        text: 'Log',
        handler: (event) => {
          console.log('Clicked Log', event);
        }
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

  changeDate = (date: any) => {
    console.log(date);
    console.log(new Date(date.detail.value));
  }

}
