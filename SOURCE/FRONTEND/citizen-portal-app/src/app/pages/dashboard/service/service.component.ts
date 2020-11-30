import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Service } from 'src/app/interfaces';
import { ServiceDialogComponent } from 'src/app/shared/dialogs/service-dialog/service-dialog.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent {
  /** Loaded services */
  public services: Service[] = [];

  /** Constructor */
  constructor(private dialog: MatDialog) {}

  /**
   * Opens service dialog
   * @returns {undefined}
   * */
  openServiceDialog() {
    const dialog = this.dialog.open(ServiceDialogComponent, {
      width: '80vw',
      data: null,
    });

    dialog.afterClosed().subscribe(async (result) => {
      if (result) {
        this.services.push(result);
      }
    });
  }
}
