import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Employee } from '../models/employee';
import { LoginService } from '../services/login.service';
import { Client } from 'undici-types';
import { Route, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslatePipePipe } from '../pipes/translate-pipe.pipe';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-existing-login',
  standalone: true,
  templateUrl: './existing-login.component.html',
  styleUrl: './existing-login.component.css',
  imports: [
    LogoComponent,
    ReactiveFormsModule,
    NavbarComponent,
    TranslatePipePipe,
  ],
})
export class ExistingLoginComponent {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(
        (response: {id: string; token:string; clinicId: string;}) => this.handleResponse(response),
        (error) => console.error('Error:', error),
      );
    }
  }
  handleResponse(response: {id: string; token:string; clinicId: string;}) {
    localStorage.clear();
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('id', response.id);
    if (response.clinicId) {
      localStorage.setItem('clinicId', response.clinicId);
      this.navigateTo('veterinar');
    } else {
      this.navigateTo('stranka');
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
