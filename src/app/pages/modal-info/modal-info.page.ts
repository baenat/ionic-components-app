import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {

  @Input() name: string;
  @Input() country: string;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  leaveWithoutArgs() {
    this.modalController.dismiss();
  }

  leaveWithArgs() {
    this.modalController.dismiss({
      name: 'Steven',
      country: 'Suiza'
    });
  }

}
