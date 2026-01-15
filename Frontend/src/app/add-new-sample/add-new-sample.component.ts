import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Sample } from '../models/sample';
import { User } from '../models/user';
import { SampleService } from '../services/sample.service';
import { UserService } from '../services/user.service';
import * as mammoth from 'mammoth';

@Component({
  selector: 'app-add-new-sample',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './add-new-sample.component.html',
  styleUrl: './add-new-sample.component.css'
})
export class AddNewSampleComponent {
  user: User = new User();
  selectedMethod: string = "";
  newSamples: Sample[] = [];
  samples: Sample[] = [];

  private userService = inject(UserService);
  private sampleService = inject(SampleService);
  private router = inject(Router);

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("user")!)
    this.sampleService.getAllSamples().subscribe(data=>{
      if(data.length>0){
        this.samples = data;
      }
    })
  }

  logout() {
    this.router.navigate(['/']);
  }

  addNewSample(){
    this.newSamples.push({
      internID: '',
      sampleID: '',
      name: '',
      origin: '',
      dateReception: '',
      dateMeasure: '',
      type: '',
      note: '',
      user: '',
      geometry: '',
      detector: '',
      nameHistory: []
    })
  }

  removeNewSample(i: number){
    this.newSamples.splice(i, 1);
  }

  saveAll(){
    this.newSamples = this.newSamples.filter(s => !(
      s.internID == "" &&
      s.sampleID == "" &&
      s.name == "" &&
      s.origin == "" &&
      s.dateReception == "" &&
      s.dateMeasure == "" &&
      s.type == "" &&
      s.note == "" &&
      s.geometry == "" &&
      s.detector == ""
    ));
    for(let s of this.newSamples){
      if(s.internID == ""){
        alert("Interzna oznaka ne sme ostati prazna!");
        return;
      }
      if(s.sampleID == ""){
        alert("Broj uzorka ne sme ostati prazan!");
        return;
      }
      if(s.name == ""){
        alert("Naziv uzorka ne sme ostati prazan!");
        return;
      }
      if(s.origin == ""){
        alert("Poreklo ne sme ostati prazno!");
        return;
      }
      if(s.dateReception == ""){
        alert("Datum prijema ne sme ostati prazan!");
        return;
      }
      if(s.dateMeasure == ""){
        alert("Datum merenje ne sme ostati prazan!");
        return;
      }
      if(s.geometry == ""){
        alert("Geometrija ne sme ostati prazna!");
        return;
      }
      if(s.detector == ""){
        alert("Detektor ne sme ostati prazan!");
        return;
      }
      s.user = this.user.username;
      const prefix = s.internID;
      const matchingSamples = this.samples.filter(x => x.internID.startsWith(prefix + "/"));

      const existingNumbers = matchingSamples
        .map(x => {
          const parts = x.internID.split("/");
          return parts.length > 1 ? parseInt(parts[1]) : 0;
        })
        .filter(n => !isNaN(n));

      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      s.internID = `${prefix}/${nextNumber}`;
    }
    if(this.newSamples.length==0){
      alert("Unesite novu evidenciju pre cuvanja!");
      return;
    }
    this.sampleService.addNewSamples(this.newSamples).subscribe(data=>{
      if(data.message=="ok"){
        alert("Uspesno dodavanje evidencija!");
        this.ngOnInit();
        this.newSamples = [];
      }
      else{
        alert(data.message);
      }
    })
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const arrayBuffer = e.target.result;

      // Konverzija Word dokumenta u HTML pomoću mammoth-a
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Parsiranje HTML-a pomoću DOMParser-a
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const rows = Array.from(doc.querySelectorAll('table tr'));

      this.newSamples = [];

      // Preskačemo prvi red (naslovi kolona)
      for (let i = 1; i < rows.length; i++) {
        const cells = Array.from(rows[i].querySelectorAll('td')).map(td => td.textContent?.trim() || '');

        // Ako ima dovoljno kolona (redni broj, broj uzorka, naziv uzorka, poreklo)
        if (cells.length >= 4) {
          this.newSamples.push({
            internID: '',
            sampleID: cells[1] || '',
            name: cells[2] || '',
            origin: cells[3] || '',
            dateReception: '',
            dateMeasure: '',
            type: '',
            user: '',
            note: '',
            geometry: '',
            detector: '',
            nameHistory: []
          });
          if (this.newSamples.length > 0) {
            this.selectedMethod = 'manualInput'; // ✅ automatski prikaži kartice
          }
        }
      }
    };



    reader.readAsArrayBuffer(file);

  }

}
