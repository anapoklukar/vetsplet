import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { Route, Router, RouterLink, RouterModule } from '@angular/router';
import { Client } from '../models/client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslatePipePipe } from '../pipes/translate-pipe.pipe';
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-stranka-login',
  standalone: true,
  templateUrl: './stranka-login.component.html',
  styleUrl: './stranka-login.component.css',
  imports: [
    LogoComponent,
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    NavbarComponent,
    TranslatePipePipe,
  ],
})
export class StrankaLoginComponent implements OnInit {
  clientForm!: FormGroup;

  client: Client = {
    name: '',
    surname: '',
    username: '',
    email: '',
    telNumber: '',
    password: '',
    patients: [],
    _id: '',
    ethAddress: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private web3service: Web3Service
  ) {}

  ngOnInit() {
    this.initForm();
    this.web3service
    .connectToBC()
    .then((message: string) => (0));
  }

  initForm() {
    this.clientForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telNumber: ['',],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  registerClient() {
    if(this.web3service.userAddress == null || this.web3service.userAddress == undefined) return

    Object.keys(this.clientForm.controls).forEach(field => {
      const control = this.clientForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.clientForm.valid) {
      this.client.name = this.clientForm.value.name;
      this.client.surname = this.clientForm.value.surname;
      this.client.username = this.clientForm.value.username;
      this.client.email = this.clientForm.value.email;
      this.client.telNumber = this.clientForm.value.telNumber;
      this.client.password = this.clientForm.value.password;
      this.client.ethAddress = this.web3service.userAddress;

      const confirmPassword = this.clientForm.value.confirmPassword;
      if (confirmPassword == this.client.password) {
        this.loginService.registerClient(this.client).subscribe({
          next: (response) => {
            localStorage.setItem("auth_token", response.token);
            localStorage.setItem("id", response.id);

            console.log('Client registered successfully', response);

            this.registerOnBC(response)
          },
          error: (error) => {},
          complete: () => {},
        });

        return;
      } else {
        console.log('Gesli se ne ujemata');
      }
    }
  }

  registerOnBC(response) {
    this.web3service.registerUser().then((payload: any) => {
      console.log("wallet payload:", payload)
      console.log('transactionHash' in payload)
      if(!('transactionHash' in payload)) {
        console.log("Couldnt create account, the account have probably already been used, will delete account.")
        return
      }
      this.navigateTo('stranka')
    }).catch((err: any) => {
      console.log('err wallet:', err)
    })
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
