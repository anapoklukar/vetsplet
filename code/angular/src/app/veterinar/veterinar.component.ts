import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {KoledarComponent} from "../koledar/koledar.component";
import {Client} from "../models/client";
import {Employee} from "../models/employee";
import {ClientService} from "../services/client.service";
import {Router} from "@angular/router";
import {filter, Subscription} from "rxjs";
import {VeterinarService} from "../services/veterinar.service";
import {Appointment} from "../models/appointment";
import {Clinic} from "../models/clinic";
import {AppointmentData} from "../models/appointmentData";
import {Patient} from "../models/patient";
import {ScriptService} from "ngx-script-loader";
import {CommonModule} from "@angular/common";
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-veterinar',
  standalone: true,
  imports: [
    KoledarComponent,
      CommonModule
  ],
  templateUrl: './veterinar.component.html',
  styleUrls: ['./veterinar.component.css', 'fonts.css'],
})

export class VeterinarComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();

  selectedDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate()
  }

  clients: Client[] = []

  notCompleteAppointmentIndex = 0
  notCompleteAppointments: {
    appointmentId: string
    clientName: string,
    patientName: string,
    date: string
  }[] = []

  selectedDoctor = ''
  selectedSchedule = 'zasebno'

  appointments : Appointment[] = [];
  employeeAppointments : Appointment[] = [];
  requestedVets: Employee[] = []

  days = ['NED', 'PON', 'TOR', 'SRE', 'ČET', 'PET', 'SOB'];
  appointmentTypes = ['Pregled', 'Pranje','Higiena', 'styling', 'kastracija', 'sterelizacija', 'bloodtest', 'vakcinacija', 'operacije', 'zunajneP', 'notrajneP', 'posvetovanje']

  clinic : Clinic = {
    name: '',
    address: '',
    owner: '',
    _id: '',
    employees: [],
    email: '',
    telNumber: '',
    description: '',
  }

  employee : Employee = {
    name: 'Loading...',
    surname: '',
    profession: '',
    clinic: '',
    status: '',
    isOwner: false,
    telNumber: '',
    email: '',
    username: '',
    password: '',
    _id: ''
  };

  appointmentSlectedRequestId = ''

  getNotCompleteAppointments() {

    this.notCompleteAppointments = []

    let apps: {
      appId: string,
      userId: string,
      patientId: string,
      date: string,
      time: string
    }[] = []

    if(this.notCompleteAppointmentIndex == 0) {
      apps = this.appointments.filter((app: Appointment) => {
        return app.vetAppId == 11 && app.status != 'complete'
      }).map((app: Appointment) => {
        return {
          appId: app._id,
          userId: app.clientId,
          patientId: app.patientId,
          date: this.getDateFromISO(app.date),
          time: this.getTimeFromISO(app.date)
        }
      })
    } else if(this.notCompleteAppointmentIndex == 1) {
      apps = this.appointments.filter((app: Appointment) => {
        return app.vetAppId == 8 && app.status != 'complete'
      }).map((app: Appointment) => {
        return {
          appId: app._id,
          userId: app.clientId,
          patientId: app.patientId,
          date: this.getDateFromISO(app.date),
          time: this.getTimeFromISO(app.date)
        }
      })
    } else if(this.notCompleteAppointmentIndex == 2) {
      apps = this.appointments.filter((app: Appointment) => {
        return app.vetAppId == 9 && app.status != 'complete'
      }).map((app: Appointment) => {
        return {
          appId: app._id,
          userId: app.clientId,
          patientId: app.patientId,
          date: this.getDateFromISO(app.date),
          time: this.getTimeFromISO(app.date)
        }
      })
    } else if(this.notCompleteAppointmentIndex == 3) {
      apps = this.appointments.filter((app: Appointment) => {
        return app.vetAppId == 10 && app.status != 'complete'
      }).map((app: Appointment) => {
        return {
          appId: app._id,
          userId: app.clientId,
          patientId: app.patientId,
          date: this.getDateFromISO(app.date),
          time: this.getTimeFromISO(app.date)
        }
      })
    }

    apps.forEach((app, i) => {
      let promise = new Promise((resolve, reject) => {
        this.veterinarService.getClient(app.userId).subscribe({
          next: (payload: Client) => {
            //console.log('payload:', payload);
            resolve({appId: app.appId ,client: payload, patientId: app.patientId, date: app.date, time: app.time, index: i});
          },
          error: (err) => {
            console.error('Error getting client data', err);
            reject(err);
          }
        });
      });

      promise.then((resp) => {
        //console.log(resp);
        // @ts-ignore
        let client = resp.client;
        // @ts-ignore
        let petId = resp.patientId;
        // @ts-ignore
        let date = resp.date;
        // @ts-ignore
        let time = resp.time;
        // @ts-ignore
        let i = resp.index;
        // @ts-ignore
        let appId = resp.appId;

        this.notCompleteAppointments[i] = {
          appointmentId: appId,
          clientName: `${client.name} ${client.surname}`,
          patientName: `${client.patients.find((pet: Patient) => pet._id == petId).name}`,
          date: `${date} ${time}`
        };
      }).catch((err) => {
        console.log("There was an error:", err);
      });
    });
  }

  acceptAppointmentRequest() {
    console.log("id:", this.appointmentSlectedRequestId)
    if(!this.appointmentSlectedRequestId) return

    let app = this.appointments.find((app: Appointment) => {
      return app._id == this.appointmentSlectedRequestId
    })

    if(app == undefined) return

    const obj = {
      "vetAppId": app.vetAppId,
      "grAppId": 0,
      "date": app.date,
      "dateCreated": app.dateCreated,
      "doctorsNote": app.doctorsNote,
      "clientId": app.clientId,
      "patientId": app.patientId,
      "clinicId": app.clinicId,
      "employeeId": app.employeeId,
      "status": this.statusCompleteMessage
    }

    this.veterinarService.updateAppointment(app._id, obj).subscribe({
      next: (payload: Appointment) => {
        console.log('updated appointment:', payload);
        // @ts-ignore
        app.status = this.statusCompleteMessage
      },
      error: (err) => {
        console.error('Error getting client data', err);
      }
    });
  }

  showLoginBool = false

  stateChangLoginPopup() {
    this.showLoginBool = !this.showLoginBool
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/'])
  }

  updateUserInfo() {
    var clientuser = document.getElementById("profileNameInput") as HTMLInputElement
    var clientemail = document.getElementById("profileEmailInput") as HTMLInputElement
    var clientphone = document.getElementById("profilePhoneInput") as HTMLInputElement
    var clientpass = document.getElementById("profilerepasswordnewInput") as HTMLInputElement
    // TODO: UPDATE AND CHECK WHAT THE RESULT IS, IF THE UPDATE CAN GO THROUGH

    console.log('cli email', clientemail.value)

    let x: {
      telNumber?: string
      username?: string
      email?: string
    } = {
    }

    if(this.employee.username != clientuser.value) {
      x.username = clientuser.value
    }

    if(this.employee.email != clientemail.value) {
      x.email = `${clientemail.value}`
    }

    if(this.employee.telNumber != clientphone.value) {
      x.telNumber = clientuser.value
    }

    if(Object.keys(x).length === 0) return

    console.log("updating:", x)

    this.employee.username = clientuser.value
    this.employee.email = clientemail.value
    this.employee.telNumber = clientphone.value



    this.subscriptions.add(
        this.veterinarService.updateEmployee(this.clinic._id, this.employee._id, x).subscribe({
          next: () => {
            this.changeDetector.detectChanges;
          },
          error: (err: any) => {
            console.log('Error: ' + JSON.stringify(err, null, 2));
          }
        })
    );


    this.stateChangLoginPopup()
  }

  cancelAppointmentRequest() {
    if(!this.appointmentSlectedRequestId) return

    let app = this.appointments.find((app: Appointment) => {
      return app._id == this.appointmentSlectedRequestId
    })

    if(app == undefined) return

    this.veterinarService.deleteAppointment(app._id).subscribe({
      next: () => {
        console.log('deleted appointment');

        let app = this.appointments.find((app: Appointment) => {
          return app._id == this.appointmentSlectedRequestId
        })

        console.log('app', app)

        let appIndex = this.appointments.findIndex((app: Appointment) => {
          return app._id == this.appointmentSlectedRequestId
        })

        console.log('appIndex', appIndex)

        let element = document.querySelector(`[data-appId='${app!._id}']`);
        console.log('element', element)
        element!.remove()
        this.appointments.splice(appIndex,1)

        this.getNotCompleteAppointments()
        this.closeAcceptModal()
      },
      error: (err) => {
        console.error('Error getting client data', err);
      }
    });
  }

  getDayName() {
    const date = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.date)
    return this.days[date.getDay()]
  }

  OpenAcceptModal(appointmentId: string) {
    document.getElementById('popupReq1')!.classList.add('show')
    this.appointmentSlectedRequestId = appointmentId
  }

  closeAcceptModal() {
    document.getElementById('popupReq1')!.classList.remove('show')
  }

  monthToString(month: number) : string {
    switch (month) {
      case 1:
        return 'Januar'
      case 2:
        return 'Februar'
      case 3:
        return 'Marec'
      case 4:
        return 'April'
      case 5:
        return 'Maj'
      case 6:
        return 'Junij'
      case 7:
        return 'Julij'
      case 8:
        return 'Avgust'
      case 9:
        return 'September'
      case 10:
        return 'Oktober'
      case 11:
        return 'November'
      default:
        return 'December'
    }
  }

  selectedDayToString() {
    return `${this.selectedDate.date}. ${this.monthToString(this.selectedDate.month)} ${this.selectedDate.year}`
  }

  calendarOnClickEvent(e: any) {
    //console.log(this.selectedDate)
    const cell = e.target.closest('td');
    if (!cell) {return;}

    this.selectedDate = {
      year: parseInt(cell.dataset.year),
      month: parseInt(cell.dataset.month),
      date: parseInt(cell.dataset.date)
    }
    this.getAppointmentsFromCurrentDate()
  }

  setSchedule(selected: string) {
    this.selectedSchedule = selected
    this.getAppointmentsFromCurrentDate()
    //console.log("done")
  }

  getAppointmentName(id: any): string {
    // @ts-ignore
    return this.appointmentTypes[id]
  }

  openNotif() {
    document.getElementById('alertPopup')!.classList.add('show')
  }

  closeNotif() {
    document.getElementById('alertPopup')!.classList.remove('show')
  }

  appendChildAtIndex(parent: any, child: any, index: any) {
    // Check if the specified index is greater than the number of children
    //console.log(index, " >= ", parent.children.length)
    if (index < parent.children.length) {
      // If the index is greater than the number of children, append the child at the end
      let newChild = parent.children[index];
      parent.insertBefore(child, newChild);
    } else {
      // Otherwise, insert the child before the child currently at the specified index
      parent.insertBefore(child, parent.children[index]);
    }
  }
  getRequestedVets() {
    //console.log(this.clinic.name)
    this.requestedVets = this.clinic.employees.filter((emp: Employee) => {
      return emp.status != 'sprejeto' && emp.status != 'confirmed'
    })

    const alertPopup = document.getElementById('alertPopup')
    alertPopup!.innerHTML = ''

    /*

    <div class="pointer" (click)="closeNotif()">
                          <i
                                  class="fa-solid fa-x"
                                  style="
                                margin-top: 10px;
                                margin-right: 10px;
                                float: right;
                              "
                          ></i>
                        </div>

     */

    const pointer = this.renderer.createElement('div')
    this.renderer.addClass(pointer, 'pointer')
    this.renderer.listen(pointer, 'click', () => this.closeNotif());

    const icon = this.renderer.createElement('i')
    this.renderer.addClass(icon, 'fa-solid')
    this.renderer.addClass(icon, 'fa-x')
    this.renderer.setStyle(icon, 'margin-top', '10px')
    this.renderer.setStyle(icon, 'margin-right', '10px')
    this.renderer.setStyle(icon, 'float', 'right')

    this.renderer.appendChild(pointer, icon)
    this.renderer.appendChild(alertPopup, pointer)

    this.requestedVets.forEach((vet: Employee, i: number) => {
      const outerAlert = this.renderer.createElement('div')
      this.renderer.addClass(outerAlert, 'alert')
      this.renderer.addClass(outerAlert, 'alert-success')

      const vetName = this.renderer.createText(`${vet.name} ${vet.surname}`)

      const acceptButton = this.renderer.createElement('button')
      this.renderer.addClass(acceptButton, 'btn')
      this.renderer.addClass(acceptButton, 'btn-secondary')
      this.renderer.setStyle(acceptButton, 'float', 'right')
      this.renderer.listen(acceptButton, 'click', () => this.acceptEmployee(vet._id, i));

      const denyButton = this.renderer.createElement('button')
      this.renderer.addClass(denyButton, 'btn')
      this.renderer.addClass(denyButton, 'btn-secondary')
      this.renderer.setStyle(denyButton, 'float', 'right')
      this.renderer.listen(denyButton, 'click', () => this.denyEmployee(vet._id, i));

      this.renderer.appendChild(acceptButton, this.renderer.createText('Accept'))
      this.renderer.appendChild(denyButton, this.renderer.createText('Deny'))

      this.renderer.appendChild(outerAlert, vetName)
      this.renderer.appendChild(outerAlert, acceptButton)
      this.renderer.appendChild(outerAlert, denyButton)


      this.renderer.appendChild(alertPopup, outerAlert)
    })
  }

  removeAlert(i: number) {
    this.clinic.employees.splice(i, 1);
  }

  acceptEmployee(employeeId: string, i: number) {
    /*("ahhh, ye", this.clinic.employees.find((vet: Employee) => {
      return vet._id == employeeId
    }))*/
    this.veterinarService.confirmEmployee(this.clinic._id, employeeId).subscribe({
      next: () => {
        //console.log("employee accepted")
        this.clinic.employees.find((vet: Employee) => {
          return vet._id == employeeId
        })!.status = 'sprejeto'
        this.getRequestedVets()
      },
      error: (err) => {
        console.error('Error getting additional info', err);
      }
    });
  }

  denyEmployee(employeeId: string, i: number) {
    this.veterinarService.deleteEmployee(this.clinic._id, employeeId).subscribe({
      next: () => {
        //console.log("employee denied")
        this.removeAlert(this.clinic.employees.findIndex((vet: Employee) => {
          return vet._id == employeeId
        }))
        this.getRequestedVets()
      },
      error: (err) => {
        console.error('Error getting additional info', err);
      }
    });
  }

  moveIkone(e: any) {
    let parent = e.currentTarget.parentElement.parentElement!;

    if(e.currentTarget.id == 'selected') {
      return;
    }


    this.notCompleteAppointmentIndex = parseInt(e.currentTarget.dataset.index)
    this.getNotCompleteAppointments()
    //console.log('Not Complete Index:', this.notCompleteAppointmentIndex)

    //console.log(parent)
    const selected = document.getElementById("selected")!
    const notsel = document.getElementById('not-selected')!
    //console.log('selected:', selected)
    //console.log('ikone:', notsel)
    selected.id = ''

    let index = 0; // Default to append at the end

    for (let i = 0; i < notsel.children.length; i++) {
      // @ts-ignore
      let childIndex = parseInt((notsel.children[i] as HTMLElement).dataset.index, 10);
      // @ts-ignore
      let selectedIndex = parseInt(selected.dataset.index, 10);

      //console.log(childIndex, ' > ', selectedIndex);

      if(childIndex > selectedIndex) {
        index = i;
        break;
      }
    }

    this.appendChildAtIndex(notsel, selected, index);
    //notsel.prepend(selected)
    e.currentTarget.id = 'selected'

    parent.prepend(e.currentTarget);
  }

  shownApps: AppointmentData[] = []

  getDateFromISO(date: string) {
    return date.split('T')[0]
  }

  getTimeFromISO(date: string) {
    const time = date.split('T')[1]
    if(time == undefined) return ''
    const splitTime = time.split(':')
    return `${splitTime[0]}:${splitTime[1]}`
  }

  statusCompleteMessage = 'accepted'

  getAvailableClients() {
    return this.clinic.employees.filter((vet: Employee) => {
      return vet.status == 'sprejeto'
    })
  }

  getAppointmentsFromCurrentDate() {
    this.shownApps = []
    if(this.selectedSchedule == 'zasebno') {
      const apps = this.employeeAppointments.filter((appointment: Appointment) => {
        const appDate = appointment.date.split('T')[0].split('-')
        if (appointment.status != this.statusCompleteMessage && [8,9,10,11].includes(appointment.vetAppId!)) {
          return false
        }
        //console.log(appDate[2] == this.selectedDate.date.toString())
        return appDate[2] == this.selectedDate.date.toString()
            && appDate[1] == this.selectedDate.month.toString()
            && appDate[0] == this.selectedDate.year.toString()
      })

      apps.forEach((app, i) => {
        this.shownApps[i] = {
          'client': {
            '_id': '',
            'name': '',
            'surname': '',
            'telNumber': '',
            'email': '',
            'username': '',
            'password': '',
            'patients': [],
            'ethAddress': ''
          },
          'patient': {
            name: '',
            age: 0,
            gender: '',
            chip: false
          },
          'employee': this.employee,
          'appointment': apps[i]
        }
      })

      Promise.all(apps.map((app, i) =>
          Promise.all([
            new Promise((resolve, reject) => {
              this.veterinarService.getClient(app.clientId).subscribe({
                next: (payload: Client) => resolve(payload),
                error: (err) => {
                  console.error('Error getting client data', err);
                  reject(err);
                }
              });
            }),
            new Promise((resolve, reject) => {
              this.veterinarService.getPatients(app.clientId).subscribe({
                next: (payload: Patient[]) => {
                  const x = payload.find((patient: Patient) => {
                    return patient._id == app.patientId
                  })
                  if (x) {
                    resolve(x)
                  } else if (payload.length >= 1) {
                    resolve(payload[0])
                  } else {
                    resolve(undefined)
                  }

                },
                error: (err) => {
                  console.error('Error getting additional info', err);
                  reject(err);
                }
              });
            })
          ])
              .then(([clientPayload, patientsPayload]) => {
                // @ts-ignore
                this.shownApps[i].client = clientPayload;
                // @ts-ignore
                this.shownApps[i].patient = patientsPayload;
              })
              .catch((err) => {
                console.error('Error with one of the calls for app:', app, err);
              })
      ))
          .then(() => {
            //console.log('All data loaded:', this.shownApps);
          })
          .catch((error) => {
            console.error('Error loading data for some apps:', error);
          });


      //console.log("Done Calculating")
    } else {
      const apps = this.appointments.filter((appointment: Appointment) => {
        const appDate = appointment.date.split('T')[0].split('-')
        //console.log(appDate[2] == this.selectedDate.date.toString())
        if (appointment.status != this.statusCompleteMessage && [8,9,10,11].includes(appointment.vetAppId!)) {
          return false
        }
        return appDate[2] == this.selectedDate.date.toString() && appDate[1] == this.selectedDate.month.toString() && appDate[0] == this.selectedDate.year.toString()
      })

      apps.forEach((app, i) => {
        this.shownApps[i] = {
          'client': {
            '_id': '',
            'name': '',
            'surname': '',
            'telNumber': '',
            'email': '',
            'username': '',
            'password': '',
            'patients': [],
            'ethAddress': ''
          },
          'patient': {
            name: '',
            age: 0,
            gender: '',
            chip: false
          },
          'employee': {
            _id: '',
            profession: '',
            name: '',
            surname: '',
            telNumber: '',
            email: '',
            username: '',
            password: '',
            clinic: '',
            status: '',
            isOwner: false
          },
          'appointment': apps[i]
        }
      })


      Promise.all(apps.map((app, i) =>
          Promise.all([
            new Promise((resolve, reject) => {
              this.veterinarService.getClient(app.clientId).subscribe({
                next: (payload: Client) => resolve(payload),
                error: (err) => {
                  console.error('Error getting client data', err);
                  reject(err);
                }
              });
            }),
            new Promise((resolve, reject) => {
              this.veterinarService.getPatients(app.clientId).subscribe({
                next: (payload: Patient[]) => {
                  const x = payload.find((patient: Patient) => {
                    return patient._id == app.patientId
                  })
                  if (x) {
                    resolve(x)
                  } else if (payload.length >= 1) {
                    resolve(payload[0])
                  } else {
                    resolve(undefined)
                  }

                },
                error: (err) => {
                  console.error('Error getting additional info', err);
                  reject(err);
                }
              });
            })
          ])
              .then(([clientPayload, patientsPayload]) => {
                // Both API calls have completed at this point
                let selectedEmployee = this.clinic.employees.find((employee: Employee) => {
                  return app.employeeId == employee._id
                })

                if(selectedEmployee != undefined) {
                  this.shownApps[i].employee = selectedEmployee
                } else {
                  this.shownApps[i].employee = this.employee
                }

                // @ts-ignore
                this.shownApps[i].client = clientPayload;
                // @ts-ignore
                this.shownApps[i].patient = patientsPayload;
              })
              .catch((err) => {
                console.error('Error with one of the calls for app:', app, err);
              })
      ))
          .then(() => {
            //console.log('All data loaded:', this.shownApps);
          })
          .catch((error) => {
            console.error('Error loading data for some apps:', error);
          });


      //console.log("Done Calculating")

    }
  }
  constructor(private el: ElementRef, private renderer: Renderer2, private appref: ApplicationRef, private cdr: ChangeDetectorRef, private scriptService: ScriptService, private veterinarService : VeterinarService, private changeDetector: ChangeDetectorRef,private router : Router, private web3Service: Web3Service) {
    this.scriptService.loadScript('https://kit.fontawesome.com/132ed136f5.js').subscribe((e) => {
      // just needed to load???
    })

    //console.log("auth_tok:", localStorage.getItem('auth_token'))

    this.getAppointmentsFromCurrentDate()

  }

  selectedSearchType = 'client'

  onSearchTypeChange(e: any) {
    const inputValue = (e.target as HTMLInputElement).value;
    this.selectedSearchType = inputValue
  }

  searchedResults: {
    name: string,
    type: string,
    date: string
  }[] = []

  searchPopupContent: string[] = []

  searchClientObjects: Client[] = []
  searchSelectedClient: Client | undefined = undefined
  searchSelectedPatient: Patient | undefined = undefined

  inputSearch(e: any) {
    const inputValue = (e.target as HTMLInputElement).value;
    if(this.selectedSearchType == 'client') {
      this.searchClientObjects = this.filterClients(inputValue).slice(0, 5)
      this.searchPopupContent = this.searchClientObjects.map((user: Client) => {
        return `${user.name} ${user.surname}`
      })
    }
  }

  selectSearch(i: number) {
    if(this.selectedSearchType == 'client') {
      this.searchSelectedClient = this.searchClientObjects[i];
      if(this.searchSelectedClient.patients.length > 0) {
        this.searchSelectedPatient = this.searchSelectedClient.patients[0]
      }
      (document.getElementById('sortiraj') as HTMLInputElement).value = `${this.searchSelectedClient?.name} ${this.searchSelectedClient?.surname}`
    }
  }

  searchSelectPet(e: any) {
    const inputValue = parseInt((e.target as HTMLInputElement).value);
    this.searchSelectedPatient = this.searchSelectedClient?.patients[inputValue]
  }

  getSearchedUserPatients() {
    if(this.searchSelectedClient == undefined) {
      return []
    }

    return this.searchSelectedClient.patients
  }

  getSearchResults(): {name: string, type: string, date: string}[] {
    if(this.selectedSearchType == 'client') {
      return this.appointments.filter((app: Appointment) => {

        if(this.searchSelectedPatient != undefined) {
          return app.clientId == this.searchSelectedClient?._id && app.patientId == this.searchSelectedPatient._id
        }
        return app.clientId == this.searchSelectedClient?._id
      }).map((app: Appointment) => {

        const datesplit = app.date.split('T')
        const date = datesplit[0]
        console.log(datesplit[1])

        let time = ["",""]
        if(datesplit[1] != undefined){
          time = datesplit[1].split(':')
        }

        const datetime = `${date} ${time[0]}:${time[1]}`

        const patient = this.searchSelectedClient?.patients.find((patient: Patient) => {
          return patient._id == app.patientId
        })

        // @ts-ignore
        return {name: patient.name, type: this.appointmentTypes[app.vetAppId], date: datetime}
      })
    }

    return []
  }

  onSearchFocus() {
    document.getElementById('clientSearchPopup2')!.style.display = 'block'
  }

  onSearchBlur() {
    setTimeout(() => {
      document.getElementById('clientSearchPopup2')!.style.display = 'none'
    }, 150)
  }
  searchedClients: Client[] = []
  searchClientNames(e: any) {
    const inputValue = (e.target as HTMLInputElement).value;
    this.searchedClients = this.filterClients(inputValue)
  }

  filterClients(term: string): Client[] {
    return this.clients.filter(object => (object.name + ' ' + object.surname).toLowerCase().includes(term.toLowerCase())).slice(0, 5);
  }

  onClientSearchFocus() {
    document.getElementById('clientSearchPopup')!.style.display = 'block'
  }

  onClientSearchBlur() {
    setTimeout(() => {
      document.getElementById('clientSearchPopup')!.style.display = 'none'
    }, 150)
  }

  selectedClient: Client | undefined = undefined

  selectClient(data: Client) {
    (document.getElementById('lastnik') as HTMLInputElement)!.value = `${data.name} ${data.surname}`
    this.selectedClient = data

    if(this.selectedClient.patients.length > 0) {
      this.selectedPatient = this.selectedClient.patients[0]._id!
    }
  }

  selectAppointmentType(e: any) {
    const inputValue = (e.target as HTMLInputElement).value;
  }

  getClientPatients() {
    if(this.selectedClient == undefined) {
      return []
    } else {
      return this.selectedClient.patients
    }
  }

  selectedPatient = ''

  changePatient(e:any) {
    const selectedId = (e.target as HTMLSelectElement).value;
    this.selectedPatient = selectedId
  }

  onDoctorSelect(e: any) {
    const selectedId = (e.target as HTMLSelectElement).value;
    this.selectedDoctor = selectedId
  }

  deleteAppointment(appId: string) {
    //console.log("storage:", localStorage.getItem('auth_token'))

    // delete tokens
    let tokensRemoved = 2
    // giving the tokens to the client
    // firstly getting the address of the client
    this.veterinarService.getClient(this.appointments.find((app: Appointment) => {
      return app._id == appId
    })!.clientId).subscribe({
      next: (payload: Client) => {
        console.log('payload:', payload);
        // @ts-ignore
        let client = payload;
        // @ts-ignore
        let clientAddress = client.ethAddress;
        console.log("client address:", clientAddress)

        // giving the tokens to the client
        this.web3Service.givingTokens(tokensRemoved, clientAddress).then((result) => {
          console.log("tokens given:", result)
        }
        ).catch((err) => {
          console.log("error:", err)
        });
      },
      error: (err) => {
        console.error('Error getting client data', err);
      }
    });

    //console.log("appId:", appId)
    this.veterinarService.deleteAppointment(appId).subscribe({
      next: () => {
        let index = this.appointments.findIndex(obj => obj._id === appId);

        if (index !== -1) {
          this.appointments.splice(index, 1);
        }

        let index2 = this.employeeAppointments.findIndex(obj => obj._id === appId);

        if (index2 !== -1) {
          this.employeeAppointments.splice(index2, 1);
        }

        this.cdr.detectChanges()

        this.getAppointmentsFromCurrentDate()
      },
      error: (err) => {
        console.error('Error getting data', err);
      }
    })
  }

  createAppointment() {
    if(this.selectedClient != undefined && this.selectedDoctor != '' && this.selectedPatient != '') {
      const today = new Date()
      let todayMinutes = today.getMinutes().toString()
      if(parseInt(todayMinutes) < 10) {
        todayMinutes = `0${todayMinutes}`
      }

      let doctorsNote = (document.getElementById('opombe') as HTMLInputElement).value
      let apptype = parseInt((document.getElementById('naročen') as HTMLInputElement).value)

      const val = (document.getElementById('ura') as HTMLInputElement).value
      // 2024-01-05T15:30:00
      let app = {
        "vetAppId": apptype,
        "grAppId": 1,
        "date": `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.date}T${val}:00`,
        "dateCreated": `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}T${today.getHours()}:${todayMinutes}:${today.getSeconds()}`,
        "doctorsNote": doctorsNote,
        "clientId": this.selectedClient._id,
        "patientId": this.selectedPatient,
        "clinicId": this.clinic._id,
        "employeeId": this.selectedDoctor
      }

      this.veterinarService.createAppointment(app).subscribe({
        next: (payload: Appointment) => {
          //console.log(payload)
          if(this.employee._id == payload.employeeId) {
            this.employeeAppointments.push(payload)
          }
          this.appointments.push(payload)

          this.cdr.detectChanges()

          this.getAppointmentsFromCurrentDate()
        },
        error: (err) => {
          console.error('Error getting data', err);
        }
      })
    }
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.veterinarService.getEmployee(localStorage.getItem('id'), localStorage.getItem('clinicId')).subscribe({
        next: (payload: Employee) => {
          this.employee = payload;
          //console.log('employee:', this.employee)
          this.changeDetector.detectChanges;
        },
        error: (err) => {
          console.error('Error getting data', err);
        }
      })
    );

    this.subscriptions.add(
      this.veterinarService.getClinic(localStorage.getItem('clinicId')).subscribe({
        next: (payload: Clinic) => {
          this.clinic = payload;
          this.selectedDoctor = this.clinic.employees[0]._id
          //console.log("doctor:", this.selectedDoctor, this.clinic.employees[0].name)
          //console.log('clinic:', this.clinic)
          this.changeDetector.detectChanges;
          this.getRequestedVets()
        },
        error: (err) => {
          console.error('Error getting data', err);
        }
      })
    );

    this.subscriptions.add(
        this.veterinarService.getAllClients().subscribe({
          next: (payload: Client[]) => {
            this.clients = payload
          },
          error: (err) => {
            console.error('Error getting data', err);
          }
        })
    );

    this.subscriptions.add(
      this.veterinarService.getAppointments().subscribe({
        next: (payload: Appointment[]) => {
          this.appointments = (payload as Appointment[]);

          const clinicId = localStorage.getItem('clinicId');

          this.appointments = this.appointments.filter((appointment) => {
            return appointment.clinicId == clinicId
          })

          this.employeeAppointments = this.appointments.filter((appointment) => {
            return appointment.employeeId == localStorage.getItem('id')
          })

          //console.log('apps:', this.appointments)
          //console.log('employee apps:', this.employeeAppointments)

          this.getAppointmentsFromCurrentDate()
          this.getNotCompleteAppointments()

          this.changeDetector.detectChanges;
        },
        error: (err) => {
          this.appointments = [];
          console.error('Error getting data', err);
        }
      })
    );

  }
}
