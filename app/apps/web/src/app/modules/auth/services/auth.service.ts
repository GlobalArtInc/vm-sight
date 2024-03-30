import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  public currentUser$: Observable<UserType>;
  public isLoading$: Observable<boolean>;
  public isAdminPresent$: Observable<boolean>;

  public currentUserSubject: BehaviorSubject<UserType>;
  public isAdminPresentSubject: BehaviorSubject<boolean>;
  public isLoadingSubject: BehaviorSubject<boolean>;

  get isAdministratorPresentValue(): boolean {
    return this.isAdminPresentSubject.value;
  }

  set isAdministratorPresentValue(state: boolean) {
    this.isAdminPresentSubject.next(state);
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.isAdminPresentSubject = new BehaviorSubject<boolean>(false);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.isAdminPresent$ = this.isAdminPresentSubject.asObservable();
    const subscr = this.getUserInfo().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): any {
    this.isLoadingSubject.next(true);
    return this.http.post('public/auth/login', { email, password }).pipe(
      switchMap(() => this.getUserInfo()),
      catchError(err => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    this.http.get('public/auth/logout').subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: {},
        });
      },
    });
  }

  getUserInfo(): any {
    this.isLoadingSubject.next(true);
    return this.http.get('protected/user/info').pipe(
      map((user: any) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  checkAdmin() {
    return this.http
      .get<{ isAdministratorPresent: boolean }>('public/user/admin/check')
      .pipe(
        map(state => {
          this.isAdminPresentSubject.next(state.isAdministratorPresent);

          return state.isAdministratorPresent;
        })
      );
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
