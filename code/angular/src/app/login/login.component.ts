import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { BlobAnimationComponent } from '../blob-animation/blob-animation.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [BlobAnimationComponent, NavbarComponent],
})
export class LoginComponent {
  blobImages : Array<string> = [
    'blob1.png',
    'blob2.png',
    'blob3.png',
    'blob4.png'
  ];
  constructor(private router: Router) {}
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getBlobImagePath(blobName: string): string {
    return `../../assets/images/blobs/${blobName}`;
  }
  registracija() {}
}
