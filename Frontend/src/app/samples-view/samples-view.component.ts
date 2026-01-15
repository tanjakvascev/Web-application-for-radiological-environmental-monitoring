import { Component, inject, OnInit } from '@angular/core';
import { Sample } from '../models/sample';
import { SampleService } from '../services/sample.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Calculation } from '../models/calculation';
import { Report } from '../models/report';
import { ReportService } from '../services/report.service';
import { IsotopeService } from '../services/isotope.service';

@Component({
  selector: 'app-samples-view',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './samples-view.component.html',
  styleUrl: './samples-view.component.css'
})
export class SamplesViewComponent implements OnInit{
  samples: Sample[] = [];
  filteredSamples: Sample[] = [];
  searchText: string = "";
  selectedInternID: string = "";
  selectedSample: Sample = new Sample();
  username: string = "";
  calculations: Calculation[] = []
  reports: Report[] = []
  hasCalculationOrReport = false;

  private sampleService = inject(SampleService);
  private isotopeService = inject(IsotopeService)
  private reportService = inject(ReportService);
  private router = inject(Router);

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem("user")!);
    this.username = user.username;
    this.sampleService.getAllSamples().subscribe(data=>{
      if(data.length>0){
        this.samples = data;
        this.filteredSamples = data;
        this.filteredSamples = this.filteredSamples
        .sort((a, b) => new Date(b.dateReception).getTime() - new Date(a.dateReception).getTime());
      }
    })
    this.reportService.getAllReports().subscribe(data=>{
      if(data.length>0){
        this.reports = data;
      }
    })
    this.isotopeService.getAllCalculations().subscribe(data=>{
      if(data.length>0){
        this.calculations = data;
      }
    })
  }

  logout() {
    this.router.navigate(['/']);
  }

  deleteSample(internID: string){
    const confirmed = window.confirm('Da li ste sigurni da želite da obrišete ovaj uzorak?');
    if (!confirmed) {
      return;
    }
    this.sampleService.deleteSample(internID).subscribe(data=>{
      if(data.message=="ok"){
        this.ngOnInit();
      }
      else{
        alert(data.message);
      }
    })
  }

  checkCalculationOrReport() {
    const internID = this.selectedSample.internID;

    const hasCalculation = this.calculations.some(
      c => c.internID === internID
    );

    const hasReport = this.reports.some(
      r => r.internID === internID
    );

    this.hasCalculationOrReport = hasCalculation || hasReport;
  }


  selectSample(sample: Sample) {
    this.selectedSample = sample;
    this.showHistory = false;
    this.isEditingName = false;
    this.checkCalculationOrReport();
  }

  filterSamples(){
    let param = this.searchText.toLowerCase();
    this.filteredSamples = this.samples.filter(sample=>{
      let matchesSearch = !this.searchText || Object.values(sample).some(val=>
        String(val).toLowerCase().includes(param)
      );

      let matchesInternID =
      !this.selectedInternID ||
      sample.internID.startsWith(this.selectedInternID);

    return matchesSearch && matchesInternID;
    });

    if (this.selectedInternID) {
      this.filteredSamples = this.filteredSamples
        .sort((a, b) => b.internID.localeCompare(a.internID));
    }
    else{
      this.filteredSamples = this.filteredSamples
        .sort((a, b) => new Date(b.dateReception).getTime() - new Date(a.dateReception).getTime());
    }
  }

  calculation(id: string){
    this.router.navigate(['/calculation', id])
  }

  isEditingName = false;
  editedName = "";
  showHistory = false;

  startEditName() {
    this.isEditingName = true;
    this.editedName = this.selectedSample.name;
  }

  cancelEdit() {
    this.isEditingName = false;
  }

  saveName() {
    if (!this.editedName || this.editedName === this.selectedSample.name) {
      this.isEditingName = false;
      return;
    }

    this.sampleService.changeSampleName(this.selectedSample.internID, this.editedName, this.username).subscribe(data=>{
      if(data.message == "ok"){
        this.selectedSample.name = this.editedName;
        this.isEditingName = false;
        alert("Naziv uspešno ažuriran!");
      }
      else{
        this.isEditingName = false;
        alert(data.message)
      }
    })
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }
}
