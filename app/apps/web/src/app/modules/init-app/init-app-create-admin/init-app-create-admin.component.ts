import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-init-app-create-admin',
  templateUrl: './init-app-create-admin.component.html',
  styleUrl: './init-app-create-admin.component.scss',
})
export class InitAppCreateAdminComponent implements OnInit, OnDestroy {
  defaultAuth: any = {
    email: '',
    password: '',
  };
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private unsubscribe: Subscription[] = [];

  protected hasError: boolean;
  protected dataForm: FormGroup;
  protected isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.dataForm.controls;
  }

  initForm() {
    this.dataForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([Validators.required, Validators.maxLength(320)]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    const createAdminSubscr = this.http
      .post('public/user/admin/init', {
        email: this.f.email.value,
        password: this.f.password.value,
      })
      .subscribe({
        next: () => {
          this.http
            .post('public/auth/login', {
              email: this.f.email.value,
              password: this.f.password.value,
            })
            .subscribe(() => {
              document.location.href = '/';
            });
        },
        error: err => {
          console.error('err', err);
          this.hasError = true;
        },
      });

    this.unsubscribe.push(createAdminSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
