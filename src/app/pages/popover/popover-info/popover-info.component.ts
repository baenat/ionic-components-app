import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  items: any[] = Array(8);

  constructor(
    private popoverController: PopoverController,
  ) { }

  ngOnInit() { }

  onClick(value: number) {
    console.log(value);
    this.popoverController.dismiss({
      item: value,
    });
  }

}
