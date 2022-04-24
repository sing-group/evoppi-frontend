/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {Feedback} from '../../../entities/notification';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})
export class FeedbackDialogComponent {
  public readonly formGroup: FormGroup;

  constructor(
      private readonly dialogRef: MatDialogRef<FeedbackDialogComponent>,
      private readonly formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSend(): void {
    this.dialogRef.close(new Feedback(
      this.formGroup.value.email,
      this.formGroup.value.subject,
      this.formGroup.value.message
    ));
  }
}
