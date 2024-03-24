import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  async submit() {
    if (!this.loginForm.valid) {
      return;
    }
    this.httpClient.post('public/auth/login', this.loginForm.value).subscribe({
      next: async () => {
        this.toastr.success('User has been authorized', 'Success');
        this.authService.authUser().subscribe({
          next: () => {
            this.router.navigate(['/']);
          }
        });
      },
      error: () => {
        this.toastr.error('Incorrect login or password!', 'Error');
      },
    });
  }
}
