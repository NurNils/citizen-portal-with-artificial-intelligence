import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { translateLoaderFactory } from './shared/utils/translate-loader/translate-loader.util';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeDe);

import { MarkdownModule } from 'ngx-markdown';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GeneralComponent } from './pages/general/general.component';
import { HomeComponent } from './pages/general/home/home.component';
import { CoronaComponent } from './pages/general/corona/corona.component';
import { LegalNoticeComponent } from './pages/general/legal-notice/legal-notice.component';
import { LoginComponent } from './pages/general/login/login.component';
import { PrivacyPolicyComponent } from './pages/general/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './pages/general/register/register.component';
import { SearchComponent } from './pages/general/search/search.component';
import { TermsAndConditionsComponent } from './pages/general/terms-and-conditions/terms-and-conditions.component';

import { CardWrapperComponent } from './shared/components/card-wrapper/card-wrapper.component';
import { FeatureExampleComponent } from './shared/components/feature-example/feature-example.component';
import { FeatureGroupComponent } from './shared/components/feature-group/feature-group.component';
import { FeatureRowComponent } from './shared/components/feature-row/feature-row.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LanguageWrapperComponent } from './shared/components/language-wrapper/language-wrapper.component';
import { ScrolltopComponent } from './shared/components/scrolltop/scrolltop.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';

import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { LoadingInterceptor } from './interceptors/loading/loading.interceptor';

import { PreviewComponent } from './shared/components/preview/preview.component';
import { TrainingComponent } from './pages/dashboard/training/training.component';
import { DashboardHeaderComponent } from './shared/components/dashboard-header/dashboard-header.component';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ArticleComponent } from './pages/dashboard/article/article.component';
import { ArticleDialogComponent } from './shared/dialogs/article-dialog/article-dialog.component';
import { TranslateItemDialogComponent } from './shared/dialogs/translate-item-dialog/translate-item-dialog.component';
import { CompanyDialogComponent } from './shared/dialogs/company-dialog/company-dialog.component';
import { CompanyComponent } from './pages/dashboard/company/company.component';
import { ServiceComponent } from './pages/dashboard/service/service.component';
import { ServiceDialogComponent } from './shared/dialogs/service-dialog/service-dialog.component';
import { ImageGalleryDialogComponent } from './shared/dialogs/image-gallery-dialog/image-gallery-dialog.component';
import { PostComponent } from './pages/general/post/post.component';

@NgModule({
  declarations: [
    AppComponent,

    // Pages: General
    GeneralComponent,
    HomeComponent,
    CoronaComponent,
    LegalNoticeComponent,
    LoginComponent,
    PostComponent,
    PrivacyPolicyComponent,
    RegisterComponent,
    SearchComponent,
    TermsAndConditionsComponent,

    // Pages: Dashboard
    DashboardComponent,
    ArticleComponent,
    CompanyComponent,
    ProfileComponent,
    ServiceComponent,
    SettingsComponent,
    TrainingComponent,

    // Shared Components
    CardWrapperComponent,
    DashboardHeaderComponent,
    FeatureExampleComponent,
    FeatureGroupComponent,
    FeatureRowComponent,
    FooterComponent,
    HeaderComponent,
    LanguageWrapperComponent,
    LoadingComponent,
    PreviewComponent,
    ScrolltopComponent,

    // Shared Dialogs
    ArticleDialogComponent,
    CompanyDialogComponent,
    ImageGalleryDialogComponent,
    ServiceDialogComponent,
    TranslateItemDialogComponent,    
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, deps: [HttpClient], useFactory: translateLoaderFactory },
    }),
    MarkdownModule.forRoot(),

    // Angular Material Modules
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'de-DE' }, // Sets locale to Germany of application
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
