import { Component, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/core';

@Component({
  selector: 'app-list-reorder',
  templateUrl: './list-reorder.page.html',
  styleUrls: ['./list-reorder.page.scss'],
})
export class ListReorderPage implements OnInit {

  characters: string[] = [
    "Spider Man",
    "Tony Stark",
    "Captain America",
    "Thor",
    "Black Widow",
    "Hulk",
    "Doctor Strange",
    "Scarlet Witch",
    "Black Panther"
  ];

  isDisabled: boolean = false;

  constructor() { }

  ngOnInit() { }

  doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    const itemMove = this.characters.splice(event.detail.from, 1)[0];
    this.characters.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
    console.log(structuredClone(this.characters));
  }

  toggleReorder() {
    this.isDisabled = !this.isDisabled
  }

}
