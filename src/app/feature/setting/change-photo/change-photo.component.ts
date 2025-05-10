import { AuthService } from './../../../shared/services/auth/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-photo',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-photo.component.html',
  styleUrl: './change-photo.component.scss',
})
export class ChangePhotoComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isSubmitting = false;
  success: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _ToastrService: ToastrService
  ) {
    this.form = this.fb.group({});
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPhoto() {
    if (!this.selectedFile) {
      this.error = 'Please select a photo.';
      return;
    }
    const formData = new FormData();
    formData.append('photo', this.selectedFile);

    this.isSubmitting = true;
    this.success = null;
    this.error = null;

    this.authService.changePhoto(formData).subscribe({
      next: () => {
        this._ToastrService.success('Photo changed successfully');
        this.success = 'Photo uploaded successfully.';
        this.selectedFile = null;
        this.previewUrl = null;
        this.isSubmitting = true;
      },
      error: (err) => {
        this.error = err.error?.message || 'Upload failed.';
        this._ToastrService.error('Something went wrong');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
