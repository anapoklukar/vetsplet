import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.addVideo();
  }

  addVideo() {
    const video = this.renderer.createElement('video');

    this.renderer.setAttribute(video, 'src', '../');
    this.renderer.setAttribute(video, 'muted', 'true');
    this.renderer.setAttribute(video, 'loop', 'true');
    this.renderer.setAttribute(video, 'autoplay', 'true');

    this.renderer.addClass(video, 'video-class');

    this.renderer.appendChild(this.el.nativeElement, video);
  }
}
