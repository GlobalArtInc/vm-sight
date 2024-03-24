import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required]
    });
   }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);
  }

}
