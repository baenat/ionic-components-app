import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu/menu.service';
import { MenuOpts } from 'src/app/util/interfaces/menu-opts';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isDarkMode: boolean = false;

  private readonly THEME_KEY = 'theme';
  private readonly DARK_THEME = 'dark';
  private readonly LIGHT_THEME = 'light';

  menuOpts: MenuOpts[] = [];

  constructor(
    private menuService: MenuService,
  ) {
    this.isDarkMode = this.getInitialTheme();
    this.applyTheme(this.isDarkMode);
    this.getMenuOpts();
  }

  async getMenuOpts() {
    this.menuOpts = await this.menuService.getMenuOptions()
  }

  ngOnInit() {
    this.listenToSystemThemeChanges();
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return savedTheme
      ? savedTheme === this.DARK_THEME
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleColorTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
  }

  private listenToSystemThemeChanges(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.isDarkMode = e.matches;
        this.applyTheme(this.isDarkMode);
      }
    });
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle(this.DARK_THEME, isDark);
    localStorage.setItem(this.THEME_KEY, isDark ? this.DARK_THEME : this.LIGHT_THEME);
  }

}
