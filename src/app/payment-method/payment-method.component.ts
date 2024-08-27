import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProgramService } from '../services/program.service';
import { NgFor } from '@angular/common';
import { PaymentMethodService } from '../services/payment-method.service';
import { response } from 'express';
import { PaymentMethod } from '../models/PaymentMethod';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [AppMaterialModule, ReactiveFormsModule, NgFor],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css',
})
export class PaymentMethodComponent implements OnInit {
  paymentForm: FormGroup;
  paymentMethods: PaymentMethod[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentMethodComponent>,
    private programService: ProgramService,
    private paymentMethosService: PaymentMethodService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: [Validators.required],
      cardNumber: [''],
      cardHolderName: [''],
      expiryDate: [''],
      cvv: [''],
    });

    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      this.setCardValidators(method);
    });
  }

  setCardValidators(paymentMethodId: number) {
    const cardNumberControl = this.paymentForm.get('cardNumber');
    const expiryDateControl = this.paymentForm.get('expiryDate');
    const ccvControl = this.paymentForm.get('ccv');

    if (paymentMethodId === 1) {
      cardNumberControl?.setValidators([Validators.required, luhnValidator()]);
      expiryDateControl?.setValidators([
        Validators.required,
        expiryDateValidator(),
      ]);
      ccvControl?.setValidators([Validators.required, cvvValidator()]);
    } else {
      cardNumberControl?.clearValidators();
      expiryDateControl?.clearValidators();
      ccvControl?.clearValidators();
    }

    cardNumberControl?.updateValueAndValidity();
    expiryDateControl?.updateValueAndValidity();
    ccvControl?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.paymentMethosService.getPaymentMethods().subscribe({
      next: (response) => {
        this.paymentMethods = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  submitPayment() {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      this.dialogRef.close(paymentData);
    }
  }
}

export function luhnValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0 ? null : { luhnInvalid: true };
  };
}

export function cvvValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value || !/^\d{3,4}$/.test(value)) {
      return { cvvInvalid: true };
    }
    return null;
  };
}

export function expiryDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const [month, year] = value
      .split('/')
      .map((part: string) => parseInt(part, 10));
    const now = new Date();
    const expiryDate = new Date(2000 + year, month - 1);

    return expiryDate > now ? null : { expiryDateInvalid: true };
  };
}
