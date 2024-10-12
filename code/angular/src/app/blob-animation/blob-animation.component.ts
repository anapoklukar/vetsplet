import { Component } from '@angular/core';

@Component({
  selector: 'app-blob-animation',
  standalone: true,
  imports: [],
  templateUrl: './blob-animation.component.html',
  styleUrl: './blob-animation.component.css'
})
export class BlobAnimationComponent {
  blobImages : Array<string> = [
    'blob1.png',
    'blob2.png',
    'blob3.png',
    'blob4.png'
  ];

  getBlobImagePath(blobName: string): string {
    return `../../assets/images/blobs/${blobName}`;
  }
}