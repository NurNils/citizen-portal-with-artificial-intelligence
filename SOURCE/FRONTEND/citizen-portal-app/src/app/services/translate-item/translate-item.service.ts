import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateItemDialogComponent } from '../../shared/dialogs/translate-item-dialog/translate-item-dialog.component';
import { FormGroup } from '@angular/forms';
import { TranslateItem } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TranslateItemService {
  /** Constructor */
  constructor(public dialog: MatDialog) {}

  /**
   * Opens translate item dialog
   * @param {FormGroup} formGroup Form group to get form control value
   * @param {string} formControlName The actual form control name
   * @param {boolean} [markdown] Form control value can be with markdown or not
   * @returns {undefined}
   * */
  async openTranslateItemDialog(formGroup: FormGroup, formControlName: string, markdown?: boolean) {
    const dialog = this.dialog.open(TranslateItemDialogComponent, {
      width: '870px',
      data: { translateItem: formGroup.get(formControlName)?.value, markdown },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        formGroup.get(formControlName)?.patchValue(result);
      }
    });
  }

  /**
   * Gets button style for translation
   * @param {FormGroup} formGroup Form group to get form control value
   * @param {string} formControlName The actual form control name
   * @returns {Object} Object includes the color as string (e.q. { color: 'red' })
   * */
  getButtonStyle(formGroup: FormGroup, formControlName: string) {
    const translateItem: TranslateItem = formGroup.get(formControlName)?.value;
    let color = 'red';
    if (
      translateItem.cn &&
      translateItem.de &&
      translateItem.en &&
      translateItem.es &&
      translateItem.fr &&
      translateItem.it &&
      translateItem.jp &&
      translateItem.nl &&
      translateItem.pl &&
      translateItem.pt &&
      translateItem.ru
    ) {
      color = 'green';
    } else if (translateItem.de && translateItem.en) {
      color = 'orange';
    }
    return { color };
  }
}
