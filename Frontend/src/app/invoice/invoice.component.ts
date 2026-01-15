import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit{
  ngOnInit(): void {
    this.newInvoices = []
    this.invoiceService.getAllInvoices().subscribe(data=>{
      if(data.length>0){
        this.invoices = data;
      }
    })
  }

  invoices: Invoice[] = [];
  newInvoices: Invoice[] = [];

  private invoiceService = inject(InvoiceService);
  private router = inject(Router)

  addInvoice() {
    this.newInvoices.push({
      date: '',
      requestNumber: 0,
      internIDs: '',
      sampleNumber: 0,
      comment: ''
    });
  }

  removeInvoice(index: number) {
    this.newInvoices.splice(index, 1);
  }

  saveInvoices() {
    for (const inv of this.newInvoices) {
      if (!inv.date || !inv.internIDs || inv.sampleNumber == null || inv.sampleNumber <= 0) {
        alert('Molimo popunite sva obavezna polja pre čuvanja.');
        return;
      }
    }
    this.invoiceService.saveInvoice(this.newInvoices).subscribe(data=>{
      if(data.message == "ok"){
        alert("Evidencije uspešno sačuvane!")
        this.ngOnInit()
      }
    })
  }

  logout(){
    this.router.navigate(['/']);
  }

}
