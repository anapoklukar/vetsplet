import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Employee } from '../models/employee';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslatePipePipe } from '../pipes/translate-pipe.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-veterinar-login',
  standalone: true,
  templateUrl: './veterinar-login.component.html',
  styleUrl: './veterinar-login.component.css',
  imports: [
    LogoComponent,
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    NavbarComponent,
    TranslatePipePipe,
    CommonModule
  ],
})
export class VeterinarLoginComponent implements OnInit {
  loginForm!: FormGroup;
  employee: Employee = {
    _id : '',
    profession: '',
    name: '',
    surname: '',
    telNumber: '',
    email: '',
    username: '',
    clinic: '',
    status: '',
    isOwner: false,
    password: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      ime: ['', Validators.required],
      priimek: ['',Validators.required],
      uporabniskoIme: ['',Validators.required],
      email: ['',Validators.required, Validators.email],
      kontakt: ['',Validators.pattern("^[0-9]*$")],
      geslo: ['',Validators.required],
      ponovitevGesla: ['',Validators.required],
      nazivAmbulante: ['',Validators.required],
      emailAmbulante: [''],
      kontaktAmbulante: [''],
      mestoNaslovAmbulante: ['']
  });
  }


  onSubmit(): void {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    if (this.loginForm.valid) {
      this.employee.name = this.loginForm.value.ime;
      this.employee.surname = this.loginForm.value.priimek;
      this.employee.email = this.loginForm.value.email;
      this.employee.telNumber = this.loginForm.value.telNumber;
      this.employee.username = this.loginForm.value.uporabniskoIme;
      this.employee.clinic = this.loginForm.value.nazivAmbulante;
      this.employee.password = this.loginForm.value.geslo;
      this.employee.profession = 'TBD';
    }
    if (this.loginForm.value.ponovitevGesla == this.employee.password) {
      this.loginService.registerEmployee(this.employee).subscribe({
        next: (response) => {
          localStorage.setItem("auth_token", response.token);
          localStorage.setItem("id", response.id);
          this.navigateTo('veterinar');
        },
        error: (error) => {},
        complete: () => {},
      });
      return;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
