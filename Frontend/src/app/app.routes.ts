import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SamplesViewComponent } from './samples-view/samples-view.component';
import { AddNewSampleComponent } from './add-new-sample/add-new-sample.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReportComponent } from './report/report.component';
import { CalculationViewComponent } from './calculation-view/calculation-view.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CalculationComponent } from './calculation/calculation.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "admin", component: AdminComponent},
  {path: "admin-home", component: AdminHomeComponent},
  {path: "home", component: HomeComponent},
  {path: "samplesView", component: SamplesViewComponent},
  {path: "addNewSample", component: AddNewSampleComponent},
  {path: "invoice", component: InvoiceComponent},
  {path: "report", component: ReportComponent},
  {path: "calculation/:internID", component: CalculationComponent},
  {path: "calculationView/:internID", component: CalculationViewComponent}
];
