import { Component, NgModule } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Client } from '../models/client';
import { LoginService } from '../services/login.service';
import { Clinic } from '../models/clinic';
import { Router } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { CommonModule } from '@angular/common';
import { TranslatePipePipe } from '../pipes/translate-pipe.pipe';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-klinika-registracija',
  standalone: true,
  templateUrl: './klinika-registracija.component.html',
  styleUrl: './klinika-registracija.component.css',
  imports: [
    LogoComponent,
    ReactiveFormsModule,
    CommonModule,
    TranslatePipePipe,
    NavbarComponent,
  ],
})
export class KlinikaRegistracijaComponent {
  klinikaForm!: FormGroup;
  loading = false;

  clinic: Clinic = {
    _id:'',
    owner: '',
    name: '',
    address: '',
    telNumber: '',
    email: '',
    description: '',
    employees: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initForm();

    this.klinikaForm.get('owner')?.valueChanges.subscribe((value) => {
      this.klinikaForm.get('employees')?.setValue(value, { emitEvent: false });
    });
  }

  initForm() {
    this.klinikaForm = this.formBuilder.group({
      owner: ['', Validators.required],
      address: ['', Validators.required],
      name: ['', Validators.required],
      telNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      employees: this.formBuilder.array(['']),
    });
  }

  registerClient() {
    if (this.klinikaForm.valid) {
      this.clinic = this.klinikaForm.value;
      this.loading = true;
      this.loginService.registerClinic(this.clinic).subscribe({
        // while waiting for observable to resolve, write a message to user
        next: (response) => {
          this.navigateTo('veterinar-login');
          console.log('Client registered successfully', response);
        },
        error: (error) => {},
        complete: () => {
          this.loading = false;
        },
      });

      return;
    } else {
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
