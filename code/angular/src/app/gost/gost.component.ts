import { Component, OnInit } from '@angular/core';
import {ScriptService} from "ngx-script-loader";
import { Employee } from '../models/employee';
import { Clinic } from '../models/clinic';
import {NavbarComponent} from "../navbar/navbar.component";
import {ClientService} from "../services/client.service";
import {Appointment} from "../models/appointment";
import Chart from 'chart.js/auto';
// import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-gost',
  standalone: true,
    imports: [
        NavbarComponent
    ],
  templateUrl: './gost.component.html',
  styleUrl: './gost.component.css'
})
export class GostComponent implements OnInit {

  clinics : Clinic[] = []

  currentIndex = 0

  next(){
  if(this.currentIndex+1<this.clinics.length)
    this.currentIndex += 1;
  }

  previous(){
  if(this.currentIndex-1>=0)
    this.currentIndex -= 1;
  }

  histogram: {[key: number]: number} = {};
  chart = {};
  months = [
      'Januar',
      'Februar',
      'Marec',
      'April',
      'Maj',
      'Junij',
      'Julij',
      'Avgust',
      'September',
      'Oktober',
      'November',
      'December'];

  numberMonthsToWords(monthNumber: string[]){
    return monthNumber.map((i: string) => {
        const j = parseInt(i);
        return this.months[j];
    })
  }

    updateChart() {
        //@ts-ignore
        this.chart.data.labels! = this.numberMonthsToWords(Object.keys(this.histogram));
        //@ts-ignore
        this.chart.data.datasets[0].data! = Object.values(this.histogram);
        //@ts-ignore
        this.chart.update()!;
    }
  constructor(private scriptService: ScriptService, private clientService : ClientService) {

    this.clientService.getClinics().subscribe({
        next: (payload: Clinic[]) => {
            this.clinics = payload;
        },
        error: (err) => {
            console.error('Error getting data', err);
        }
    })

    this.scriptService.loadScript('https://kit.fontawesome.com/132ed136f5.js').subscribe((e) => {
    })

      this.clientService.getAppointments().subscribe({
          next: (payload: Appointment[]) => {
              const today = new Date();
              const threeMonthsAgo = new Date();
              threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

              const currentDate = new Date();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();

              payload.forEach(appointment => {
                  const appointmentDate = new Date(appointment.date);
                  const appointmentMonth = appointmentDate.getMonth();
                  const appointmentYear = appointmentDate.getFullYear();

                  if ((appointmentYear === currentYear && appointmentMonth > currentMonth - 3) ||
                      (appointmentYear === currentYear - 1 && currentMonth < 3 && appointmentMonth > 9)) {
                      this.histogram[appointmentMonth] = (this.histogram[appointmentMonth] || 0) + 1;
                  }
              });

              this.updateChart();
          },
          error: (err) => {
              console.error('Error getting data', err);
          }
      });

    this.scriptService.loadScript('https://cdn.jsdelivr.net/npm/chart.js').subscribe(() => {
        const ctx = document.getElementById('chart');
        const data = {
            labels: this.numberMonthsToWords(Object.keys(this.histogram)),
            datasets: [{
                label: '',
                data: Object.entries(this.histogram),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)'
                ]
            }]
        };

        const config = {
            type: 'polarArea',
            data: data,
            options: {}
        };
        // @ts-ignore
        this.chart = new Chart(ctx, config);
  })
}

    draw_canvas(){
        const ctx = document.getElementById('chart');
        console.log(this.numberMonthsToWords(Object.keys(this.histogram)));
        console.log(this.histogram);
        const data = {
            labels: this.numberMonthsToWords(Object.keys(this.histogram)),
            datasets: [{
                label: '',
                data: Object.values(this.histogram),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)'
                ]
            }]
        };

      const config = {
          type: 'polarArea',
          data: data,
          options: {}
      };

    if (this.chart) {
        // @ts-ignore
        this.chart.data.datasets[0].data = Object.values(this.histogram);
        // @ts-ignore
        this.chart.update();
    } else {
        // @ts-ignore
        this.chart = new Chart(ctx, config);
    }
  }

ngOnInit(){

}

}
