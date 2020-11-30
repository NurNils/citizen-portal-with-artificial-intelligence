import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment as env } from '../../../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /** App name */
  appName = env.appName;

  /** General & Sidenav links */
  generalLinks = [
    {
      routerLink: ['/'],
      i18n: 'home',
      icon: 'home',
    },
    {
      routerLink: ['/corona'],
      i18n: 'corona',
      icon: 'coronavirus',
    },
    {
      routerLink: ['/search'],
      i18n: 'search',
      icon: 'search',
    },
  ];

  /** Constructor */
  constructor(public router: Router, private location: Location) {}

  /**
   * Gets general links
   * @returns {Array}
   * */
  getLinksGeneral() {
    return this.generalLinks;
  }

  /**
   * Gets sidenav mode
   * @returns {string} Sidenav mode 'over' oder 'side'
   * */
  getSidenavMode() {
    return window.innerWidth <= 812 ? 'over' : 'side';
  }
}
