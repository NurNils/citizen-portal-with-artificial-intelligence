import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, IResponseStatus } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  /** Loaded article */
  article: Article | null = null;

  /** Constructor */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    route.params.subscribe((val) => {
      const key = this.route.snapshot.paramMap.get('key');
      this.loadArticle(key);
    });
  }

  /**
   * Loads article data by key
   * @param {string|null} key Unique article name
   * @returns {undefined}
   * */
  async loadArticle(key: string | null) {
    if (key) {
      const res = await this.apiService.get(`article/${key}/key`);
      if (res.status === IResponseStatus.success) {
        this.article = res.data.article;
      } else {
        this.router.navigateByUrl('/');
      }
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
