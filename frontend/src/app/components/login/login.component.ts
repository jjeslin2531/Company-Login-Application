
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for logout query parameter
    this.router.queryParams.subscribe(params => {
      if (params['loggedOut'] === 'true') {
        this.loginError = 'You have been successfully logged out.';
      }
    });
  }
    
  async login(email: string, password: string) {
    // Clear previous error
    this.loginError = null;

    // Basic validation
    if (!email || !password) {
      this.loginError = 'Please enter both email and password';
      return;
    }

    try {
      await this.authService.login({ 
        username: email, 
        password: password 
      });
      
      // Navigate after successful login
      this.authService.navigateAfterLogin();
    } catch (error) {
      this.loginError = 'Login failed. Please check your credentials.';
    }
  }
}