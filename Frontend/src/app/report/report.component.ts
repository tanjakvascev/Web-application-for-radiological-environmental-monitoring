import { Component, inject, OnInit } from '@angular/core';
import { Calculation } from '../models/calculation';
import { Report } from '../models/report';
import { IsotopeService } from '../services/isotope.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { DatePipe } from '@angular/common';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { forkJoin } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
  ngOnInit(): void {
    this.loadAllData()
  }

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadAllData();
      });
  }

  loadAllData() {
    const storedUser = JSON.parse(sessionStorage.getItem('user')!);
    const username = storedUser.username;

    forkJoin({
      calculations: this.isotopeService.getAllCalculations(),
      reports: this.reportService.getAllReports(),
      user: this.userService.getUserByUsername(username)
    }).subscribe(({ calculations, reports, user }) => {
      this.calculations = calculations ?? [];
      this.filteredCalculations = [...this.calculations];
      this.sortCalculations();

      this.reports = reports ?? [];
      this.user = user;

      this.splitReports();
    });
  }


  splitReports() {
    this.approvedReports = this.reports.filter(
      r => r.status === 'APPROVED'
    );
    console.log(this.user)
    this.myPendingReports = this.reports.filter(
      r =>
        r.status === 'PENDING' &&
        r.technicalMenager === this.user.name + " " + this.user.lastname
    );
  }

  searchText: string = '';
  calculations: Calculation[] = [];
  filteredCalculations: Calculation[] = [];
  activeTab: 'ARCHIVE' | 'VERIFY' = 'ARCHIVE';

  reports: Report[] = [];
  approvedReports: Report[] = [];
  myPendingReports: Report[] = [];

  user: User = new User()

  private isotopeService = inject(IsotopeService)
  private reportService = inject(ReportService)
  private userService = inject(UserService)
  private router = inject(Router)

  viewDetails(calc: Calculation){
    this.router.navigate(['/calculationView', calc.internID])
  }

  previewWord(internID: string) {
    window.open(
      `http://localhost:4000/report/getWordReport/${internID}`,
      '_blank'
    );
  }

  sortCalculations() {
    this.filteredCalculations = [...this.calculations].sort((a, b) => {
      // Ako internID ima slova + brojeve, izdvajamo numerički deo za sortiranje
      const numA = parseInt(a.internID.replace(/\D/g, ''), 10);
      const numB = parseInt(b.internID.replace(/\D/g, ''), 10);
      return numB - numA; // opadajuće
    });
  }

  filterCalculations() {
    const term = this.searchText.toLowerCase().trim();
    this.filteredCalculations = this.calculations.filter(c =>
      c.internID.toLowerCase().includes(term)
    );
  }

  approve(internID: string){
    this.reportService.setStatus(internID, 'APPROVED').subscribe(data=>{
      if(data.message == 'ok'){
        alert("Izveštaj uspešno verifikovan.");
        this.reloadReports();
        this.activeTab = 'ARCHIVE';
      }
      else{
        alert(data.message);
      }
    })
  }

  reject(internID: string){
    this.reportService.setStatus(internID, 'REJECTED').subscribe(data=>{
      if(data.message == 'ok'){
        alert("Izveštaj uspešno odbijen.");
        this.reloadReports();
      }
      else{
        alert(data.message);
      }
    })
  }

  reloadReports() {
    this.reportService.getAllReports().subscribe(data => {
      this.reports = data ?? [];
      this.splitReports();
    });
  }

  downloadWord(internID: string){
    window.open(
      `http://localhost:4000/report/getWordReport/${internID}`,
      '_blank'
    );
  }

  downloadPdf(internID: string){

  }

  logout(){
    this.router.navigate(['/']);
  }

}
