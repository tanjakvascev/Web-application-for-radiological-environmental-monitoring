import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(data=>{
      if(data.length > 0){
        this.users = data;
      }
    })
    this.name = "";
    this.lastname = "";
    this.email = "";
    this.username = "";
    this.username2 = "";
    this.password = "";
    this.oldPassword = "";
    this.newPassword = "";
    this.role = "";
    this.showPassword = false;
    this.showNewPassword = false;
    this.showOldPassword = false;
  }

  users: User[] = [];
  username: string = "";
  username2: string = "";
  password: string = "";
  oldPassword: string = "";
  newPassword: string = "";
  name: string = "";
  lastname: string = "";
  email: string = "";
  role: string = "";

  private userService = inject(UserService);
  private router = inject(Router);

  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showOldPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  addNewUser(){
    if(this.name == "" || this.lastname == "" || this.email == "" ||
      this.username == "" || this.password == "" || this.role == ""){
      alert("Sva polja moraju biti popunjena!");
      return;
    }
    if (!this.isValidEmail(this.email)) {
      alert("Unesite validnu email adresu!");
      return;
    }
    this.userService.addNewUser(this.name, this.lastname,
      this.email, this.username, this.password, this.role.toLowerCase()).subscribe(data=>{
      if(data.message == "ok"){
        alert("Korisnik uspešno sačuvan!");
        this.ngOnInit();
      }
      else{
        alert(data.message);
      }
    })
  }

  changePassword(){
    if(this.username2 == "" || this.oldPassword == "" || this.newPassword == ""){
      alert("Sva polja moraju biti popunujena!");
      return;
    }
    this.userService.changePassword(this.username2, this.oldPassword, this.newPassword).subscribe(data=>{
      if(data.message == "ok"){
        alert("Lozinka uspešno promenjena!");
        this.ngOnInit();
      }
      else{
        alert(data.message);
      }
    })
  }

  deleteUser(u: User){
    const confirmed = window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?');
    if (!confirmed) {
      return;
    }
    this.userService.deleteUser(u).subscribe(data=>{
      if(data.message == "ok"){
        alert("Korisnik uspešno obrisan!");
        this.ngOnInit();
      }
      else{
        alert(data.message);
      }
    })
  }

  logout(){
    this.router.navigate(['/admin']);
  }

}
