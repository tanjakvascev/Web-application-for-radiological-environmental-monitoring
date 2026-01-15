import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Sample } from '../models/sample';
import { SampleService } from '../services/sample.service';
import { FormsModule } from '@angular/forms';
import { Isotope } from '../models/isotope';
import { IsotopeDB } from '../models/isotopeDB';
import { IsotopeService } from '../services/isotope.service';
import { polCoeff } from '../models/polCoeff';
import { FONtime } from '../models/FONtime';
import { FON } from '../models/FON';
import { CommonModule } from '@angular/common';
import { Calculation } from '../models/calculation';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-calculation',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './calculation.component.html',
  styleUrl: './calculation.component.css'
})
export class CalculationComponent implements OnInit{

  user: User = new User();
  username: string = "";

  ngOnInit(): void {
    this.calculations = []
    this.time = 0;
    this.quantity = 0;

    this.newIsotopes = [];
    this.isotopesDB = [];
    this.FON = [];
    this.id = this.route.snapshot.paramMap.get('internID')!;
    const user = JSON.parse(sessionStorage.getItem("user")!);
    this.username = user.username;
    this.sampleService.getSampleByInternID(this.id).subscribe(data=>{
      if(data != null){
        this.sample = data;
        this.isotopeService.getPolCoeffs(data.geometry, data.detector).subscribe(data1=>{
          if(data1){
            this.polCoeffs = data1;
          }
          else{
            alert("Koeficijenti polinoma nisu uneti!");
          }
        })
        this.isotopeService.getFONtime(data.geometry, data.detector).subscribe(data2=>{
          if(data2 != null){
            this.FONtime = data2;
          }
          else{
            alert("FON vreme nije uneto!");
          }
        })
        this.isotopeService.getFON(data.geometry, data.detector).subscribe(data3=>{
          if(data3 != null){
            this.FON = data3;
          }
          else{
            alert("FON vrednosti nisu unete!");
          }
        })
      }
      else{
        alert("Trazeni uzorak nije pronadjen!");
      }
    })


    this.isotopeService.getAllIsotopes().subscribe(data=>{
      if(data.length>0){
        this.isotopesDB = data;
      }
      else{
        alert("Ne posotji nijedan izotop!");
      }
    })
  }

  id: string = "";
  sample: Sample = new Sample();
  time: number = 0;
  quantity: number = 0;
  calculations: any[] = [];

  newIsotopes: Isotope[] = [];
  isotopesDB: IsotopeDB[] = [];
  polCoeffs: polCoeff = new polCoeff();
  FONtime: FONtime = new FONtime();
  FON: FON[] = [];

  private route = inject(ActivatedRoute);
  private sampleService = inject(SampleService);
  private isotopeService = inject(IsotopeService);
  private router = inject(Router);

  addIsotope(){
    this.newIsotopes.push({
      name: '',
      energy: 0,
      NETarea: 0,
      GROSSarea: 0
    })
  }

  removeIsotope(index: number) {
    this.newIsotopes.splice(index, 1);
  }

  updateIsotopeEnergy(isotope: Isotope) {
    const isotopeFromDB = this.isotopesDB.find(i => i.name === isotope.name);

    if (!isotopeFromDB || isotopeFromDB.energy.length === 0) {
      isotope.energy = 0;
      return;
    }

    const energies = isotopeFromDB.energy;

    if (energies.length === 1) {
      isotope.energy = energies[0];
      return;
    }

    const currentIndex = this.newIsotopes.indexOf(isotope);

    isotope.energy = energies[0];

    for (let i = 1; i < energies.length; i++) {
      this.newIsotopes.splice(currentIndex + i, 0, {
        name: isotope.name,
        energy: energies[i],
        NETarea: 0,
        GROSSarea: 0
      });
    }
  }


  polFunction(energy: number): number {
    const E = energy / 1000;

    return (
      E * (this.polCoeffs?.values?.at(0) ?? 0) +
      (this.polCoeffs?.values?.at(1) ?? 0) +
      Math.pow(E, -1) * (this.polCoeffs?.values?.at(2) ?? 0) +
      Math.pow(E, -2) * (this.polCoeffs?.values?.at(3) ?? 0) +
      Math.pow(E, -3) * (this.polCoeffs?.values?.at(4) ?? 0) +
      Math.pow(E, -4) * (this.polCoeffs?.values?.at(5) ?? 0)
    );
  }


  coeff(isotope: Isotope) {
    const isotopeFromDB = this.isotopesDB.find(i => i.name === isotope.name);

    if (!isotopeFromDB) return 0;

    const energyIndex = isotopeFromDB.energy.findIndex(e => e === isotope.energy);

    const Ia = isotopeFromDB.Ia?.[energyIndex] ?? 1;

    return Math.exp(this.polFunction(isotope.energy)) * Ia / 100;
  }

  BCKG(isotope: Isotope){
    return isotope.GROSSarea - isotope.NETarea;
  }

  activity(isotope: Isotope) {
  const isotopeFromDB = this.isotopesDB.find(i => i.name === isotope.name);
  if (!isotopeFromDB) return 0;

  const sameIsotopes = this.newIsotopes.filter(i => i.name === isotope.name);
  const fonEntry = this.FON.find(f => f.isotope === isotope.name);
  const FON = fonEntry?.FON ?? [];
  const FONtimeValue = this.FONtime?.value ?? 1;

  if (FON.length === 1 && isotope.NETarea > 1) {
    const energyIndex = isotopeFromDB.energy.findIndex(e => e === isotope.energy);
    const fonVal = FON[energyIndex] ?? 0;
    return (isotope.NETarea / this.time - fonVal / FONtimeValue) / this.coeff(isotope);
  }

  const minNET = Math.min(...sameIsotopes.map(i => i.NETarea));

  if (minNET <= 1) {
    return NaN;
  }

  let numerator = 0;
  let denominator = 0;

  for (const iso of sameIsotopes) {
    const bckg = this.BCKG(iso);
    const weight = Math.pow(iso.NETarea, 2) / (iso.NETarea + 2 * bckg);
    const specAct = this.specialActivity(iso);

    numerator += specAct * weight;
    denominator += weight;
  }

  if (denominator === 0) return 0;
  return numerator / denominator;
}

  specialActivity(isotope: Isotope){
    const isotopeFromDB = this.isotopesDB.find(i => i.name === isotope.name);
    if (!isotopeFromDB) return 0;

    const fonEntry = this.FON.find(f => f.isotope === isotope.name);
    const FON = fonEntry?.FON ?? [];
    const FONtimeValue = this.FONtime?.value ?? 1;

    const energyIndex = isotopeFromDB.energy.findIndex(e => e === isotope.energy);
    const fonVal = FON[energyIndex] ?? 0;

    return ((isotope.NETarea / this.time - fonVal / FONtimeValue) / this.coeff(isotope)) / this.quantity;
  }

  error(isotope: Isotope){
    if(isotope.NETarea > 1){
      return Math.sqrt((isotope.NETarea + 2*this.BCKG(isotope)) / Math.pow(isotope.NETarea, 2) + 0.33*Math.pow(0.008121,2)) * this.specialActivity(isotope);
    }
    else{
      return "*"
    }
  }

  MDA(isotope: Isotope) {
    const sameIsotopes = this.newIsotopes.filter(i => i.name === isotope.name);
    const firstIsotope = sameIsotopes[0];
    if (isotope === firstIsotope) {
      return (4.65 * Math.sqrt(this.BCKG(isotope) + 1) + 3) /
            (this.coeff(isotope) * this.time * this.quantity);
    }
    const firstCalc = this.calculations.find(c => c.isotope === isotope.name);
    if (firstCalc) {
      return firstCalc.MDA;
    }
    return 0;
  }


  calculate(){
    this.calculations = []
    if(this.newIsotopes.length == 0){
      alert("Morate uneti bar jedan izotop!");
      return;
    }
    if(this.time == 0){
      alert("Vreme ne sme biti 0!");
      return;
    }
    if(this.quantity == 0){
      alert("Kolicina uzorka ne sme biti 0!");
      return;
    }
    for (const isotope of this.newIsotopes) {
      if (isotope.name == "") {
        alert("Niste uneli naziv izotopa!");
        return;
      }
      if (isNaN(isotope.NETarea) || isotope.NETarea <= 0) {
        alert(`NET area za izotop ${isotope.name || "(nepoznat)"} mora biti veća od 0!`);
        return;
      }

      if (isNaN(isotope.GROSSarea) || isotope.GROSSarea <= 0) {
        alert(`GROSS area za izotop ${isotope.name || "(nepoznat)"} mora biti veća od 0!`);
        return;
      }
    }
    for(let isotope of this.newIsotopes){
      const isotopeFromDB = this.isotopesDB.find(i => i.name === isotope.name);
      if (!isotopeFromDB) continue;
      const energyIndex = isotopeFromDB.energy.findIndex(e => e === isotope.energy);
      if (energyIndex === -1) continue;
      const fonEntry = this.FON.find(f => f.isotope === isotope.name);
      const FON = fonEntry?.FON?.[energyIndex] ?? 0;
      this.calculations.push({
        energy: isotope.energy,
        Ia: isotopeFromDB.Ia?.[energyIndex] ?? 0,
        isotope: isotope.name,
        coeff: this.coeff(isotope),
        NET: isotope.NETarea,
        GROSS: isotope.GROSSarea,
        BCKG: this.BCKG(isotope),
        FON: FON,
        activity: this.activity(isotope),
        specialActivity: this.specialActivity(isotope),
        error: this.error(isotope),
        MDA: this.MDA(isotope)
      })
    }
  }

  saveCalculation(){
    if(this.calculations.length == 0){
      alert("Prvo izvršite proračun!");
      return;
    }
    const c = new Calculation();
    c.internID = this.id
    c.examiner = this.username
    for (let calc of this.calculations){
      c.isotopes.push(calc.isotope)
      if(!calc.activity){
        c.values.push(calc.MDA)
        c.errs.push(-1)
      }
      else{
        if(calc.MDA > calc.specialActivity){
          c.values.push(calc.MDA)
          c.errs.push(-1)
        }
        else{
          c.values.push(calc.specialActivity)
          c.errs.push(calc.error)
        }
      }
    }
    this.isotopeService.saveCalculation(c).subscribe(data=>{
      if(data.message == "ok"){
        alert("Proračun uspešno sačuvan!");
        this.router.navigate(['/samplesView']);
        return;
      }
      else{
        alert(data.message);
        return;
      }
    })
  }

  logout(){
    this.router.navigate(['/']);
  }

}
