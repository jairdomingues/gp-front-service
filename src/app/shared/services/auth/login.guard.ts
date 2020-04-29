import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class LoginGuard implements CanActivate {
  private isAuthenticated = false; // Set this value dynamically
  
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.isAuthenticated) {
      return true
    }
    this.router.navigateByUrl('/dashboard/analytics');
    return false; 
  }

}