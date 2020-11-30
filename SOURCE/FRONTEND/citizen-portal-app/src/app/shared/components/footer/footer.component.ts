import { Component } from '@angular/core';
import { environment as env } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  /** Current full year */
  year = new Date().getFullYear();

  /** App name */
  appName = env.appName;

  /** Company */
  company = env.company;

  /** GitHub name */
  github = env.github;

  /** Twitter name */
  twitter = env.socialMedia.twitter;

  /** Instagram name */
  instagram = env.socialMedia.instagram;

  /** Constructor */
  constructor() {}
}
