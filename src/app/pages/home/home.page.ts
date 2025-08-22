import { Component, OnInit } from '@angular/core';

interface OptionsItems {
  icon: string;
  name: string;
  redirectTo: string;
}

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

  componentes: OptionsItems[] = [
    {
      icon: 'copy-outline',
      name: 'Action Sheet',
      redirectTo: '/action-sheet'
    },
    {
      icon: 'notifications-outline',
      name: 'Alert',
      redirectTo: '/alert'
    },
    {
      icon: 'person-circle-outline',
      name: 'Avatar',
      redirectTo: '/avatar'
    },
    {
      icon: 'albums-outline',
      name: 'Button',
      redirectTo: '/button'
    },
    {
      icon: 'card-outline',
      name: 'Cards',
      redirectTo: '/card'
    },
    {
      icon: 'checkmark-circle-outline',
      name: 'Checkbox',
      redirectTo: '/checkbox'
    },
    {
      icon: 'calendar-outline',
      name: 'Datetime',
      redirectTo: '/datetime'
    },
    {
      icon: 'nuclear-outline',
      name: 'Fabs',
      redirectTo: '/fab'
    },
    {
      icon: 'grid-outline',
      name: 'Grid',
      redirectTo: '/grid'
    },
    {
      icon: 'infinite-outline',
      name: 'Infinite Scroll',
      redirectTo: '/infinite'
    },
    {
      icon: 'hammer-outline',
      name: 'Input',
      redirectTo: '/input'
    },
    {
      icon: 'body-outline',
      name: 'Verificación OTP',
      redirectTo: '/otp'
    },
    {
      icon: 'list-outline',
      name: 'List - Sliding',
      redirectTo: '/list'
    },
    {
      icon: 'reorder-three-outline',
      name: 'List - Reorder',
      redirectTo: '/list-reorder'
    },
    {
      icon: 'refresh-circle-outline',
      name: 'Loading',
      redirectTo: '/loading'
    }
  ];

  constructor() {
    this.isDarkMode = this.getInitialTheme();
    this.applyTheme(this.isDarkMode);
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
