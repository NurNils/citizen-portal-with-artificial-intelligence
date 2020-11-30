import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  /** Check if loading */
  public loading: boolean | any;

  /** Constructor */
  constructor(private loadingService: LoadingService) {
    this.loadingService.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }
}
