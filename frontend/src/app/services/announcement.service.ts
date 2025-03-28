import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const announcementURL = "http://localhost:8080/announcements"
const CompanyUrl = 'http://localhost:8080/company/';
@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor( private http: HttpClient ) { }

  async getAnnouncements(id: number) {
    let data = await this.http.get(`${CompanyUrl}${id}/announcements`).toPromise();
    console.log(data);
    return data;
  }


  async postAnnouncement(announcementDtoObject: object) {
    let data = await this.http.post(announcementURL, announcementDtoObject).toPromise();
    console.log(data);
    return data;
  }

  async patchAnnouncement(companyId: number, announcementDtoObject: object, announcementId: number) {
    let data = await this.http.patch(`${CompanyUrl}${companyId}/announcements/${announcementId}`, announcementDtoObject).toPromise();
    console.log(data);
    return data;
  }

  async deleteAnnouncement(announcementId: number) {
    let data = await this.http.delete(`${announcementURL}/${announcementId}`).toPromise();
    console.log(data);
    return data;
  }

}

