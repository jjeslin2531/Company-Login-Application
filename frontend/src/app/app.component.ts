
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './services/user.service';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

// export interface FullUserDto {
//   id: number;
//   profile: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//   };
//   admin: boolean;
//   active: boolean;
//   status: string;
//   companies: any[];
//   teams: any[];
// }

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'Fast Track Management App';
//   isAdmin = false;
//   isWorker = false;
//   workerName = "";
//   isLoggedIn = false;
//   showNavbar = true;

//   constructor(
//     private userService: UserService, 
//     private router: Router
//   ) {
//     // Use NavigationEnd to ensure we're tracking the final route
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd)
//     ).subscribe(() => {
//       this.showNavbar = this.router.url !== '/company'; 
//     });
    
//     this.checkExistingUserData();
//   }

//   private checkExistingUserData() {
//     const storedUserData = localStorage.getItem('fullUserDto');
//     if (storedUserData) {
//       const userData: FullUserDto = JSON.parse(storedUserData);
//       this.updateUserStatus(userData);
//     }
//   }

//   async handleLogin(credentials: { username: string; password: string }) {
//     try {
//       const userData = await this.userService.loginUser(credentials);
      
//       // Store user data in local storage
//       localStorage.setItem('fullUserDto', JSON.stringify(userData));
      
//       // Update user status
//       this.updateUserStatus(userData as FullUserDto);
      
//       // Navigate based on user role
//       this.navigateAfterLogin();
      
//     } catch (error) {
//       console.error("Login failed", error);
//       this.resetUserStatus();
//     }
//   }

//   private navigateAfterLogin() {
//     if (this.isAdmin) {
//       this.router.navigate(['/company']);
//     } else {
//       // Assuming first company is the default
//       const companyId = this.getUserCompanyId();
//       localStorage.setItem('companyId', JSON.stringify(companyId));
//       this.router.navigate(['/announcements']);
//     }
//   }

//   private getUserCompanyId(): number {
//     return this.isLoggedIn && this.isWorker 
//       ? (this.getCurrentUser()?.companies[0]?.id || 0)
//       : 0;
//   }

//   private updateUserStatus(userData: FullUserDto) {
//     this.isLoggedIn = true;
//     this.isAdmin = userData.admin;
//     this.isWorker = !userData.admin;
//     this.workerName = `${userData.profile.firstName} ${userData.profile.lastName}`;
//   }

//   private resetUserStatus() {
//     this.isAdmin = false;
//     this.isWorker = false;
//     this.isLoggedIn = false;
//     this.showNavbar = false;  // Explicitly set showNavbar to false
//     this.workerName = "";
//     localStorage.removeItem('fullUserDto');
//     localStorage.removeItem('companyId');
//     this.router.navigate(['/login']);
//   }

//   // Optional method to get current user data
//   private getCurrentUser(): FullUserDto | null {
//     const storedUserData = localStorage.getItem('fullUserDto');
//     return storedUserData ? JSON.parse(storedUserData) : null;
//   }

//   // Method to handle logout
//   logout() {
//     this.resetUserStatus();
//   }
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Fast Track Management App';
  isAdmin = false;
  isLoggedIn = false;
  showNavbar = true;
  workerName = "";

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {
    // Track route changes for navbar visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showNavbar = this.router.url !== '/company'; 
    });
  }

  ngOnInit() {
    // Subscribe to authentication state
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isAdmin = user.admin;
        this.isLoggedIn = true;
        this.workerName = `${user.profile.firstName} ${user.profile.lastName}`;
      } else {
        this.resetUserStatus();
      }
    });
  }

  private resetUserStatus() {
    this.isAdmin = false;
    this.isLoggedIn = false;
    this.showNavbar = false;
    this.workerName = "";
  }

  // Remove previous methods as they're now handled by AuthService
}