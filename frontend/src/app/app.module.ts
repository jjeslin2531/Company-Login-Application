import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { TeamsComponent } from './components/teams/teams.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CompanyComponent } from './components/company/company.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarWorkerComponent } from './navbar-worker/navbar-worker.component';

import { AnnoucementsEntityComponent } from './annoucements-entity/annoucements-entity.component';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
// import { ApplicationConfig } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};





@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    AnnouncementsComponent,
    TeamsComponent,
    ProjectsComponent,
    CompanyComponent,
    NavbarComponent,
    NavbarWorkerComponent,
    AnnoucementsEntityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  
  providers: [HttpClientModule, HttpClient ],
  bootstrap: [AppComponent]
})
export class AppModule { 


  
}
