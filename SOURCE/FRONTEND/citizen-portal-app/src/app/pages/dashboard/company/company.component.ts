import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Company, IResponseStatus } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { CompanyDialogComponent } from 'src/app/shared/dialogs/company-dialog/company-dialog.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent {
  /** Loaded companies */
  public companies: Company[] = [];

  /** Constructor */
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private translate: TranslateService
  ) {
    this.loadCompanyData();
  }

  /**
   * Opens company dialog
   * @returns {undefined}
   * */
  openCompanyDialog() {
    const dialog = this.dialog.open(CompanyDialogComponent, {
      width: '80vw',
      data: null,
    });

    dialog.afterClosed().subscribe(async (result) => {
      if (result) {
        this.companies.push(result);
      }
    });
  }

  /**
   * Loads all company data
   * @returns {undefined}
   * */
  async loadCompanyData() {
    const res = await this.apiService.get('company');
    if (res.status === IResponseStatus.success) {
      this.companies = res.data.companies as Company[];
    }
  }

  /**
   * Opens company dialog to edit the specified company
   * @param {Company} company Company to edit
   * @returns {undefined}
   * */
  async editCompany(company: Company) {
    const res = await this.apiService.get(`company/${company._id}`);
    if (res.status === IResponseStatus.success) {
      const dialog = this.dialog.open(CompanyDialogComponent, {
        width: '1000px',
        data: res.data.company,
      });

      dialog.afterClosed().subscribe(async (result) => {
        if (result) {
          this.companies[this.companies.indexOf(company)] = result;
        }
      });
    } else {
      this.snackBarService.openDefaultSnackBar('company-messages.not-found');
    }
  }

  /**
   * Duplicates company
   * @param {Company} company Company to duplicate
   * @returns {undefined}
   * */
  async duplicateCompany(company: Company) {
    const res = await this.apiService.get(`company/${company._id}/duplicate`);
    if (res.status === IResponseStatus.success) {
      this.snackBarService.openSnackbarSuccess('company-messages.duplicated');
      this.companies.push(res.data.company);
    } else {
      this.snackBarService.openSnackbarError('company-messages.not-found');
    }
  }

  /**
   * Deletes company
   * @param {Company} company Company to delete
   * @returns {undefined}
   * */
  async deleteCompany(company: Company) {
    if (confirm(this.translate.instant('company.delete-confirm'))) {
      const res = await this.apiService.delete(`company/${company._id}`);
      if (res.status === IResponseStatus.success) {
        this.snackBarService.openSnackbarSuccess('company-messages.deleted');
        this.companies.splice(this.companies.indexOf(company), 1);
      } else {
        this.snackBarService.openSnackbarError('company-messages.not-found');
      }
    }
  }
}
