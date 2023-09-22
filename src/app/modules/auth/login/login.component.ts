import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { AuthService } from 'src/app/core/security/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert/alert.service';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  form: UntypedFormGroup;

  inputType = 'password';
  visible = false;

  private _snackBar = this._alertService.snackBar;

  constructor(private router: Router,
              private fb: UntypedFormBuilder,
              private cd: ChangeDetectorRef,
              private _authService: AuthService,
              private readonly _alertService: AlertService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      usuario: ['coperito', Validators.required],
      contrasena: ['123456', Validators.required]
    });
  }

  login() {
    if(!this.form.valid) return;
    const user: Partial<any> = {
      usuario: this.form.get('usuario').value,
      contrasena: this.form.get('contrasena').value
    }
    this._authService.login(user)
      .subscribe(res => {
        this._snackBar.info(`Bienvenido ${res.user.name}`, 5000);
        this.router.navigate(['/']);
    })
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
