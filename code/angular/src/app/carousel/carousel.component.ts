import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Clinic} from "../models/clinic";
import {ScriptService} from "ngx-script-loader";
import {Employee} from "../models/employee";
import {ClientService} from "../services/client.service";
import { LocalStorageService } from '../local-storage.service';
import {timeout} from "rxjs";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, AfterViewInit {
    @ViewChild('items') itemsElem: ElementRef | undefined;

    clinics: Clinic[] = [
        {
            _id: "1",
            owner: "Owner1",
            name: "Clinic 1",
            address: "Address 1",
            telNumber: "123-456-7890",
            email: "clinic1@example.com",
            description: "Description for Clinic 1",
            employees: [],
        },
        {
            _id: "2",
            owner: "Owner2",
            name: "Clinic 2",
            address: "Address 2",
            telNumber: "987-654-3210",
            email: "clinic2@example.com",
            description: "Description for Clinic 2",
            employees: [],
        },
        {
            _id: "3",
            owner: "Owner3",
            name: "Clinic 3",
            address: "Address 3",
            telNumber: "111-222-3333",
            email: "clinic3@example.com",
            description: "Description for Clinic 3",
            employees: [],
        },
        {
            _id: "4",
            owner: "Owner4",
            name: "Clinic 4",
            address: "Address 4",
            telNumber: "555-666-7777",
            email: "clinic4@example.com",
            description: "Description for Clinic 4",
            employees: [],
        },
    ]

    carouselBackgroundImages = [
        "assets/images/icons/carouselHeaderGreen.png",
        "assets/images/icons/carouselHeaderViolet.png",
        "assets/images/icons/carouselHeaderPink.png"
    ];
    carouselBackgroundColors = [
        "#e8f2f0",
        "#E8E9F9",
        "#F6EEF4"
    ];

    constructor(
        private scriptService: ScriptService,
        private clientService : ClientService,
        private localStorage: LocalStorageService,
        private renderer: Renderer2,
        private el: ElementRef
    ) {
        this.scriptService.loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js').subscribe(() => {

        })

        this.scriptService.loadScript('https://kit.fontawesome.com/132ed136f5.js').subscribe((e) => {
            // just needed to load???
        })
    }

    ngAfterViewInit(): void {
        for(let i = 0; i < this.clinics.length; i += 2) {
            const clinic1 = this.clinics[i]
            const clinic2 = this.clinics[i + 1]
            let x = this.renderer.createElement('div')
            this.renderer.addClass(x, 'carousel-item')
            if (i == 0) {
                this.renderer.addClass(x, 'active')
            }

            let colDiv1 = this.createCard(clinic1)
            let colDiv2 = this.createCard(clinic2)
            this.renderer.appendChild(x, colDiv1);
            this.renderer.appendChild(x, colDiv2);
            this.renderer.appendChild(this.itemsElem?.nativeElement, x);
        }

    }


    ngOnInit(): void {
        this.clientService.getClinics().pipe(
            timeout(5000) // times out if no value is emitted within 5 seconds
        ).subscribe({
            next: (clinics) => {
                console.log('clinics:', clinics);
            },
            error: (err) => {
                console.log("In here?")
                console.error('An error occurred: ', err);
            }
        });
    }


    createCard(clinic: Clinic) {
        // Create outer div with class "col-md-6"
        const colDiv = this.renderer.createElement('div');
        this.renderer.addClass(colDiv, 'col-md-6');

        // Create inner div with class "card"
        const cardDiv = this.renderer.createElement('div');
        this.renderer.addClass(cardDiv, 'card');
        this.renderer.appendChild(colDiv, cardDiv)

        const randomIndex = Math.floor(Math.random() * this.carouselBackgroundImages.length);

        // Create card-header div
        const cardHeader = this.createCardHeader(clinic.name, randomIndex)
        this.renderer.appendChild(cardDiv, cardHeader)

        // Create card-body div
        const cardBody = this.createCardBody(clinic, randomIndex)
        this.renderer.appendChild(cardDiv, cardBody)

        // Append the dynamically created card to the component's native element
        return colDiv
    }

    createCardHeader(name: string, backgroundIndex: number) {
        const cardHeader = this.renderer.createElement('div')
        this.renderer.addClass(cardHeader, 'card-header')
        this.renderer.setStyle(cardHeader, 'background-image', `url(${this.carouselBackgroundImages[backgroundIndex]})`)
        const strongTitleText = this.renderer.createElement('strong')
        const titleText = this.renderer.createText(name)
        this.renderer.appendChild(strongTitleText, titleText)
        this.renderer.appendChild(cardHeader, strongTitleText)
        return cardHeader
    }

    createCardBody(clinic: Clinic, backgroundIndex: number) {
        const cardBody = this.renderer.createElement('div')
        this.renderer.addClass(cardBody, 'card-body')
        this.renderer.setStyle(cardBody, 'background-color', `${this.carouselBackgroundColors[backgroundIndex]}`)
        const location = this.createOneLineDiv('fa-map-location-dot', 'Address', clinic.address)
        const phone = this.createOneLineDiv('fa-phone', 'Phone', clinic.telNumber)
        const email = this.createOneLineDiv('fa-envelope', 'Email', clinic.email)

        const description = this.renderer.createElement('div')
        this.renderer.addClass(description, 'card-desc')

        const descriptionText = this.renderer.createText(clinic.description)
        this.renderer.appendChild(description, descriptionText)

        this.renderer.appendChild(cardBody, location)
        this.renderer.appendChild(cardBody, phone)
        this.renderer.appendChild(cardBody, email)
        this.renderer.appendChild(cardBody, description)

        return cardBody
    }

    createOneLineDiv(iconClass: string, label: string, value: string) {
        const oneLiner = this.renderer.createElement('div')
        this.renderer.addClass(oneLiner, 'oneLine')

        const icon = this.createIcon(iconClass)
        this.renderer.appendChild(oneLiner, icon)

        const title = this.createInformationRow(label, value)
        this.renderer.appendChild(oneLiner, title)

        return oneLiner
    }

    createIcon(iconClass: string): HTMLElement {
        const icon = this.renderer.createElement('i');
        this.renderer.addClass(icon, 'fa-solid');
        this.renderer.addClass(icon, iconClass);
        this.renderer.setStyle(icon, 'padding-right', '0.5vw');
        this.renderer.setStyle(icon, 'color', '#454545');
        this.renderer.setAttribute(icon, 'aria-hidden', 'true');
        return icon;
    }

    createInformationRow(label: string, value: string): HTMLElement {
        const title = this.renderer.createElement('h4')
        this.renderer.addClass(title, 'clinic-info')

        const strongElement = this.renderer.createElement('strong')
        const labelElement = this.renderer.createText(`${label}: `)

        this.renderer.appendChild(strongElement,labelElement);
        this.renderer.appendChild(title,strongElement);

        const valueText = this.renderer.createText(value)
        this.renderer.appendChild(title, valueText)
        return title;
    }
}
