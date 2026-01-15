import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IsotopeDB } from '../models/isotopeDB';
import { polCoeff } from '../models/polCoeff';
import { FONtime } from '../models/FONtime';
import { FON } from '../models/FON';
import { Calculation } from '../models/calculation';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class IsotopeService {

  constructor() { }

  private httpClient = inject(HttpClient)

  getAllIsotopes(){
    return this.httpClient.get<IsotopeDB[]>("http://localhost:4000/isotope/getAllIsotopes");
  }

  getPolCoeffs(geometry: string, detector: string){
    return this.httpClient.get<polCoeff>(`http://localhost:4000/isotope/getPolCoeffs?geometry=${geometry}&detector=${detector}`);
  }

  getFONtime(geometry: string, detector: string){
    return this.httpClient.get<FONtime>(`http://localhost:4000/isotope/getFONtime?geometry=${geometry}&detector=${detector}`);
  }

  getFON(geometry: string, detector: string){
    return this.httpClient.get<FON[]>(`http://localhost:4000/isotope/getFON?geometry=${geometry}&detector=${detector}`);
  }

  saveCalculation(calc: Calculation){
    return this.httpClient.post<Message>(`http://localhost:4000/isotope/saveCalculation`, calc);
  }

  getAllCalculations(){
    return this.httpClient.get<Calculation[]>(`http://localhost:4000/isotope/getAllCalculations`);
  }

  getCalculationByInternID(id: string){
    return this.httpClient.get<Calculation>(`http://localhost:4000/isotope/getCalculationByInternID/${id}`);
  }
}
