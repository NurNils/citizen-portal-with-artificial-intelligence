import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IResponseStatus } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { environment as env } from 'src/environments/environment.default';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent {
  /** App name */
  appName = env.appName;

  /** General & Sidenav links */
  dashboardLinks = [
    {
      routerLink: ['/dashboard'],
      i18n: 'dashboard',
      icon: 'dashboard',
    },
    {
      routerLink: ['/dashboard/settings'],
      i18n: 'settings',
      icon: 'manage_accounts',
    },
    {
      routerLink: ['/dashboard/training'],
      i18n: 'training',
      icon: 'psychology',
    },
    {
      routerLink: ['/dashboard/article'],
      i18n: 'article',
      icon: 'article',
    },
    /*
    {
      routerLink: ['/dashboard/company'],
      i18n: 'business',
      icon: 'store',
    },
    {
      routerLink: ['/dashboard/service'],
      i18n: 'service',
      icon: 'miscellaneous_services',
    },
    */
  ];

  /** Constructor */
  constructor(
    public router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  /**
   * Gets dashboard links
   * @returns {Array}
   * */
  getDashboardLinks() {
    return this.dashboardLinks;
  }

  /**
   * Gets sidenav mode
   * @returns {string} Sidenav mode 'over' oder 'side'
   * */
  getSidenavMode() {
    return window.innerWidth <= 812 ? 'over' : 'side';
  }

  /**
   * Logouts and redirects the user after successfull logout
   * @returns {undefined}
   * */
  async logout() {
    const res = await this.authService.logout();
    if (res.status === IResponseStatus.success) {
      this.router.navigateByUrl('/login').then();
      this.snackBarService.openSnackbarSuccess('logout-messages.success');
    } else {
      this.snackBarService.openSnackbarError('logout-messages.error');
    }
  }
}
