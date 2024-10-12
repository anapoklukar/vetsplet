import {Component, Input} from '@angular/core';
import {ScriptService} from "ngx-script-loader";
import {Clinic} from "../models/clinic";
import {Employee} from "../models/employee";

@Component({
  selector: 'app-carousel-item',
  standalone: true,
  imports: [],
  templateUrl: './carousel-item.component.html',
  styleUrl: './carousel-item.component.css'
})
export class CarouselItemComponent {
    @Input() clinic1: Clinic | undefined;
    @Input() clinic2: Clinic | undefined;
    constructor(private scriptService: ScriptService) {
        this.scriptService.loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.min.js').subscribe(() => {

        })
        
    }
}
