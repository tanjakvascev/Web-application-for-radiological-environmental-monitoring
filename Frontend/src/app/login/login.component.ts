import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
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
      if(data && data.token){
        this.router.navigate(['home'])
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
