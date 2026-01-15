import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor() { }

  private httpClient = inject(HttpClient)

  getAllInvoices(){
    return this.httpClient.get<Invoice[]>("http://localhost:4000/invoice/getAllInvoices");
  }

  getInvoiceByID(id: string){
    return this.httpClient.get<Invoice>(`http://localhost:4000/invoice/getInvoiceByID/${id}`);
  }

  saveInvoice(inv: Invoice[]){
    return this.httpClient.post<Message>(`http://localhost:4000/invoice/saveInvoice`, inv);
  }
}
