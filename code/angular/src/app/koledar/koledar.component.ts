import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import {Appointment} from "../models/appointment";

@Component({
    selector: 'app-koledar',
    standalone: true,
    imports: [],
    templateUrl: './koledar.component.html',
    styleUrls: ['./koledar.component.css', 'fonts.css']
})
export class KoledarComponent implements OnInit, OnChanges {
    @Output() onClickDateEvent = new EventEmitter<any>();
    @Input() appointments: Appointment[] = []
    @Input() employeeAppointmens: Appointment[] = []

    elementId = ''
    now: any = undefined

    months = [
        "Januar",
        "Februar",
        "Marec",
        "April",
        "Maj",
        "Junij",
        "Julij",
        "Avgust",
        "September",
        "Oktober",
        "November",
        "December"
    ];

    days = [
        "PON", "TOR", "SRE",
        "ČET", "PET", "SOB", "NED"];

    currentMonth = new Date().getMonth()
    currentYear = new Date().getFullYear()

    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        let today = new Date()
        this.now = today

        this.changeMonthHeader()
        this.showCalendarHeader()
        this.showCalendar(today.getMonth(), today.getFullYear());
        this.updateRemindersClinic()
        this.updateRemindersEmployee()
    }

    changeMonthHeader() {
        let monthAndYear = document.getElementById('monthAndYear')
        let cellText = this.renderer.createText(this.months[this.currentMonth] + " " + this.currentYear);
        this.renderer.appendChild(monthAndYear, cellText);
    }

    showCalendarHeader() {
        var calendarheader = document.getElementById("thead-month")
        let row = this.renderer.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let cell = this.renderer.createElement("th");
            this.renderer.setAttribute(cell, "data-days", this.days[j])

            let cellText = this.renderer.createText(this.days[j]);
            this.renderer.appendChild(cell, cellText);
            this.renderer.appendChild(row, cell);
        }
        this.renderer.appendChild(calendarheader, row);


    }

    showCalendar(month: any, year: any) {
        let firstDay = new Date(year, month, 1).getDay() - 1;
        //let tbl = this.renderer.createElement('table');

        //this.renderer.addClass(tbl, 'calendar-body');
        var calendarbody = document.getElementById("calendar-body")
        console.log(calendarbody)
        //this.renderer.appendChild(x, tbl);

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = this.renderer.createElement("tr");
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    let cell = this.renderer.createElement("td");
                    this.renderer.appendChild(row, cell);
                } else if (date > this.daysInMonth(month, year)) {
                    break;
                } else {
                    let cell = this.renderer.createElement("td");
                    this.renderer.setAttribute(cell, "data-date", date.toString());
                    this.renderer.setAttribute(cell, "data-month", (month + 1).toString());
                    this.renderer.setAttribute(cell, "data-year", year.toString());
                    this.renderer.setAttribute(cell, "data-month_name", this.months[month]);
                    this.renderer.listen(cell, "click", (e) => {
                        this.onClickDateEvent.emit(e);
                    })
                    if (date.toString() == this.now.getDay()) {
                        this.renderer.addClass(cell, 'selected')
                    }
                    this.renderer.addClass(cell, "date-picker");

                    let reminderDiv = this.renderer.createElement('div')
                    this.renderer.addClass(reminderDiv, 'reminder-div')

                    let cellSpan = this.renderer.createElement('span')
                    let cellText = this.renderer.createText(date.toString());
                    this.renderer.appendChild(cellSpan, cellText);
                    this.renderer.appendChild(cell, cellSpan);
                    this.renderer.appendChild(cell, reminderDiv);
                    if (
                        date === this.now.getDate() &&
                        year === this.now.getFullYear() &&
                        month === this.now.getMonth()
                    ) {
                        this.renderer.addClass(cell, "selected");
                    }
                    // Check if there are events on this date
                    /*if (hasEventOnDate(date, month, year)) {
                      this.renderer.addClass(cell, "event-marker");
                      // You need to create the tooltip here
                    }*/
                    this.renderer.appendChild(row, cell);
                    date++;
                }
            }
            this.renderer.appendChild(calendarbody, row);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // React to data changes here
        console.log("changing:", changes)
        this.updateRemindersClinic()
        this.updateRemindersEmployee()
    }

    updateRemindersClinic() {
        this.appointments.forEach((app) => {
            const calendarBody = document.getElementById('calendar-body') as HTMLElement
            const appDate = app.date.split('T')[0].split('-')
            if(parseInt(appDate[1]) == this.currentMonth + 1){
                if(calendarBody.children.length > 0) {
                    const selector = `[data-date="${appDate[2]}"]`; // CSS attribute selector
                    const matchingElement = calendarBody.querySelector(selector);
                    if(matchingElement){
                        if (matchingElement.getElementsByClassName('clinic-reminder').length == 0)
                        {
                            let reminder = this.renderer.createElement('div')
                            const reminderElement = matchingElement.children[1]
                            this.renderer.addClass(reminder, "clinic-reminder");
                            this.renderer.appendChild(reminderElement, reminder);
                        }
                    }
                }
            }
        })
    }

    updateRemindersEmployee() {
        this.employeeAppointmens.forEach((app) => {
            const calendarBody = document.getElementById('calendar-body') as HTMLElement
            const appDate = app.date.split('T')[0].split('-')
            if(parseInt(appDate[1]) == this.currentMonth + 1){
                if(calendarBody.children.length > 0) {
                    const selector = `[data-date="${appDate[2]}"]`; // CSS attribute selector
                    const matchingElement = calendarBody.querySelector(selector);
                    if(matchingElement){
                        if (matchingElement.getElementsByClassName('employee-reminder').length == 0)
                        {
                            let reminder = this.renderer.createElement('div')
                            const reminderElement = matchingElement.children[1]
                            this.renderer.addClass(reminder, "employee-reminder");
                            this.renderer.appendChild(reminderElement, reminder);
                        }
                    }
                }
            }
        })
    }

    // Function to navigate to the next month
    next() {
        this.currentYear = this.currentMonth === 11 ?
            this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        document.getElementById('monthAndYear')!.innerText = ''
        document.getElementById('calendar-body')!.innerHTML = ''
        this.showCalendar(this.currentMonth, this.currentYear);
        this.changeMonthHeader()
        this.updateRemindersClinic()
        this.updateRemindersEmployee()
    }

    // Function to navigate to the previous month
    previous() {
        this.currentYear = this.currentMonth === 0 ?
            this.currentYear - 1 : this.currentYear;
        this.currentMonth = this.currentMonth === 0 ?
            11 : this.currentMonth - 1;
        document.getElementById('monthAndYear')!.innerText = ''
        document.getElementById('calendar-body')!.innerHTML = ''
        this.showCalendar(this.currentMonth, this.currentYear);
        this.changeMonthHeader()
        this.updateRemindersClinic()
        this.updateRemindersEmployee()
    }


    generate_year_range(start: any, end: any) {
        let years = "";
        for (let year = start; year <= end; year++) {
            years += "<option value='" +
                year + "'>" + year + "</option>";
        }
        return null;
    }

    daysInMonth(iMonth: any, iYear: any) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }
}
