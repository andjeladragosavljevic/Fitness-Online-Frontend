import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      paymentMethod: [null],
      cardNumber: [''],
    });
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
