import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  albumes: any[] = [];
  textSearch: string;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.getAlbumes().subscribe(albumes => {
      this.albumes = albumes
    });
  }

  onSearchChange(event) {
    this.textSearch = event.detail.value;
  }

}
