import { Injectable } from '@angular/core';
import { GeneralService } from '../general/general.service';
import { MenuOpts } from 'src/app/util/interfaces/menu-opts';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = 'assets/data/menu-opts.json';

  constructor(
    private generalService: GeneralService,
  ) { }

  getMenuOptions(): Promise<MenuOpts[]> {
    return this.generalService.get<MenuOpts[]>(this.baseUrl).toPromise();
  }
}
