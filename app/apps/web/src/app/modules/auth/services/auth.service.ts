import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, finalize, map } from 'rxjs';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private unsubscribe: Subscription[] = [];
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(private router: Router, private readonly httpService: HttpClient) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
  }

  logout() {
    this.httpService.post('public/auth/logout', {}).subscribe();
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  authUser(): Observable<any> {
    return this.httpService.get('protected/user/info').pipe(
      map((user: UserType) => {
        if (user) {
          return this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
