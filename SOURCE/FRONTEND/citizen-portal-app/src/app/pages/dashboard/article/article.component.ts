import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Article, IResponseStatus } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { ArticleDialogComponent } from 'src/app/shared/dialogs/article-dialog/article-dialog.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  /** Loaded articles */
  public articles: Article[] = [];

  /** Constructor */
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private translate: TranslateService
  ) {
    this.loadArticleData();
  }

  /**
   * Opens article dialog
   * @returns {undefined}
   * */
  openArticleDialog() {
    const dialog = this.dialog.open(ArticleDialogComponent, {
      width: '80vw',
      data: null,
    });

    dialog.afterClosed().subscribe(async (result) => {
      if (result) {
        this.articles.push(result);
      }
    });
  }

  /**
   * Loads all article data
   * @returns {undefined}
   * */
  async loadArticleData() {
    const res = await this.apiService.get('article');
    if (res.status === IResponseStatus.success) {
      this.articles = res.data.article as Article[];
    }
  }

  /**
   * Opens article dialog to edit the specified article
   * @param {Article} article Article to edit
   * @returns {undefined}
   * */
  async editArticle(article: Article) {
    const res = await this.apiService.get(`article/${article._id}`);
    if (res.status === IResponseStatus.success) {
      const dialog = this.dialog.open(ArticleDialogComponent, {
        width: '1000px',
        data: res.data.article,
      });

      dialog.afterClosed().subscribe(async (result) => {
        if (result) {
          this.articles[this.articles.indexOf(article)] = result;
        }
      });
    } else {
      this.snackBarService.openDefaultSnackBar('article-messages.not-found');
    }
  }

  /**
   * Duplicates article
   * @param {Article} article Article to duplicate
   * @returns {undefined}
   * */
  async duplicateArticle(article: Article) {
    const res = await this.apiService.get(`article/${article._id}/duplicate`);
    if (res.status === IResponseStatus.success) {
      this.snackBarService.openSnackbarSuccess('article-messages.duplicated');
      this.articles.push(res.data.article);
    } else {
      this.snackBarService.openSnackbarError('article-messages.not-found');
    }
  }

  /**
   * Deleted article
   * @param {Article} article Article to delete
   * @returns {undefined}
   * */
  async deleteArticle(article: Article) {
    if (confirm(this.translate.instant('article.delete-confirm'))) {
      const res = await this.apiService.delete(`article/${article._id}`);
      if (res.status === IResponseStatus.success) {
        this.snackBarService.openSnackbarSuccess('article-messages.deleted');
        this.articles.splice(this.articles.indexOf(article), 1);
      } else {
        this.snackBarService.openSnackbarError('article-messages.not-found');
      }
    }
  }
}
