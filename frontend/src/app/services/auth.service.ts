import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { map } from 'rxjs/operators'; // Import map operator


export interface FullUserDto {
  id: number;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  admin: boolean;
  active: boolean;
  status: string;
  companies: any[];
  teams: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Create a BehaviorSubject to manage authentication state
  private currentUserSubject = new BehaviorSubject<FullUserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Observable for login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    // Check for existing user data on service initialization
    this.checkExistingUserData();
  }

  // Check for existing user data in local storage
  private checkExistingUserData() {
    const storedUserData = localStorage.getItem('fullUserDto');
    if (storedUserData) {
      const userData: FullUserDto = JSON.parse(storedUserData);
      this.setCurrentUser(userData);
    }
  }

  // Login method
  async login(credentials: { username: string; password: string }): Promise<FullUserDto> {
    try {
      const userData = await this.userService.loginUser(credentials);
      
      // Store user data in local storage
      localStorage.setItem('fullUserDto', JSON.stringify(userData));
      
      // Set current user and update login status
      this.setCurrentUser(userData as FullUserDto);

      return userData as FullUserDto;
    } catch (error) {
      this.logout(); // Ensure clean logout on login failure
      throw error;
    }
  }

  // Set current user and update authentication state
  private setCurrentUser(userData: FullUserDto) {
    this.currentUserSubject.next(userData);
    this.isLoggedInSubject.next(true);
  }

  // Logout method
  logout() {
    // Clear user data from local storage
    localStorage.removeItem('fullUserDto');
    localStorage.removeItem('companyId');

    // Reset authentication state
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);

    // Navigate to login page
    this.router.navigate(['/login'], {
      queryParams: { 
        loggedOut: 'true' 
      }
    });
  }

  // Get current user
  getCurrentUser(): FullUserDto | null {
    return this.currentUserSubject.getValue();
  }

  // Check if user is an admin
  isAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.admin : false;
  }

  // Navigate after login based on user role
  navigateAfterLogin() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    if (currentUser.admin) {
      this.router.navigate(['/company']);
    } else {
      // Assuming first company is the default
      const companyId = currentUser.companies[0]?.id || 0;
      localStorage.setItem('companyId', JSON.stringify(companyId));
      this.router.navigate(['/announcements']);
    }
  }
}

// Auth Guard for protecting routes
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
