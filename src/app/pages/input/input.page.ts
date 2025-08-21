import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss'],
})
export class InputPage implements OnInit {

  nombre: string = '';
  isPasswordHidden: boolean = true;

  user = {
    email: '',
    password: ''
  }

  constructor() { }

  ngOnInit() {
  }

  onVisiblePassword() {
    console.log('Toggle password visibility');
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  onSubmit(form: NgForm) {
    console.log('submit');
    console.log(form.value)
  }

}
