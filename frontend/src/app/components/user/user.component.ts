import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

interface ProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface UserDto {
  id: number;
  profile: ProfileDto;
  active: boolean;
  admin: boolean;
  status: string;
}

interface CredentialsDto {
  username: string,
  password: string
}

interface UserRequestDto {
    credentials: CredentialsDto,
    profile: ProfileDto,
    admin: boolean,
    companyId: number
}


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent {
  
  constructor(private userService: UserService) {}    
  users: UserDto[] = [];
  companyId: number = 0;
  isAddUserOverlayOpen: boolean = false;
  newUser: UserRequestDto = {credentials: {username: "", password: ""},
   profile: {firstName: "", lastName: "", email: "", phone: ""}, admin: false, companyId: 0}; 

   ngOnInit(): void {
    this.getUsers()
  }

  async getUsers() {
    try {
      const companyIdString = JSON.parse(localStorage.getItem('companyId') || "");
      this.companyId = parseInt(companyIdString);
      const data = await this.userService.getUsers(this.companyId);
      this.users = Array.isArray(data) ? data: [];
    } catch (error) {
      console.error("Error fetching companies", error);
      this.users = []; 
    }
  }

  
  openAddUserOverlay() {
    this.newUser = {
      credentials: {username: "", password: ""},
      profile: {firstName: "", lastName: "", email: "", phone: ""}, 
      admin: false, companyId: 0
    };
    this.isAddUserOverlayOpen = true;
  }

  closeAddUserOverlay() {
    this.isAddUserOverlayOpen = false;
  }


  async addUser() {
    try {

      const response = await this.userService.postUser({
        ...this.newUser,
        companyId: this.companyId
      });
      
      await this.getUsers();
      
      this.closeAddUserOverlay();
    } catch (error) {
      console.error("Error adding user", error);
    }


  }
}
