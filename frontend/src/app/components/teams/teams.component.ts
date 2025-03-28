import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService} from 'src/app/services/company.service';
import { TeamService } from 'src/app/services/team.service';

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
  projectCount?: number; 
}

export interface CompanyDto {
  id: number;
  name: string;
  description: string;
  teams: [TeamDto];
  employees: [BasicUserDto];
}

export interface ProjectDto{
  id: number;
  name: string;
  description: string;
  active: boolean;
  team: TeamDto;
}

export interface displayTeam {
  current: TeamDto,
  isActive: boolean
}

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent {

  userAdmin: boolean = false;
  teams: TeamDto[]  = [];
  temp: displayTeam[]  = [];
  companyid: number = 0;

  newTeam: TeamDto = { id: 0,
    name: "",
    description: "",
    teammates: []}

  isAddTeamOverlayOpen: boolean = false;

  isLoading = false;
  error: string | null = null;

  members: BasicUserDto[] = [];
  selectedTeammateIds: BasicUserDto[] = [];
  selectedTeam: TeamDto | null = null;

  projectCount: number = 0; // Store project count
  projects: ProjectDto[] = [];

  constructor(private teamService: TeamService, private companyService: CompanyService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getTeams();


    const fullUserDto = JSON.parse(localStorage.getItem('fullUserDto') || '{}');
    console.log(fullUserDto.isAdmin);
    if(fullUserDto.admin === true){
      this.userAdmin = true;
    }

  }

  async getTeams() {
    try {
      const companyIdString = JSON.parse(
        localStorage.getItem('companyId') || ''
      );
      this.companyid = parseInt(companyIdString);
      const data = await this.teamService.getTeams(this.companyid);
      this.teams = Array.isArray(data) ? data : [];

      await Promise.all(this.teams.map(async (team) => {
        team['projectCount'] = (await this.getProjects(team.id)).length;
      }));

      this.sortTeams();
      
    } catch (error) {
      console.error('Error fetching Teams', error);
      this.teams = [];
    }
  }

  async getProjects(teamId: number): Promise<ProjectDto[]> {
    try {
      const companyIdString = JSON.parse(localStorage.getItem('companyId') || '');
      this.companyid = parseInt(companyIdString);
  
      const data = await this.companyService.getProjects(this.companyid, teamId);
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching projects', error);
      return []; 
    }
  }


  async postTeams() {
    try {
      const companyIdString = JSON.parse(
        localStorage.getItem('companyId') || ''
      );
      this.newTeam.teammates = this.selectedTeammateIds;
      this.companyid = parseInt(companyIdString);
      const data = await this.teamService.postTeam(this.companyid,this.newTeam);
      if(data != null)
        this.teams.push(data);
      
      this.closeAddTeamOverlay();
      this.sortTeams();

    } catch (error) {
      console.error('Error creating Teams', error);
      this.teams = [];
    }
  }

  sortTeams() {
    this.teams.sort((a, b) => {
      // Extract the number part from the team name (e.g., Team1 => 1)
      const teamANumber = parseInt(a.name.replace(/\D/g, '')); // Remove non-digit characters
      const teamBNumber = parseInt(b.name.replace(/\D/g, '')); // Remove non-digit characters
      return teamANumber - teamBNumber; // Sort numerically
    });
  }

  openAddTeamOverlay() {
    this.newTeam = {
      id: 0,
      name: "",
      description: "",
      teammates: []
    };
    console.log("IN OVERLAY");
    this.getUsers();
    this.isAddTeamOverlayOpen = true;
  }

  closeAddTeamOverlay() {
    this.isAddTeamOverlayOpen = false;
  }

  async getUsers() {
    try {
      const companyIdString = JSON.parse(
        localStorage.getItem('companyId') || ''
      );
      this.companyid = parseInt(companyIdString);
      const data = await this.companyService.getUsers(this.companyid);
      this.members = Array.isArray(data) ? data : [];

    } catch (error) {
      console.error('Error fetching Teams', error);
      this.members = [];
    }
  }

  addSelectedUser(event: any): void{
    const selectedId = Number(event.target.value);
    
    const selectedUser = this.members.find(member => member.id === selectedId)!;

    this.selectedTeammateIds.push(selectedUser);

    this.members = this.members.filter(member=> member.id !== selectedId);
    
    event.target.value = "";
  }

  removeMember( id:number)
  {
    const selectedUser = this.selectedTeammateIds.find(member => member.id === id)!;
    this.members.push(selectedUser);
    this.selectedTeammateIds = this.selectedTeammateIds.filter(member => member !== selectedUser);
    
  
  }


//to edit a team 

async patchTeams() {
  try {
    const companyIdString = JSON.parse(
      localStorage.getItem('companyId') || ''
    );
    this.companyid = parseInt(companyIdString);
    if(!this.selectedTeam!) return;

    this.selectedTeam.teammates = this.selectedTeammateIds;

    const data = await this.teamService.patchTeam(this.companyid,this.selectedTeam, this.selectedTeam.id);
    
    this.closeAddTeamOverlay();
    this.sortTeams();


  } catch (error) {
    console.error('Error creating Teams', error);
    this.teams = [];
  }
}
  goToProjects(teamid: number){
    
    this.router.navigate([`${teamid}/projects/`], { relativeTo: this.activatedRoute });
  }


  deleteTeam(delTeam: any) {
    const companyIdString = JSON.parse(localStorage.getItem('companyId') || "");
    this.teams = this.teams.filter(a => a !== delTeam);
    console.log("IS ANNOUCEMENT DEELETED?  "+ delTeam.id);
   let response = this.teamService.deleteTeam(delTeam.id);
    
  }

}
