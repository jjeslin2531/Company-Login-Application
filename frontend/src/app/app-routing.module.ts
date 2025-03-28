import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './components/company/company.component';
import { TeamsComponent } from './components/teams/teams.component';
import { UserComponent } from './components/user/user.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectsComponent } from './components/projects/projects.component';

export const routes: Routes = [
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'users', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'teams/:teamId/projects', component: ProjectsComponent },
];
// <a routerLink="/">Home</a>
// <a routerLink="/company">Company</a>
// <a routerLink="/teams">Teams</a>
// <a routerLink="/users">Users</a>
// <a routerLink="/logout">Logout</a>

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
