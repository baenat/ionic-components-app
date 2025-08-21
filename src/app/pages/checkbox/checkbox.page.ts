import { Component, OnInit } from '@angular/core';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.page.html',
  styleUrls: ['./checkbox.page.scss'],
})
export class CheckboxPage implements OnInit {

  isShowData = false;

  public data = [
    { name: 'primary', isChecked: true },
    { name: 'secondary', isChecked: false },
    { name: 'tertiary', isChecked: false },
    { name: 'success', isChecked: false },
    { name: 'danger', isChecked: false },
    { name: 'light', isChecked: false },
  ];

  constructor() { }

  ngOnInit() {
  }

  onClick = (item: AnyARecord) => {
    console.log(item);
  }

  showData = () => {
    this.isShowData = !this.isShowData;
  }

}
