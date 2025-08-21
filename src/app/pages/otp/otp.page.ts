import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInput, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit, OnDestroy {

  otpRoutes = [
    {
      name: 'OTP Básico',
      icon: 'key',
      redirectTo: '/otp/basic'
    },
    {
      name: 'OTP Formulario',
      icon: 'document-text',
      redirectTo: '/otp/form'
    }
  ];

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() { }

}