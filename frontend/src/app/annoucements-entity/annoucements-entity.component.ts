import { Component, Input } from '@angular/core';



// export type annoucementsEntity = AnnouncementEntity[]

export interface AnnouncementEntity {
  id: number
  date: string
  title: string
  message: string
  author: Author
}

export interface Author {
  id: number
  profile: Profile
  admin: boolean
  active: boolean
  status: string
}

export interface Profile {
  firstName: string
  lastName: string
  email: string
  phone: string
}


@Component({
  selector: 'app-annoucements-entity',
  templateUrl: './annoucements-entity.component.html',
  styleUrls: ['./annoucements-entity.component.css'],
  
})
export class AnnoucementsEntityComponent {

  

  @Input() annoucement!: AnnouncementEntity;

}
