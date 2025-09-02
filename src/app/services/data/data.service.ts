import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers() {
    return this.http.get(`https://jsonplaceholder.typicode.com/users`);
  }

  getAlbumes() {
    return this.http.get<any[]>(`https://jsonplaceholder.typicode.com/albums`);
  }

  getSuperHeroes() {
    return this.http.get<any[]>(`assets/data/superheroes.json`).pipe(delay(2500));
  }
}
