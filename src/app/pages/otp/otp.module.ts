import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpPageRoutingModule } from './otp-routing.module';

import { OtpPage } from './otp.page';
import { OtpBasicComponent } from './otp-basic/otp-basic.component';
import { OtpFormComponent } from './otp-form/otp-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    OtpPage,
    OtpBasicComponent,
    OtpFormComponent
  ]
})
export class OtpPageModule { }
