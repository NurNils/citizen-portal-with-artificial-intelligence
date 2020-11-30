import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { IResponseStatus, User, UserRank } from '../../../interfaces';
import { SnackBarService } from '../../../services/snack-bar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  /** Return url */
  returnUrl: string = this.route.snapshot.queryParams.returnUrl || '/dashboard';

  /** Login form group */
  loginFormGroup: FormGroup = this.formBuilder.group({
    usernameOrEmail: [
      null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    password: [null, Validators.required],
  });

  /** Constructor */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  /**
   * Logins the user if the form data is valid
   * @returns {undefined}
   * */
  async login() {
    if (this.loginFormGroup?.valid) {
      const res = await this.authService.login(
        this.loginFormGroup.get('usernameOrEmail')?.value,
        this.loginFormGroup.get('password')?.value
      );
      if (res.status === IResponseStatus.success) {
        if (res.data) {
          this.snackBarService.openSnackbarSuccess('login-messages.success');
          this.loginFormGroup.reset();
          this.router.navigateByUrl(this.returnUrl).then();
        }
      }
    }
  }
}
