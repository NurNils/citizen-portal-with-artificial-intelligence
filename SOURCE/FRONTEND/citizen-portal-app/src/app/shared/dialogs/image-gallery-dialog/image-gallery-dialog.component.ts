import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../services/api/api.service';
import { SnackBarService } from '../../../services/snack-bar/snack-bar.service';
import { IResponseStatus, File } from '../../../interfaces';
import { environment as env } from '../../../../environments/environment';

@Component({
  selector: 'app-image-gallery-dialog',
  templateUrl: './image-gallery-dialog.component.html',
  styleUrls: ['./image-gallery-dialog.component.scss'],
})
export class ImageGalleryDialogComponent implements OnInit {
  /** Accept files */
  acceptedFiles = env.fileTypes.image;

  /** Upload file form group */
  uploadFileFormGroup: FormGroup | null = null;

  /** Images */
  images: File[] = [];

  /** Selected images */
  selectedImages: string[] = [];

  /** Constructor */
  constructor(
    public dialogRef: MatDialogRef<ImageGalleryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { images: string[] | string; multiple: boolean },
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBarService: SnackBarService
  ) {
    if (data.multiple) {
      this.selectedImages = [...data.images] as string[];
    } else {
      this.selectedImages = [data.images] as string[];
    }
  }

  /**
   * Initalizes form groups and loads images from database
   * @returns {undefined}
   * */
  async ngOnInit() {
    this.uploadFileFormGroup = this.formBuilder.group({
      base64: [null, Validators.required],
      name: [null, Validators.required],
      size: [null, [Validators.required, Validators.max(env.fileTypes.maxSize)]],
      type: [null, Validators.required],
    });

    const res = await this.apiService.get('image');
    if (res.status === IResponseStatus.success) {
      this.images = res.data.images as File[];
    }
  }

  /**
   * Handles file change event
   * @param {any} event Triggered event
   * @returns {undefined}
   * */
  handleFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (onLoad: any) => {
        this.uploadFileFormGroup?.get('base64')?.setValue(onLoad.target.result);
      };
      this.uploadFileFormGroup?.get('name')?.setValue(event.target.files[0].name);
      this.uploadFileFormGroup?.get('size')?.setValue(event.target.files[0].size);
      this.uploadFileFormGroup?.get('type')?.setValue(event.target.files[0].type);
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Upload file
   * @returns {undefined}
   * */
  async uploadFile() {
    if (this.uploadFileFormGroup?.valid) {
      const data = {
        base64: this.uploadFileFormGroup.get('base64')?.value,
        name: this.uploadFileFormGroup.get('name')?.value,
        size: this.uploadFileFormGroup.get('size')?.value,
        type: this.uploadFileFormGroup.get('type')?.value,
      };
      const res = await this.apiService.post(`image`, data);
      if (res.status === IResponseStatus.success) {
        this.images.push(res.data as File);
        this.snackBarService.openDefaultSnackBar('image-gallery.uploaded');
        this.uploadFileFormGroup.reset();
      }
    }
  }

  /**
   * Deletes uploaded file
   * @param {File} file File to delete
   * @returns {undefined}
   * */
  async deleteUploadedFile(file: File) {
    const res = await this.apiService.delete(`image/${file._id}`);
    if (res.status === IResponseStatus.success) {
      this.images.splice(this.images.indexOf(file), 1);
      if (this.selectedImages.includes(this.getUploadedFileSrc(file._id))) {
        this.selectedImages.splice(
          this.selectedImages.indexOf(this.getUploadedFileSrc(file._id)),
          1
        );
      }
      this.snackBarService.openDefaultSnackBar('image-gallery.deleted');
    }
  }

  /**
   * Gets uploaded file src
   * @param {string} id Unique id of file
   * @returns {string} File source URL
   * */
  getUploadedFileSrc(id: string) {
    return `${env.api.baseUrl}image/${id}`;
  }

  /**
   * Checks if image is selected
   * @param {string} image Image source URL
   * @returns {boolean}
   * */
  isSelected(image: string) {
    return this.selectedImages.includes(image);
  }

  /**
   * Selects defined image src
   * @param {string} src Image source URL
   * @returns {undefined}
   * */
  selectImage(src: string) {
    if (this.data.multiple) {
      this.selectedImages.push(src);
    } else {
      this.selectedImages[0] = src;
    }
  }

  /**
   * Deselects defined image src
   * @param {string} src Image source URL
   * @returns {undefined}
   * */
  deselectImage(src: string) {
    if (this.data.multiple) {
      this.selectedImages.splice(this.selectedImages.indexOf(src), 1);
    } else {
      this.selectedImages[0] = '';
    }
  }

  /**
   * Gets amount of selected images
   * @returns {number}
   * */
  getAmountSelectedImages() {
    if (this.data.multiple) {
      return this.selectedImages.length;
    } else if (this.selectedImages[0]) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Deselects all images
   * @returns {undefined}
   * */
  deselectAllImages() {
    if (this.data.multiple) {
      this.selectedImages = [];
    } else {
      this.selectedImages[0] = '';
    }
  }

  /**
   * Closes dialog and returns selected images
   * @returns {undefined}
   * */
  closeDialog() {
    if (this.data.multiple) {
      this.dialogRef.close(this.selectedImages);
    } else {
      this.dialogRef.close(this.selectedImages[0]);
    }
  }

  /**
   * Closes dialog on no click
   * @returns {undefined}
   * */
  onNoClick() {
    this.dialogRef.close();
  }
}
