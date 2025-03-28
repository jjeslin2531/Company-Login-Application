import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar-worker',
  templateUrl: './navbar-worker.component.html',
  styleUrls: ['./navbar-worker.component.css']
})
export class NavbarWorkerComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}

