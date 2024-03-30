import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    const isAdministratorPresent = this.authService.isAdministratorPresentValue;

    if (
      !isAdministratorPresent &&
      !currentUser &&
      route.routeConfig?.path !== 'init'
    ) {
      this.router.navigate(['/init']);
      return false;
    }
    if (
      !isAdministratorPresent &&
      !currentUser &&
      route.routeConfig?.path === 'init'
    ) {
      return true;
    }
    if (route.routeConfig?.path === 'auth' && !currentUser) {
      return true;
    }

    if (isAdministratorPresent && currentUser) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
