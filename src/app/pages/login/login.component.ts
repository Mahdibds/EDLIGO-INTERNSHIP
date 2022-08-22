import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  frmLogin: FormGroup;
  hide = true;
  loading = false;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private _authService: AuthService, private _localService: LocalService, 
    private _router:Router) {
    this.frmLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.frmLogin.controls;
  }

  ngOnInit(): void {
    console.log('initiated');
  }

  async onSubmit() {
    if (this.frmLogin.valid) {
      try {
        this.loading = true;
        let authentication = await this._authService.login(this.frmLogin.value.username, this.frmLogin.value.password);
        console.log(authentication);
        this._localService.deleteuser(this.frmLogin.value.username);
        this._router.navigate([authentication["screen"]]);
        this.loading=false;
      } catch (error) {

        let message="authentication error";
        if(error.error){
          if(error.error.bloqued){
            message=error.error.message;
            this._localService.deleteuser(this.frmLogin.value.username);
          }else if(error.error.completed){
            let reslocal = this._localService.modifyattempt(this.frmLogin.value.username);
            let resbloqued = await this.validatelock(this.frmLogin.value.username, reslocal["attempt"], error.error.completed);
            message = resbloqued.message;
            if(resbloqued.bloqued){
              this._localService.deleteuser(this.frmLogin.value.username);
            }
          } else {
            message=error.error.message;
          }
        }
        this._snackBar.open(message, 'closed',{
          duration:3000
        });
        this.loading=false;
      }
      
    }
  }

  async validatelock(username, attempt, completed){

    let message= "";
    let bloqued= false;
    try {
      let bloqueo = await this._authService.validatelock({"username": username, "id_completed": completed, "attempt":attempt}).toPromise();
      message= bloqued["message"];
      bloqued= bloqued["bloqued"];
      
    } catch (error) {
      message ="server error";
    }

    return {"message": message, "bloqued": bloqued};
  }





}
