import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.page.html',
  styleUrls: ['./action-sheet.page.scss'],
})
export class ActionSheetPage implements OnInit {

  result: string;

  constructor(
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash-outline',
          cssClass: 'color-danger',
          handler: () => {
            console.log('Delete clicked');
          },
        },
        {
          text: 'Share',
          icon: 'share-outline',
          handler: () => {
            console.log('Share clicked');
          },
        },
        {
          text: 'Play (open modal)',
          icon: 'caret-forward-circle-outline',
          handler: () => {
            console.log('Play clicked');
          },
        },
        {
          text: 'Favorite',
          icon: 'heart-outline',
          handler: () => {
            console.log('Favorite clicked');
          },
        },
        {
          text: 'Cancel',
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', result);
  }

}
