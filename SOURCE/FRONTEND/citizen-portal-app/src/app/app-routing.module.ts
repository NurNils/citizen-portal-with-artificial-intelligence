import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GeneralComponent } from './pages/general/general.component';
import { HomeComponent } from './pages/general/home/home.component';
import { CoronaComponent } from './pages/general/corona/corona.component';
import { LegalNoticeComponent } from './pages/general/legal-notice/legal-notice.component';
import { LoginComponent } from './pages/general/login/login.component';
import { PrivacyPolicyComponent } from './pages/general/privacy-policy/privacy-policy.component';
import { SearchComponent } from './pages/general/search/search.component';
import { RegisterComponent } from './pages/general/register/register.component';
import { TermsAndConditionsComponent } from './pages/general/terms-and-conditions/terms-and-conditions.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { TrainingComponent } from './pages/dashboard/training/training.component';
import { ArticleComponent } from './pages/dashboard/article/article.component';
import { CompanyComponent } from './pages/dashboard/company/company.component';
import { ServiceComponent } from './pages/dashboard/service/service.component';
import { PostComponent } from './pages/general/post/post.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'post/:key', component: PostComponent },
      { path: 'corona', component: CoronaComponent },
      { path: 'legal-notice', component: LegalNoticeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'search', component: SearchComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'training', component: TrainingComponent },
      { path: 'article', component: ArticleComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'service', component: ServiceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
