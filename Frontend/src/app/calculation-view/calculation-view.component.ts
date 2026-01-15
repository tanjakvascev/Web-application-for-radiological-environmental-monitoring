import { Component, inject, OnInit } from '@angular/core';
import { Calculation } from '../models/calculation';
import { IsotopeService } from '../services/isotope.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SampleService } from '../services/sample.service';
import { Sample } from '../models/sample';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice.service';
import { ReportService } from '../services/report.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-calculation-view',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule, FormsModule],
  templateUrl: './calculation-view.component.html',
  styleUrl: './calculation-view.component.css'
})
export class CalculationViewComponent implements OnInit{
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
    this.id = this.route.snapshot.paramMap.get('internID')!;
    this.isotopeService.getCalculationByInternID(this.id).subscribe(data=>{
      if (data){
        this.calculation = data;
      }
    })
    this.sampleService.getSampleByInternID(this.id).subscribe(data=>{
      if(data){
        this.sample = data
      }
    })
    this.invoiceService.getInvoiceByID(this.id).subscribe(data=>{
      if(data){
        this.invoice = data;
      }
    })
  }

  user: User = new User();
  technicalMenager: User = new User();
  username: string = "";
  calculation: Calculation = new Calculation();
  sample: Sample = new Sample();
  invoice: Invoice = new Invoice();
  id: string = "";
  selectedTechnicalMenager: string = "";

  private isotopeService = inject(IsotopeService);
  private sampleService = inject(SampleService);
  private invoiceService = inject(InvoiceService);
  private reportService = inject(ReportService);
  private userService = inject(UserService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  generateReport() {
    if (!this.selectedTechnicalMenager) {
      alert('Molimo izaberite tehničkog rukovodioca pre generisanja izveštaja.');
      return;
    }
    if(!this.invoice){
      alert('Za dati uzorak ne postoji faktura.');
      return;
    }
    this.userService.getUserByName(this.selectedTechnicalMenager).subscribe(data=>{
      if(data){
        this.technicalMenager = data;
        this.reportService.generateReport(this.sample, this.invoice, this.calculation, this.user, this.selectedTechnicalMenager, this.technicalMenager.email);
        alert("Izveštaj uspešno generisan. Tehnički rukovodilac je mejlom obavešten o pristiglom izveštaju za verifikaciju.");
      }
    })
    this.router.navigate(['/report'])
  }

  logout(){
    this.router.navigate(['/']);
  }
}
