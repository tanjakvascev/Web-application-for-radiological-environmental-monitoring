import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sample } from '../models/sample';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  constructor() { }

  private httpClient = inject(HttpClient)

  getAllSamples(){
    return this.httpClient.get<Sample[]>("http://localhost:4000/samples/getAllSamples");
  }

  getSampleByInternID(id: string){
    return this.httpClient.get<Sample>(`http://localhost:4000/samples/getSampleByInternID/${id}`);
  }

  deleteSample(internID: string){
    console.log(internID)
    return this.httpClient.post<Message>("http://localhost:4000/samples/deleteSample", {
      internID
    });
  }

  changeSampleName(internID: string, newName: string, username: string){
    return this.httpClient.post<Message>("http://localhost:4000/samples/changeSampleName", {internID, newName, username});
  }

  addNewSamples(s: Sample[]){
    return this.httpClient.post<Message>("http://localhost:4000/samples/addSamples", s);
  }
}
