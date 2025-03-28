import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const CompanyUrl = 'http://localhost:8080/company/';
const ProjectUrl = 'http://localhost:8080/projects/';

interface ProjectDto {
  id: number;
  name: string;
  description: string;
  active: boolean;
  team: TeamDto;
}

interface TeamDto {
  id: number;
  name: string;
  description: string;
  teammates: BasicUserDto[];
}

interface ProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BasicUserDto {
  id: number;
  profile: ProfileDto;
  admin: boolean;
  active: boolean;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  // Fixing inactive bug.
  // async getProjects(companyId: number, teamId: number) {
  //   let data = await this.http
  //     .get(`${CompanyUrl}${companyId}/teams/${teamId}/projects`)
  //     .toPromise();
  //   console.log(data);
  //   return data;
  // }


  async postProject(projectDtoObject: ProjectDto) {
    let data = await this.http
      .post(`${ProjectUrl}`, projectDtoObject)
      .toPromise();
    console.log(data);
    return data;
  }

  async patchProject(projectDtoObject: ProjectDto, projectId: number) {
    let data = await this.http
      .patch(`${ProjectUrl}${projectId}`, projectDtoObject)
      .toPromise();
    console.log(data);
    return data;
  }

  async deleteProject(projectId: number) {
    let data = await this.http.delete(`${ProjectUrl}${projectId}`).toPromise();
    console.log(data);
    return data;
  }
}
