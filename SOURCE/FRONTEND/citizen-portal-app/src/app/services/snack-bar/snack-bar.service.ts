import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment as env } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  /** Constructor */
  constructor(private snackBar: MatSnackBar, private translate: TranslateService) {}

  /**
   * Opens a snack bar with success styling
   * @param {string} translationKey Translation key
   * @param {boolean} [withoutDuration] Optional boolean to show snackbar without duration
   * @returns {undefined}
   * */
  openSnackbarSuccess(translationKey: string, withoutDuration?: boolean) {
    this.openDefaultSnackBar(
      this.translate.instant(translationKey),
      withoutDuration,
      'mat-snackbar-success'
    );
  }

  /**
   * Opens a snack bar with error styling
   * @param {string} translationKey Translation key
   * @param {boolean} [withoutDuration] Optional boolean to show snackbar without duration
   * @returns {undefined}
   * */
  openSnackbarError(translationKey: string, withoutDuration?: boolean) {
    this.openDefaultSnackBar(
      this.translate.instant(translationKey),
      withoutDuration,
      'mat-snackbar-error'
    );
  }

  /**
   * Opens a snack bar with default style and settings
   * @param {string} translationKey Translation key
   * @param {boolean} [withoutDuration] Optional boolean to show snackbar without duration
   * @param {string} [pannelClass] Optional panel class to add styling etc.
   * @returns {undefined}
   * */
  openDefaultSnackBar(translationKey: string, withoutDuration?: boolean, pannelClass?: string) {
    this.openSnackBar(
      this.translate.instant(translationKey),
      withoutDuration ? 0 : env.snackBar.duration,
      pannelClass
    );
  }

  /**
   * Open a full editable snackbar
   * @param {string} translationKey Translation key
   * @param {number} duration Time to show snackbar in ms
   * @param {string} [pannelClass] Optional panel class to add styling etc.
   * @returns {undefined}
   * */
  openSnackBar(translation: string, duration: number, pannelClass?: string) {
    this.translate.get('ok').subscribe((ok: string) => {
      this.snackBar.open(translation, ok, {
        duration,
        panelClass: [pannelClass ? pannelClass : ''],
      });
    });
  }
}
