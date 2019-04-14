import { Component, OnInit } from '@angular/core';

import { Customer } from './customer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      rating: [null, [rangeWholeNumber]],
      sendNotification: 'email',
      sendCatalog: true,
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'mikey',
      lastName: 'parker',
      email: 'mikeparkercrescerance.com'
    });
  }

  sendNotificationRadioClicked(): void {
    console.log('value: ' + this.customerForm.get('sendNotification').value);

    if (this.customerForm.get('sendNotification').value === 'text') {
      this.customerForm.get('phone').setValidators(Validators.required);
    } else {
      this.customerForm.get('phone').clearValidators();
    }

    this.customerForm.get('phone').updateValueAndValidity();

  }
}


  export function rangeWholeNumber(control: AbstractControl): {[key: string]: boolean} | null {
    if (control.value > 0 &&
        control.value < 6 && Math.round(+control.value) === +control.value) {

    } else {
      return {'range': true};
    }

    return null;
  }
