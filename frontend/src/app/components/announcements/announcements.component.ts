import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { AnnouncementEntity } from 'src/app/annoucements-entity/annoucements-entity.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Ensure FormsModule is imported



export interface AnnouncementDto {
  id: number,
  date: string,
  title: string,
  message: string,
  author: BasicUserDto
}

export interface BasicUserDto {
  id: number,
  profile: ProfileDto,
  isAdmin: boolean,
  active: boolean,
  status: string
}

export interface ProfileDto {
  firstname: string,
  lastname: string,
  email:string,
  phone: string
}

const fullUserDto = JSON.parse(localStorage.getItem('fullUserDto') || '{}');

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  
})


export class AnnouncementsComponent implements OnInit {

  constructor(private annoucementService: AnnouncementService) {}
  

  isAdmin: boolean = false;
  newMessageToPost = {
    title: '',
    message: ''
  };

  newMessagesToPost = [
    {}
  ];

  modalVisible = false; 
  myAnnoucements: AnnouncementEntity[] = [];
  newAnnoucement: AnnouncementDto | null = null;
  companyId: number = 0;

  ngOnInit(): void {
    this.getAllAnnoucemnts();
  }

  async getAllAnnoucemnts(){
    try{
      console.log("Getting all nnoucements");
      const companyIdString = JSON.parse(localStorage.getItem('companyId') || "");
      let data = await this.annoucementService.getAnnouncements(companyIdString);
      
      this.myAnnoucements = Array.isArray(data) ? data: [];
      console.log("IN ANNOUCEMNTSERVICE");
      console.log(this.myAnnoucements);

      const fullUserDto = JSON.parse(localStorage.getItem('fullUserDto') || '{}');
      console.log(fullUserDto.isAdmin);
      if(fullUserDto.admin === true){
        this.isAdmin = true;
      }

    } catch{
      
    }
  }


    async createAnnoucement(){
      // postAnnouncement(companyId: number, announcementDtoObject: object)
      console.log("annoucment created");
      const fullUserDto = JSON.parse(localStorage.getItem('fullUserDto') || '{}');
      const announcementDto = this.mapToAnnouncementDto(fullUserDto);
      let message = this.annoucementService.postAnnouncement(announcementDto);
      this.getAllAnnoucemnts();
      window.location.reload();
      console.log(announcementDto);
      console.log("logged");
      console.log(message);
    }

    mapToAnnouncementDto(fullUserDto: any): AnnouncementDto {
      const author: BasicUserDto = {
        id: fullUserDto.id,
        profile: {
          firstname: fullUserDto.profile.firstName,
          lastname: fullUserDto.profile.lastName,
          email: fullUserDto.profile.email,
          phone: fullUserDto.profile.phone
        },
        isAdmin: fullUserDto.admin,
        active: fullUserDto.active,
        status: fullUserDto.status
      };
  
      return {
        id: fullUserDto.id, 
        date: new Date().toISOString(),
        title: this.newMessageToPost.title,
        message: this.newMessageToPost.message,
        author: author
      };
    }
  

    openModal() {
      this.modalVisible = true;
    }
  

    closeModal() {
      this.modalVisible = false;
      this.newMessageToPost = { title: '', message: '' };
    }
  

    submitNewMessage() {
        this.createAnnoucement();  
    }
    // async deleteAnnouncement(companyId: number, announcementId: number) {
    deleteAnnouncement(announce: any) {
      const companyIdString = JSON.parse(localStorage.getItem('companyId') || "");
      this.myAnnoucements = this.myAnnoucements.filter(a => a !== announce);
      let response = this.annoucementService.deleteAnnouncement(announce.id);
      console.log("IS ANNOUCEMENT DEELETED?  "+ response);
    }
  }