import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpPage } from './otp.page';
import { OtpBasicComponent } from './otp-basic/otp-basic.component';
import { OtpFormComponent } from './otp-form/otp-form.component';

const routes: Routes = [
  {
    path: '',
    component: OtpPage,
  },
  {
    path: 'basic',
    component: OtpBasicComponent
  },
  {
    path: 'form',
    component: OtpFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpPageRoutingModule { }
