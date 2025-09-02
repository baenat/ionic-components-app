import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.page.html',
  styleUrls: ['./segment.page.scss'],
})
export class SegmentPage implements OnInit {

  superHeroes: Observable<any>;
  publisher: string;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.superHeroes = this.dataService.getSuperHeroes()
  }

  segmentChanged(event) {
    console.log(event)
    this.publisher = event.detail.value;
  }

}
