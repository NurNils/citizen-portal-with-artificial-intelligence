import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResponseStatus, User } from 'src/app/interfaces';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  /** Loaded user */
  public user: User | any;

  /** Username form group */
  usernameFormGroup: FormGroup = this.formBuilder.group({
    username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    password: [null, Validators.required],
  });

  /** Email form group */
  emailFormGroup: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    password: [null, Validators.required],
  });

  /** Password form group */
  passwordFormGroup: FormGroup = this.formBuilder.group({
    password1: [null, Validators.required],
    password2: [null, Validators.required],
  });

  /** Constructor */
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService
  ) {}

  /**
   * Loads settings of the user
   * @returns {undefined}
   * */
  async ngOnInit() {
    const res = await this.apiService.get('user');
    if (res.status === IResponseStatus.success) {
      this.user = res.data;
    }
  }

  /**
   * Changes username of the user if the form data is valid
   * @returns {undefined}
   * */
  async changeUsername() {
    if (this.usernameFormGroup?.valid) {
      const res = await this.apiService.put('user', {
        username: this.usernameFormGroup.get('username')?.value,
        password: this.usernameFormGroup.get('password')?.value,
      });
      if (res.status === IResponseStatus.success) {
        if (res.data) {
          this.snackBarService.openSnackbarSuccess('settings-messages.success');
          this.usernameFormGroup.reset();
        }
      }
    }
  }

  /**
   * Changes email of the user if the form data is valid
   * @returns {undefined}
   * */
  async changeEmail() {
    if (this.emailFormGroup?.valid) {
      const res = await this.apiService.put('user', {
        email: this.emailFormGroup.get('email')?.value,
        password: this.emailFormGroup.get('password')?.value,
      });
      if (res.status === IResponseStatus.success) {
        if (res.data) {
          this.snackBarService.openSnackbarSuccess('settings-messages.success');
          this.emailFormGroup.reset();
        }
      }
    }
  }

  /**
   * Changes password of the user if the form data is valid
   * @returns {undefined}
   * */
  async changePassword() {
    if (this.passwordFormGroup?.valid) {
      const res = await this.apiService.put('user', {
        password1: this.passwordFormGroup.get('password1')?.value,
        password2: this.passwordFormGroup.get('password2')?.value,
      });
      if (res.status === IResponseStatus.success) {
        if (res.data) {
          this.snackBarService.openSnackbarSuccess('settings-messages.success');
          this.passwordFormGroup.reset();
        }
      }
    }
  }
}
