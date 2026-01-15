import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { SampleService } from '../services/sample.service';
import { Sample } from '../models/sample';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  user: User = new User();
  username: string = "";

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem("user")!);
    this.username = user.username;
    this.userService.getUserByUsername(this.username).subscribe(data=>{
      if(data){
        this.user = data;
      }
      else{
        alert("Greška prilikom prijavljivanja.");
      }
    })
  }

  logout() {
    this.router.navigate(['/']);
  }
}
