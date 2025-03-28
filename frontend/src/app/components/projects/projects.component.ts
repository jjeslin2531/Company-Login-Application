import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; //Get team ID from url nav btwn pages.
import { CompanyService } from 'src/app/services/company.service';
import { ProjectService } from 'src/app/services/project.service'; //Connects backend API to fetch and modify project data.

// Project looks for displaying and editing.
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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  // Data storage.
  projects: ProjectDto[] = [];
  teamId: number = 0;
  companyId: number = 0;
  teamName: string = '';
  isAdmin: boolean = false;

  // New project form data.
  newProject: ProjectDto = {
    id: 0,
    name: '',
    description: '',
    active: true,
    team: { id: 0, name: '', description: '', teammates: [] },
  };

  // Project being edited.
  editingProject: ProjectDto | null = null;

  // UI state management.
  isCreateProjectOverlayOpen: boolean = false;
  isEditProjectOverlayOpen: boolean = false;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    // Get company ID from localStorage.
    const companyIdString = localStorage.getItem('companyId');
    if (companyIdString) {
      this.companyId = parseInt(JSON.parse(companyIdString));
    }

    const fullUserDto = JSON.parse(localStorage.getItem('fullUserDto') || '{}');
    console.log(fullUserDto.isAdmin);
    if(fullUserDto.admin === true){
      this.isAdmin = true;
    }

    // Get team ID from route parameters.
    this.route.params.subscribe((params) => {
      if (params['teamId']) {
        this.teamId = +params['teamId']; // Convert to number with +.
        this.newProject.team.id = this.teamId; // Set for new project creation.
        this.loadProjects();
      }
    });
  }

  // Fetch projects.
  async loadProjects(): Promise<void> {
    try {
      // Call service to get projects for this team.
      const data = await this.companyService.getProjects(
        this.companyId,
        this.teamId
      );

      console.log('Raw projects data:', data); //Debuggin inactive bug.

      //create new array to ensure change detection.
      this.projects = [];

      //Process each project individually and add to the array.
      if (Array.isArray(data)) {
        data.forEach((project) => {
          console.log(
            `Adding project: ${project.name}, Active: ${project.active}`
          );
          this.projects.push({ ...project }); // Create a new object copy
        });
      }

      //Force change detection to update the view.
      this.changeDetector.detectChanges();

      // Log the processed projects array.
      console.log('Final projects array:', this.projects);

      // Get team name if available in response.
      if (data && Array.isArray(data) && data.length > 0) {
        const firstProject = data[0];
        if (firstProject.team && firstProject.team.name) {
          this.teamName = firstProject.team.name;
        } else {
          // Fallback if team name is not available.
          this.teamName = `Team ${this.teamId}`;
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = []; // Empty array on error.
    }
  }

  // Open the create project overlay.
  openCreateProjectOverlay(): void {
    // Reset form.
    this.newProject = {
      id: 0,
      name: '',
      description: '',
      active: true,
      team: {
        id: this.teamId,
        name: this.teamName || '',
        description: '',
        teammates: [],
      },
    };
    this.isCreateProjectOverlayOpen = true;
  }

  // Close the create project overlay.
  closeCreateProjectOverlay(): void {
    this.isCreateProjectOverlayOpen = false;
  }

  // Submit new project to the API.
  async createProject(): Promise<void> {
    try {
      // Validate required fields.
      if (!this.newProject.name) {
        alert('Project name is required');
        return;
      }

      if (!this.newProject.description) {
        alert('Project description is required');
        return;
      }

      // Make sure teamId is set correctly.
      this.newProject.team.id = this.teamId;

      // Submit to API.
      await this.projectService.postProject(this.newProject);

      // Refresh the project list.
      await this.loadProjects();

      // Close overlay.
      this.closeCreateProjectOverlay();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  }

  // Open the edit project overlay.
  openEditProjectOverlay(project: ProjectDto): void {
    // Create a copy to avoid direct reference modification.
    this.editingProject = JSON.parse(JSON.stringify(project));
    this.isEditProjectOverlayOpen = true;
  }

  // Close the edit project overlay.
  closeEditProjectOverlay(): void {
    this.editingProject = null;
    this.isEditProjectOverlayOpen = false;
  }

  // Submit the edited project to the API.
  async updateProject(): Promise<void> {
    try {
      // Ensure we have a project to update.
      if (!this.editingProject || !this.editingProject.id) {
        return;
      }

      // Validate required fields.
      if (!this.editingProject.name) {
        alert('Project name is required');
        return;
      }

      if (!this.editingProject.description) {
        alert('Project description is required');
        return;
      }

      console.log(
        'Before update - Project status:',
        this.editingProject.active
      );

      // Submit to API.
      await this.projectService.patchProject(
        this.editingProject,
        this.editingProject.id
      );

      console.log('After update - Refreshing project list');

      // Refresh the project list.
      await this.loadProjects();

      // Double-check projects after refresh
      console.log('Projects after refresh:', this.projects);

      // Force change detection again to ensure UI updates.
      this.changeDetector.detectChanges();

      // Close overlay.
      this.closeEditProjectOverlay();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  }

  // Nav back to Teams page.
  navigateBackToTeams(): void {
    this.router.navigate(['/teams']);
  }
}
