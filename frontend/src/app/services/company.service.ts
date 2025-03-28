import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ProjectDto{
  id: number;
  name: string;
  description: string;
  active: boolean;
  team: TeamDto;
}
export interface ProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BasicUserDto {
  id: number;
  profile: ProfileDto;
  admin: boolean;
  active: boolean;
  status: string;
}

export interface TeamDto {
  id: number;
  name: string;
  description: string;
  teammates: BasicUserDto[];
}


const CompanyUrl = 'http://localhost:8080/company/';
@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  async getCompanies() {
    let data = await this.http.get(CompanyUrl).toPromise();
    console.log(data);
    return data;
  }

  async getUsers(id: number) {
    let data = await this.http.get(`${CompanyUrl}${id}/users`).toPromise();
    console.log(data);
    return data;
  }

  async getProjects(id: number, teamId: number,  includeInactive: boolean = true) {
    let data = await this.http.get<ProjectDto[]>(`${CompanyUrl}${id}/teams/${teamId}/projects?includeInactive=${includeInactive}`).toPromise();
    console.log(data);
    return data;
  }

}
