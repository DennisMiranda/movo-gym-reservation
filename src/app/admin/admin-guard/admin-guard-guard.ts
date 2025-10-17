import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);

  return authService.isAdmin();
};
