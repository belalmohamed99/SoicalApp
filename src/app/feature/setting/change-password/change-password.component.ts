import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _ToastrService: ToastrService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  submit() {
    const { oldPassword, newPassword, confirmPassword } =
      this.passwordForm.value;

    if (this.passwordForm.invalid || newPassword !== confirmPassword) {
      this.error = 'Passwords do not match or fields are empty.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.success = null;

    const payload = {
      password: oldPassword,
      newPassword: newPassword,
    };

    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this._ToastrService.success('Password changed successfully');
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Something went wrong.';
        this._ToastrService.error('Something went wrong');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
