import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GenderService } from 'src/app/services/gender.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  frmRegister: FormGroup;
  Gender: Array<any>;
  loading: boolean = false;
  hide:boolean=true;

  constructor(
    fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _GenderService: GenderService,
    private _authService: AuthService,
    private _router:Router
  ) {
    this.Gender = _GenderService.rsltgender();
    this.frmRegister = fb.group(
      {
        name: ['', Validators.required],
        LastName: ['', Validators.required],
        username: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        gender: ['', Validators.required],
        passwd: ['', Validators.required],
        repeat_passwd: ['', Validators.required],
      },
      { validator: passwordMatchValidator }
    );
  }

  get passwd() {
    return this.frmRegister.get('passwd');
  }
  get repeat_passwd() {
    return this.frmRegister.get('repeat_passwd');
  }

  onPasswordInput() {
    if (this.frmRegister.hasError('passwordMismatch'))
      this.repeat_passwd.setErrors([{ passwordMismatch: true }]);
    else this.repeat_passwd.setErrors(null);
  }

  ngOnInit(): void {
    
  }

  get f() {
    return this.frmRegister.controls;
  }

  async register() {

    if(this.frmRegister.valid){
      try {
        this.loading=true;
        let value = this.frmRegister.value;
        let user ={
            name: value.name,
            LastName: value.LastName,
            gender: value.gender,
            email:value.email,
            username: value.username,
            Password: value.passwd
        }; 

        let register = await this._authService.registeruser(user).toPromise();
        this.loading=false;
        this._snackBar.open(register.message, 'closed',{
          duration: 5000
        });
        this._router.navigate(["/login"]);
      } catch (error) {
        this.loading=false;
        this._snackBar.open(error.error.message, 'closed');
      }
    }
    
  }
}


export const passwordMatchValidator: ValidatorFn = (
  formGroup: FormGroup
): ValidationErrors | null => {
  console.log(formGroup.get('passwd').value);
  console.log(formGroup.get('repeat_passwd').value);
  if (formGroup.get('passwd').value === formGroup.get('repeat_passwd').value)
    return null;
  else return { passwordMismatch: true };
};
