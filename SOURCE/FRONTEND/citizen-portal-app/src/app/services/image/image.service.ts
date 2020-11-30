import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ImageGalleryDialogComponent } from '../../shared/dialogs/image-gallery-dialog/image-gallery-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  /** Constructor */
  constructor(public dialog: MatDialog) {}

  /**
   * Opens image gallery
   * @param {FormGroup} formGroup Form group to get form control value
   * @param {string} formControlName The actual form control name
   * @param {boolean} multiple Set if only one or multiple images can be selected
   * @returns {undefined}
   * */
  async openImageGalleryDialog(formGroup: FormGroup, formControlName: string, multiple: boolean) {
    const dialog = this.dialog.open(ImageGalleryDialogComponent, {
      width: '870px',
      data: {
        images: formGroup.get(formControlName)?.value,
        multiple,
      },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        formGroup.get(formControlName)?.patchValue(result);
      }
    });
  }
}
