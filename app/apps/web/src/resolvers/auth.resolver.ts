import { NavigationGuardNext, Route } from 'vue-router';
import authService from '@/services/auth.service';

class AuthResolver {
  async checkAdmin(to: Route, from: Route, next: NavigationGuardNext) {
    try {
      await authService.checkAdmin();
      next();
    } catch (err) {
      next('/init/admin');
    }
  }
}

export default AuthResolver;
