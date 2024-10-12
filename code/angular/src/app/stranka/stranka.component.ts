import {ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {Client} from "../models/client";
import {Patient} from "../models/patient";
import {FormBuilder} from "@angular/forms";
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";
import {KoledarComponent} from "../koledar/koledar.component";
import {ScriptLoaderModule, ScriptService} from "ngx-script-loader";
import {Clinic} from "../models/clinic";
import {Employee} from "../models/employee";
import {Appointment} from "../models/appointment";
import {CarouselItemComponent} from "../carousel-item/carousel-item.component";
import { ClientService } from '../services/client.service';
import { Subscription } from 'rxjs';
import { ISOToReadablePipe } from "../pipes/isoto-readable.pipe";
import { TimePipe } from "../pipes/time.pipe";
import { DatePipe } from '../pipes/date.pipe';
import { setTimeout } from 'timers/promises';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TelNumberPipePipe } from '../tel-number-pipe.pipe';
import { Web3Service } from '../shared/services/web3.service';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-stranka',
    standalone: true,
    templateUrl: './stranka.component.html',
    styleUrls: ['./stranka.component.css'],
    imports: [
        KoledarComponent,
        CarouselItemComponent,
        CommonModule,
        ISOToReadablePipe,
        TimePipe,
        SpinnerComponent,
        DatePipe, 
        TelNumberPipePipe,
        FormsModule,
    ]
})
export class StrankaComponent implements OnInit{
    spinner = true;
    cardsToShow = [0, 1]

    randomClinics : number[] = []
    clientid : string =  ' ';
    currentSelectedPatient : Patient | null = null

    currentClinic : Clinic | null = null
    selectedDoctor = 0
    user : Client = {
        name: '',
        surname: '',
        telNumber: '',
        email: '',
        username: '',
        password: '',
        patients: [],
        _id: '',
        ethAddress: ''
    };

    appointmentTypes = ['Pregled', 'Pranje','Higiena', 'styling', 'kastracija', 'sterelizacija', 'bloodtest', 'vakcinacija']
    appointmentIds = {
        'Pregled': 0,
        'Pranje': 1,
        'Higiena': 2,
        'styling': 3,
        'kastracija': 4,
        'sterelizacija': 5,
        'bloodtest': 6,
        'vakcinacija': 7
    }

    userTokens: number = 0;
    tokensToUse: number = 0;
  
    constructor(private scriptService: ScriptService, private clientService : ClientService, private changeDetector: ChangeDetectorRef,private router : Router, private web3Service: Web3Service) {

        this.fetchFactApi()

        this.scriptService.loadScript('https://kit.fontawesome.com/132ed136f5.js').subscribe((e) => {
            // just needed to load???
        })

        this.scriptService.loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js').subscribe(() => {

        })

    }

    

    

    


    fact = ''
    randomClinic : Clinic[]= [];
    clinics : Clinic[] = [];
    appointments: Appointment[] = [];
    prevAppointments: Appointment[] = []
    futureAppointments: Appointment[] = []

    iconImages = ["cat2.png", "cat1.png", "cat3.png", "dog1.png", "dog2.png", "dog3.png"]
    colors = ["#D8EAE6", "#CDCEE8", "#ECD6E6", "#D9E9E5", "#ECD6E6", "#CDCEE8"]

    showCreatePetBool: boolean = false
    showAppointmentBool: boolean = false
    showDeleteBool: boolean = false

    showRequestBool: boolean = false

    showLoginBool: boolean = false
    private subscriptions: Subscription = new Subscription();
    



    getAvailableTimes(): string[] {
        let x = ['7:00', '8:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30']
        let y: string[] = []

        let clinicAppointments = this.appointments.filter((app) => {
            return app.clinicId == this.currentClinic!._id
        })
        let appointmentsOnDay = clinicAppointments.filter((app) => {
            let dateSplit = app.date.split('-')
            let getDay = dateSplit[2].split('T')[0]
            return this.selectedDate['date'] == getDay && this.selectedDate['month'] == dateSplit[1] && this.selectedDate['year'] == dateSplit[0]
        })
        x.forEach((s) => {
            let k: Appointment | undefined = appointmentsOnDay.find((app) => {
                let timer = app.date.split('T')
                let hms = timer[1].split(':')
                let time = hms[0] + ':' + hms[1]
                return time == s
            })

            if(k == undefined) {
                y.push(s)
            }
        })

        return y;

    }

    ngOnInit(): void {    
        this.spinner = true;
        this.changeDetector.detectChanges();
        localStorage.getItem('id') ? this.clientid = localStorage.getItem('id') : this.router.navigate(['']); localStorage.clear
        var items = document.querySelectorAll('.carousel .carousel-item')

        items.forEach((el) => {
            const minPerSlide = 2
            let next = el.nextElementSibling
            console.log(next)
            for (var i=1; i<minPerSlide; i++) {
                if (!next) {
                    next = items[0]
                }
                let cloneChild = next.cloneNode(true)
                // @ts-ignore
                el.appendChild(cloneChild.children[0])
                next = next.nextElementSibling
            }
        })
        this.subscriptions.add(
            this.clientService.getAppointments().subscribe({
              next: (payload: Appointment[]) => {
                this.appointments = payload;
                let today = new Date();

                this.appointments.forEach((app) => {
                    let appdate = new Date(app.date)
                    if(today < appdate) {
                        this.futureAppointments.push(app)
                    }
                    else {
                        this.prevAppointments.push(app)
                    }
                })
                this.changeDetector.detectChanges;
              },
              error: (err) => {
                console.error('Error getting data', err);
              }
            })
          );
          this.subscriptions.add(
            this.clientService.getClinics().subscribe({
              next: (payload: Clinic[]) => {
                this.clinics = payload;
                this.randomClinic[0] = this.clinics[0]
                this.randomClinic[1] = this.clinics[1]
                this.randomClinic[2] = this.clinics[2]
                this.randomClinic[3] = this.clinics[3]
                this.currentClinic = this.clinics[0]
                this.changeDetector.detectChanges;
            },
              error: (err) => {
                console.error('Error getting data', err);
              }
            })
            
          );
            
          this.subscriptions.add(
            this.clientService.getClient(this.clientid).subscribe({
                next: (payload: Client) => {
                  this.user = payload;
                  this.currentSelectedPatient = this.user.patients[0]
                  this.changeDetector.detectChanges;
                },
                error: (err) => {
                  console.error('Error getting data', err);
                }
              })
          );

        this.web3Service.balanceOf().then((payload) => {
            console.log('Balance: ', payload);
        }).catch((error) => {
            console.error('An error occurred: ', error);
        });

    }
    ngAfterViewInit() {
        this.changeDetector.detectChanges();
        window.setTimeout(() => {this.spinner = false}, 4000);
        }
    getAppointmentType(num: any): string {
        return this.appointmentTypes[num]
    }
    getClinicFromName(clinicName: any) {
        for (let i = 0; i < this.clinics.length; i++) {
            if(this.clinics[i].name == clinicName) {
                return this.clinics[i]
            }
        }

        return this.clinics[0]
    }

    getPatientFromId(id: any) {
        for(let i = 0; i < this.user.patients.length; i++) {
            if(id == this.user.patients[i]._id == id) {
                return this.user.patients[i]
            }
        }

        return this.user.patients[0]
    }

    getEmployeeFromEmployeeID(id: any) {
        for(let i = 0; i < this.clinics.length; i++) {
            for(let j = 0; j < this.clinics[i].employees.length; j++) {
                if(this.clinics[i].employees[j]._id == id) {
                    return this.clinics[i].employees[j]
                }
            }
        }
        return this.clinics[0].employees[0]
    }

    changeCurrentPatient(petToSelect: any) {
        for(var i = 0; i < this.user.patients.length; i++) {
            let p = this.user.patients[i]
            if(p.name == petToSelect) {
                this.currentSelectedPatient = p
                this.currentClinic = this.getClinicFromName(p?.clinic)
            }
        }
    }

    changePetSelect(e: any) {
        this.changeCurrentPatient(e.value.trim())
    }

    stateChangeCreatePet() {
        this.showCreatePetBool = !this.showCreatePetBool
    }

    stateChangeAppointmentPopup() {
        this.showAppointmentBool = !this.showAppointmentBool
    }

    stateChangeDeletePopup() {
        this.showDeleteBool = !this.showDeleteBool
    }

    stateChangeRequestPopup() {
        this.showRequestBool = !this.showRequestBool
    }

    stateChangLoginPopup() {
        this.showLoginBool = !this.showLoginBool
    }

    sendAppointmentRequest() {
        this.stateChangeRequestPopup()
    }

    updateUserInfo() {
        var clientuser = document.getElementById("profileNameInput") as HTMLInputElement
        var clientemail = document.getElementById("profileEmailInput") as HTMLInputElement
        var clientphone = document.getElementById("profilePhoneInput") as HTMLInputElement
        var clientpass = document.getElementById("profilerepasswordnewInput") as HTMLInputElement
        // TODO: UPDATE AND CHECK WHAT THE RESULT IS, IF THE UPDATE CAN GO THROUGH

        this.user.username = clientuser.value
        this.user.email = clientemail.value
        this.user.telNumber = clientphone.value


        this.subscriptions.add(
            this.clientService.updateUser(this.clientid, this.user).subscribe({
                next: () => {
                  this.changeDetector.detectChanges;
                },
                error: (err: any) => {
                    alert('Error: ' + JSON.stringify(err, null, 2));
                }
              })
          );


        this.stateChangLoginPopup()
    }

    onSubmitCreatePet() {
        let createPetName = document.getElementById('name') as HTMLInputElement;
        let createPetType = document.getElementById('vrsta') as HTMLInputElement;
        let createPetGender = document.getElementById('spol') as HTMLInputElement;
        let createPetDate = document.getElementById('starost') as HTMLInputElement;
        let createPetBreed = document.getElementById('pasma') as HTMLInputElement;
        let createPetPassport = document.getElementById('potni') as HTMLInputElement;
        let createPetChipped = document.getElementById('cipiran') as HTMLInputElement;
        
        let patient: Patient = {
            _id: '', 
            name: createPetName.value,
            age: parseInt(createPetDate.value), 
            gender: createPetGender.value,
            chip: createPetChipped.checked, 
            species: createPetType.value,
            breed: createPetBreed.value,
            assignedEmployee: this.clinics[0].employees[0]._id,
            passportId: createPetPassport.value,
        };
        this.subscriptions.add(
            this.clientService.addPatients( this.clientid,patient).subscribe({
                next: () => {
                  this.clientService.getClient(this.clientid);
                  this.changeDetector.detectChanges;
                },
                error: (err) => {
                    alert('Error: ' + JSON.stringify(err, null, 2));
                }
              })
          );
        

        // TODO: FIX TO SEND TO SERVER AND ADD IF it is success
        // FIXME: FIX TO SEND TO SERVER AND ADD IF it is success

        this.stateChangeCreatePet()
    }

    changeSelectedDoctor(selectedDoctor: number) {
        this.selectedDoctor = selectedDoctor

    }

    getSelectedDoctorName(): string {
        if(this.currentClinic) {
            return this.currentClinic.employees[this.selectedDoctor].name + " " + this.currentClinic.employees[this.selectedDoctor].surname
        }
        return ""
    }

    getSelectedDoctorType(): string {
        if(this.currentClinic) {
            return this.currentClinic.employees[this.selectedDoctor].profession
        }
        return ""
    }

    getSelectedDoctorPhone(): string {
        if(this.currentClinic) {
            return this.currentClinic.employees[this.selectedDoctor].telNumber
        }
        return ""
    }

    getSelectedDoctorEmail(): string {
        if(this.currentClinic) {
            return this.currentClinic.employees[this.selectedDoctor].email
        }
        return ""
    }

    getPatientFromName(name: any): Patient | null {
        for(let i = 0; i < this.user?.patients.length; i++)
        {
            console.log(this.user?.patients[i].name, '==', name)
            if(this.user?.patients[i].name == name) {
                return this.user?.patients[i]
            }
        }
        return null
    }


    updateClinics() {
        let patientChoices = document.querySelectorAll('.updateClinicPatient') as NodeListOf<HTMLSelectElement>;

        for(let i = 0; i < patientChoices.length; i++) {
            let patient = this.getPatientFromName(patientChoices[i].children[0].getAttribute("data-patient-name"))

            const val = patientChoices[i].value

            // TODO: Make call to update the patient through API
            if(patient != null) {
                patient.clinic = val

                console.log(patient)
            }
        }


    }

    checkIfClinicIsPatients(p: Patient, c: Clinic): string {
        return c.name == p.clinic ? 'selected="" disabled=""' : ''
    }

    // TODO: shorthand for making a call to change the it
    changeClinic(i: number) {
        this.currentClinic = this.clinics[i]
    }

    meetingTypeText = ""
    setMeetingType(meetingType: string) {
        this.meetingTypeText = meetingType
    }

    selectedDate : DOMStringMap = {}
    calendarOnClickEvent(e: any) {
        const cell = e.target.closest('td');
        if (!cell) {return;}

        console.log(cell)

        if(this.meetingTypeText === "") {
            return;
        }

        this.selectedDate = cell.dataset
        this.stateChangeAppointmentPopup()

    }

    addAppointment(){
        console.log("vet")
        var vetID = document.getElementById("timeSelect") as HTMLSelectElement


        let vet = this.currentClinic?.employees.find((vet: Employee) => {
            console.log(this.currentSelectedPatient?.assignedEmployee)
            return `${vet.username}` == this.currentSelectedPatient?.assignedEmployee
        })

        if(vet == undefined || vet == null) {
            console.log("vet is undefined")
            return
        }

        let date = new Date();

        // @ts-ignore
        console.log("test", this.appointmentIds[this.meetingTypeText])

        let newAppointment : {
            "vetAppId": string,
            "grAppId": number,
            "date": string,
            "clientId": string,
            "patientId": string,
            "clinicId": string,
            "employeeId": string,
            dateCreated:  string,
            status: string
        } = {
            // @ts-ignore
            "vetAppId": this.appointmentIds[this.meetingTypeText]!,
            "grAppId": 2,
            "date": this.selectedDate['year'] + "-" + this.selectedDate['month'] + "-" + this.selectedDate['date'] + "T" + vetID.value + ":00Z",
            "clientId": this.clientid,
            "patientId": this.currentSelectedPatient?._id!,
            "clinicId": this.currentClinic?._id!,
            "employeeId": vet._id,
            dateCreated:  date.toDateString(),
            status: 'accepted'
        }

        // discount tokens
        this.web3Service.discountTokens(this.tokensToUse).then((payload) => {
            console.log('Discount: ', payload);
        }).catch((error) => {
            console.error('An error occurred: ', error);
        });

        this.subscriptions.add(
          this.clientService.addAppointment(newAppointment).subscribe({
              next: (app: Appointment) => {
                  console.log(app)
                  this.futureAppointments.push(app)
                  this.stateChangeAppointmentPopup()
                  this.changeDetector.detectChanges;
              },
              error: (err) => {
                  console.error('Error getting data', err);
              }
          })
        );
    }
    removePatient() {
        console.log(this.currentSelectedPatient)

        if(this.user != null) {
            for (let i = 0; i < this.user.patients.length; i++) {
                const currentPatient = this.user.patients[i]
                if (currentPatient?.name == this.currentSelectedPatient?.name) {
                    this.subscriptions.add(

                        this.clientService.deletePatients(this.clientid, this.currentSelectedPatient._id!).subscribe({
                            next: () => {
                              this.changeDetector.detectChanges;
                            },
                            error: (err) => {
                                alert('Error: ' + JSON.stringify(err, null, 2));
                            }
                          })
                      );

                    this.user.patients = [...this.user?.patients.slice(0, i), ...this.user?.patients.slice(i + 1)];
                    this.currentSelectedPatient = this.user.patients[0]
                }
            }
        }

        this.stateChangeDeletePopup()
    }

    logout() {
        localStorage.clear()
        this.router.navigate(['/'])
    }

    getIfDogOrCatIsPet(): boolean[] {
        //                       cat  , dog
        let animalsTypeExists = [false, false];

        this.user.patients.forEach((animal) => {
            if(animal.species === 'cat') {
                animalsTypeExists[0] = true
            } else if (animal.species === 'dog') {
                animalsTypeExists[1] = true
            }
        })
        return animalsTypeExists
    }

    fetchFactApi() {
        let animalExists = this.getIfDogOrCatIsPet()
        if(animalExists[0] && animalExists[1]){
            let apiToFetch = Math.floor(Math.random() * 2)
            if(apiToFetch === 0)
            {
                this.fetchCatFactApi()
            } else {
                this.fetchDogFactApi()
            }

        } else if (animalExists[1]) {
            this.fetchDogFactApi()
        } else {
            this.fetchCatFactApi()
        }
    }

    fetchDogFactApi() {
        fetch("https://dogapi.dog/api/v2/facts?limit=1")
            .then(response => response.json())
            .then(data => {
                console.log('dog data', data)
                this.fact = data.data[0].attributes.body
            })
            .catch(error => console.error('Error:', error));
    }

    fetchCatFactApi() {
        fetch("https://catfact.ninja/fact?max_length=200")
            .then(response => response.json())
            .then(data => {
                console.log('cat data', data)
                this.fact = data.fact
            })
            .catch(error => console.error('Error:', error));
    }

}
