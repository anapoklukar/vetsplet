import { Routes } from '@angular/router';
import { StrankaLoginComponent } from './stranka-login/stranka-login.component';
import { VeterinarLoginComponent } from './veterinar-login/veterinar-login.component';
import { LoginComponent } from './login/login.component';
import { ExistingLoginComponent } from './existing-login/existing-login.component';
import { VeterinarComponent } from './veterinar/veterinar.component';
import { StrankaComponent } from './stranka/stranka.component';
import {KoledarComponent} from "./koledar/koledar.component";
import { KlinikaRegistracijaComponent } from './klinika-registracija/klinika-registracija.component';
import { DbComponent } from './db/db.component';
import { DiscountComponent } from "./shared/component/discount/discount.component";
import {GostComponent} from "./gost/gost.component";
import { routeGuardGuard } from './guards/route-guard.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'stranka-login', component: StrankaLoginComponent },
  { path: 'veterinar-login', component: VeterinarLoginComponent },
  { path: 'existing-login', component: ExistingLoginComponent },
  { path: 'veterinar', component: VeterinarComponent, canActivate: [routeGuardGuard] },
  { path: 'stranka', component: StrankaComponent, canActivate: [routeGuardGuard]},
  {path: 'koledar', component: KoledarComponent},
  { path: 'klinika-registracija', component: KlinikaRegistracijaComponent },
  { path: 'db', component: DbComponent},
  { path: 'gost', component: GostComponent},
  { path: 'discount', component: DiscountComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
