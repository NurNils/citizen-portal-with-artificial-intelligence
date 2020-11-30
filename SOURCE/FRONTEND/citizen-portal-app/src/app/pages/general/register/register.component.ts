import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponseStatus } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  /** Return url */
  returnUrl: string = this.route.snapshot.queryParams.returnUrl || '/dashboard';

  /** Register form group */
  registerFormGroup: FormGroup = this.formBuilder.group(
    {
      email: [
        null,
        [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(100)],
      ],
      username: [
        null,
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+'),
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      password: [null, Validators.required],
      repeatPassword: [null, Validators.required],
    },
    { validators: this.checkPasswords }
  );

  /** Constructor */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  /**
   * Checks typed passwords for equality
   * @param {FormGroup} group From group to check form controls
   * @returns {boolean}
   * */
  checkPasswords(group: FormGroup) {
    return group.get('password')?.value === group.get('repeatPassword')?.value
      ? null
      : { notSame: true };
  }

  /**
   * Registers user if form group is valid
   * @returns {undefined}
   * */
  async register() {
    if (this.registerFormGroup.valid) {
      const res = await this.authService.register(
        this.registerFormGroup.get('email')?.value,
        this.registerFormGroup.get('username')?.value,
        this.registerFormGroup.get('password')?.value
      );
      if (res.status === IResponseStatus.success) {
        if (res.data) {
          this.snackBarService.openDefaultSnackBar('register-messages.success');
          this.registerFormGroup.reset();
          this.router.navigateByUrl(this.returnUrl).then();
        }
      } else if (res.status === IResponseStatus.error) {
        this.snackBarService.openDefaultSnackBar('register-messages.error');
      }
    }
  }
}
