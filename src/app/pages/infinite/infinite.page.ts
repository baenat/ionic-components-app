import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-infinite',
  templateUrl: './infinite.page.html',
  styleUrls: ['./infinite.page.scss'],
})
export class InfinitePage implements OnInit {

  data: any[] = Array(20);

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor() { }

  ngOnInit() {
  }

  loadData(event) {
    console.log('Loading data...');
    setTimeout(() => {
      const newData = Array(20);
      this.data.push(...newData);
      // event.target.complete();
      this.infiniteScroll.complete();

      if (this.data.length >= 50) {
        this.infiniteScroll.disabled = true;
      }
    }, 1500);
  }

  toggleInfiniteScroll() {

  }
}
