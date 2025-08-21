import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from "src/app/components/components.module";

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
  imports: [ComponentsModule],
})
export class CardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
