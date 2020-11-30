import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  /** Data */
  public data = {
    trainings: {
      total: 1000,
      own: 10,
    },
    articles: {
      total: 1000,
      own: 10,
    },
    companies: {
      total: 1000,
      own: 10,
    },
    services: {
      total: 1000,
      own: 10,
    },
  };

  /** Constructor */
  constructor(private apiService: ApiService) {
    this.loadData();
  }

  /**
   * Loads a complete overview of all data
   * @returns {undefined}
   * */
  async loadData() {
    // TODO: Load overview
    // const res = await this.apiService.get('');
  }
}
