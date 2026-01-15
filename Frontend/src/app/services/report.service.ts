import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sample } from '../models/sample';
import { Invoice } from '../models/invoice';
import { Calculation } from '../models/calculation';
import { Report } from '../models/report';
import { User } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }

  private httpClient = inject(HttpClient)

  getAllReports(){
    return this.httpClient.get<Report[]>("http://localhost:4000/report/getAllReports");
  }

  generateReport(sample: Sample, invoice: Invoice, calculation: Calculation, examiner: User, technicalMenager: string,
    technicalMenagerEmail: string
  ){
    return this.httpClient.post('http://localhost:4000/report/generateReport', {
      sample, invoice, calculation, examiner, technicalMenager, technicalMenagerEmail
    }, {
      responseType: 'blob'
    }).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Izvestaj_${sample.internID}.docx`;
      a.click();
    });
  }

  setStatus(internID: string, status: string){
    return this.httpClient.post<Message>("http://localhost:4000/report/setStatus", {internID, status});
  }
}
