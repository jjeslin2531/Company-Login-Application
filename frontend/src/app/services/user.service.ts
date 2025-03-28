
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';


const UserUrl = 'http://localhost:8080/users/';
const LoginUrl = 'http://localhost:8080/users/login';
const CompanyUrl = 'http://localhost:8080/company/';


@Injectable({
  providedIn: 'root'
})


export class UserService {

  constructor( private http: HttpClient ) { }

  async loginUser(credentialsDTOobject: object) {
    let data = await this.http.post(LoginUrl, credentialsDTOobject).toPromise();
    console.log(data);
    return data;
  }

  async getUsers(id: number) {
    let data = await this.http.get(`${CompanyUrl}${id}/users`).toPromise();
    console.log(data);
    return data;
  }

  async postUser(userDtoObject: object) {
    let data = await this.http.post(`${UserUrl}`, userDtoObject).toPromise();
    console.log(data);
    return data;
  }

}

