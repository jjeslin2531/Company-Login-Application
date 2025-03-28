import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const CompanyUrl = 'http://localhost:8080/company/';
const TeamUrl = 'http://localhost:8080/team/'

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

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor( private http: HttpClient ) { }

  async getTeams(id: number) {
    let data = await this.http.get(`${CompanyUrl}${id}/teams`).toPromise();
    console.log(data);
    return data;
  }

  async postTeam(companyId: number, teamDtoObject: TeamDto) {
    let data = await this.http.post<TeamDto>(`${TeamUrl}`, teamDtoObject).toPromise();
    console.log(data);
    return data;
  }

  async patchTeam(companyId: number, teamDtoObject: Partial<TeamDto>, teamId: number) {
    let data = await this.http.patch<TeamDto>(`${TeamUrl}${teamId}`, teamDtoObject).toPromise();
    console.log(data);
    return data;
  }

  async deleteTeam(teamId: number) {
    let data = await this.http.delete(`${TeamUrl}${teamId}`).toPromise();
    console.log(data);
    return data;
  }
}
