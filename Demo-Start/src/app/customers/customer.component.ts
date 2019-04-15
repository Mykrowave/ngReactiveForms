import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Customer } from './customer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;

  emailValidationMessage: string;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        emailConfirm: ['', Validators.required]
      }, { validator: inputValueSame('email', 'emailConfirm')}),
      phone: '',
      rating: [null, rangeWholeNumber(1, 5)],
      sendNotification: 'email',
      sendCatalog: true
    });

    this.customerForm.get('sendNotification').valueChanges.subscribe(changesValue => {
      this.sendNotificationRadioValueChanges(changesValue);
    });

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges
      .pipe( debounceTime(500) )
      .subscribe(() => {
        this.setMessage(emailControl);
    });
  }

  private errorMessageResolver(key: string): string {
    switch (key) {
      case 'email': return 'You must enter a valid Email';
      case 'required': return 'You must enter an Email';
    }
    return 'Error!';
  }
  setMessage(control: AbstractControl): void {
    this.emailValidationMessage = '';
    if ((control.touched || control.dirty) && control.errors) {
      Object.keys(control.errors).map(key => {
          this.emailValidationMessage += this.errorMessageResolver(key);
        });
    }
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

  sendNotificationRadioValueChanges(newValue: string): void {
    if (newValue === 'text') {
      this.customerForm.get('phone').setValidators(Validators.required);
    } else {
      this.customerForm.get('phone').clearValidators();
    }

    this.customerForm.get('phone').updateValueAndValidity();
  }
}



export function rangeWholeNumber(min: number, max: number): ValidatorFn {

  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (control.value >= min &&
        control.value <= max &&
        Math.round(+control.value) === +control.value) {
    } else {
      return {'range': true};
    }
    return null;
  };

}

export function inputValueSame(formControlName1: string, formControlName2: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {

    if ( control.get(formControlName1).value === control.get(formControlName2).value ||
         control.get(formControlName1).pristine ||
         control.get(formControlName2).pristine) {

    } else {

      return {'matching': true};
    }
    return null;
  };
}


