import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Article, IResponseStatus } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';
import { ImageService } from 'src/app/services/image/image.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { TranslateItemService } from 'src/app/services/translate-item/translate-item.service';

@Component({
  selector: 'app-article-dialog',
  templateUrl: './article-dialog.component.html',
  styleUrls: ['./article-dialog.component.scss'],
})
export class ArticleDialogComponent implements OnInit {
  /** Article form group */
  articleFormGroup: FormGroup | null = null;

  /** List of available categories */
  categoryList: string[] = ['corona', 'kfz'];

  /** Constructor */
  constructor(
    public dialogRef: MatDialogRef<ArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Article,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private apiService: ApiService,
    public translateItemService: TranslateItemService,
    private snackBarService: SnackBarService,
    public imageService: ImageService
  ) {}

  /**
   * Initializes form group
   * @returns {undefined}
   * */
  async ngOnInit() {
    if (this.data) {
      this.articleFormGroup = this.formBuilder.group({
        activated: [this.data.activated, Validators.required],
        key: [
          this.data.key,
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(50),
            Validators.pattern('[^/ ]+'),
          ],
        ],
        title: [this.data.title, Validators.required],
        description: [this.data.description, Validators.required],
        thumbnail: [this.data.thumbnail, Validators.required],
        categories: [this.data.categories, Validators.required],
      });
    } else {
      this.articleFormGroup = this.formBuilder.group({
        activated: [true, Validators.required],
        key: [
          null,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(50),
            Validators.pattern('[^/ ]+'),
          ],
        ],
        title: [{ de: 'Titel', en: 'Title' }, Validators.required],
        description: [{ de: 'Beschreibung...', en: 'Beschreibung...' }, Validators.required],
        thumbnail: [null, Validators.required],
        categories: [null, Validators.required],
      });
    }
  }

  /**
   * Saves or updates data depends on initial dialog data
   * @returns {undefined}
   * */
  async save() {
    const article: Article = {
      activated: this.articleFormGroup?.get('activated')?.value,
      key: this.articleFormGroup?.get('key')?.value,
      title: this.articleFormGroup?.get('title')?.value,
      description: this.articleFormGroup?.get('description')?.value,
      thumbnail: this.articleFormGroup?.get('thumbnail')?.value,
      categories: this.articleFormGroup?.get('categories')?.value,
    };
    if (this.data) {
      const res = await this.apiService.put(`article/${this.data._id}`, article);
      if (res.status === IResponseStatus.success) {
        this.snackBarService.openSnackbarSuccess('article-messages.edited');
        this.dialogRef.close(res.data.article);
      }
    } else {
      const res = await this.apiService.post(`article`, article);
      if (res.status === IResponseStatus.success) {
        this.snackBarService.openSnackbarSuccess('article-messages.created');
        this.dialogRef.close(res.data.article);
      }
    }
  }
}
