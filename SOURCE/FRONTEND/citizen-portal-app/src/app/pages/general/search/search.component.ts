import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Article, IResponseStatus } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  /** Search form group */
  searchFormGroup: FormGroup = this.formBuilder.group({
    search: [null, [Validators.required]],
  });

  /** Loaded articles */
  articles: Article[] | null = null;

  /** Quicklinks (maximum 8) */
  quicklinks: string[] = [
    'preferred-license-plate',
    'quick-tests',
    'corona-vaccination',
    'waste-management',
    'visit-invitation',
    'instruction-food',
    'contact-options',
    'opening-hours',
  ];

  /** Constructor */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
    activatedRoute.params.subscribe((val) => {
      activatedRoute.queryParams.subscribe((params) => {
        this.loadData(params);
      });
    });
  }

  /**
   * Searches for articles depends on the specified search term
   * @returns {undefined}
   * */
  search() {
    if (this.searchFormGroup.valid)
      this.navigateBySearchLink(this.searchFormGroup.get('search')?.value, false);
  }

  /**
   * Navigates by search link
   * @param {string} search Search term or translation key
   * @param {boolean} translate If true, search term is translation key and must be translated
   * @returns {undefined}
   * */
  navigateBySearchLink(search: string, translate: boolean) {
    const term = translate ? this.translateService.instant(`quicklinks.${search}`) : search;
    this.router.navigateByUrl(`/search?search=${term}&lang=${this.translateService.currentLang}`);
  }

  /**
   * Loads search data
   * @param {any} params Used parameters for search
   * @returns {undefined}
   * */
  async loadData(params: any) {
    if (params?.search) {
      this.searchFormGroup.get('search')?.patchValue(params.search);
      const res = await this.apiService.get(`search`, params);
      if (res.status === IResponseStatus.success) {
        console.log('data', res.data);
        this.articles = res.data.article as Article[];
      }
    }
  }
}
