import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IResponseStatus, Training } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent {
  /** Displayed columns */
  public displayedColumns: string[] = ['_id', 'category', 'search', 'userId', 'trained'];

  /** Datasource for Table */
  // @ts-ignore
  public dataSource: MatTableDataSource<Training>;

  /** MatPaginator ViewChild */
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  /** MatSort ViewChild */
  @ViewChild(MatSort) sort: MatSort | null = null;

  /** Overview training */
  public overview = {
    total: 0,
    categories: ['corona', 'kfz'],
  };

  /** Training form group */
  trainingFormGroup: FormGroup = this.formBuilder.group({
    category: ['corona', [Validators.required]],
    search: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
  });

  /** Constructor */
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService
  ) {
    this.loadTrainingData();
  }

  /**
   * Loads training data
   * @returns {undefined}
   * */
  async loadTrainingData() {
    const res = await this.apiService.get('training');
    if (res.status === IResponseStatus.success) {
      this.overview = res.data.overview;
      this.dataSource = new MatTableDataSource(res.data.training as Training[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Submits training data to backend
   * @returns {undefined}
   * */
  async submitTraining() {
    if (this.trainingFormGroup.valid) {
      const res = await this.apiService.post('training', {
        category: this.trainingFormGroup.get('category')?.value,
        search: this.trainingFormGroup.get('search')?.value,
      });

      if (res.status === IResponseStatus.success) {
        this.snackBarService.openSnackbarSuccess('training-messages.success');
        this.dataSource.data.push(res.data as Training);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.overview.total++;
      }
    }
  }
}
