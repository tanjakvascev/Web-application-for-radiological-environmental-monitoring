import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  ngOnInit(): void {
    this.userService.logout();
  }


  private userService = inject(UserService)
  private router = inject(Router)
  username: string = ""
  password: string = ""
  message: string = ""


  login(){
    if(this.username == "" || this.password == ""){
      this.message = "Sva polja moraju biti popunjena"
      return
    }
    this.userService.login(this.username, this.password).subscribe(data=>{
      if(data && data.token && data.user.role == "admin"){
        this.router.navigate(['admin-home'])
      }
      else{
        this.message = "Neispravni podaci"
      }
    })
  }

  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
