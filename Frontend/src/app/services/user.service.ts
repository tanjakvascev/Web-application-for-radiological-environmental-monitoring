import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { tap } from 'rxjs';
import { Message } from '../models/message';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private httpClient = inject(HttpClient)
  private backpath = "http://localhost:4000"

  login(u: string, p: string){
    return this.httpClient.post<LoginResponse>(this.backpath + "/login", {
      username: u,
      password: p
    }).pipe(
      tap((res) => {
        sessionStorage.setItem('jwt_token', res.token);
        sessionStorage.setItem('user', JSON.stringify(res.user));
      })
    )
  }

  logout() {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user');
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwt_token');
  }

  getAllUsers(){
    return this.httpClient.get<User[]>("http://localhost:4000/getAllUsers");
  }

  getUserByUsername(username: string){
    return this.httpClient.get<User>(`http://localhost:4000/getUserByUsername/${username}`);
  }

  getUserByName(name: string){
    return this.httpClient.get<User>(`http://localhost:4000/getUserByName/${name}`);
  }

  addNewUser(name: string, lastname: string, email: string, username: string, password: string, role: string){
    return this.httpClient.post<Message>("http://localhost:4000/addNewUser",{
      name,
      lastname,
      email,
      username,
      password,
      role
    });
  }

  changePassword(username: string, oldPassword: string, newPassword: string){
    return this.httpClient.post<Message>("http://localhost:4000/changePassword",{
      username,
      oldPassword,
      newPassword
    });
  }

  deleteUser(u: User){
    return this.httpClient.post<Message>("http://localhost:4000/deleteUser", u);
  }

}
