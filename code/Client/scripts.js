var icons = document.getElementById("icons");
var fact_elem = document.getElementById("fact");

var timeSelect = document.getElementById("timeSelect");

var doctorInfo = document.getElementById("drInfo");
var doctorList = document.getElementById("drList");
var currentSelectedDoctor = 0;

var selectedDate = {
  date: null,
  month: null,
  year: null,
  month_name: null,
};

var iconImages = [
  "cat2.png",
  "cat1.png",
  "cat3.png",
  "dog1.png",
  "dog2.png",
  "dog3.png",
];
var colors = ["#D8EAE6", "#CDCEE8", "#ECD6E6", "#D9E9E5", "#ECD6E6", "#CDCEE8"];

var meetingTypeText = "";
var selectedPet = null;

var user = {
  name: "Peter Kos",
  number: "18720",
};

var transperentPop = document.getElementById("transpFilter");
var createNewPopup = document.getElementById("popupCreatePet");

var animals = [
  {
    id: 1,
    type: "cat",
    name: "Bimi",
    gender: "male",
    age: 17,
    breed: "????",
    passport: "32534246675",
    chipped: false,
    employee_id: 0,
    clinic_id: 1,
  },
  {
    id: 2,
    type: "cat",
    name: "Nona",
    gender: "female",
    age: 5,
    breed: "????",
    passport: "345765673657435",
    chipped: true,
    employee_id: 1,
    clinic_id: 1,
  },
  {
    id: 3,
    type: "dog",
    name: "Lili",
    gender: "female",
    age: 3,
    breed: "????",
    passport: "435634564326",
    chipped: true,
    employee_id: 2,
    clinic_id: 1,
  },
  {
    id: 4,
    type: "dog",
    name: "Rex",
    gender: "male",
    age: 10,
    breed: "????",
    passport: "465536543",
    chipped: false,
    employee_id: 3,
    clinic_id: 1,
  },
];

var appointments = {
  previous: [
    {
      patient: "Bimi",
      appointment_type: "Grooming",
      date: "19/12/23",
      time: "12:30pm",
      doctor: {
        clinic_id: 0,
        name: "Dani",
      },
    },
  ],
  future: [
    {
      patient: "Bimi",
      appointment_type: "Kastracija",
      date: "10/12/23",
      time: "07:30am",
      doctor: {
        clinic_id: 0,
        name: "Nina",
      },
    },
  ],
};

var clinic = [
  {
    id: 0,
    name: "Živalstvo Zdravo",
    address: "Ul. Veterinarjev 12",
    phone: "+386 1 234 5678",
    email: "info@zivalstvozdravo.si",
    desc: "Vaši ljubljenčki so naša prednostna skrb. Zavezani smo strokovni, nežni in natančni veterinarski oskrbi. Smo tu zanje.",
    employees: [
      {
        id: 0,
        Name: "Dr. Simon Novak",
        type: "Glavni veterinar",
        phone: "+386 1 234 5679",
        email: "simon.novak@gmail.com",
      },
      {
        id: 1,
        Name: "Dr. Ana Kovač",
        type: "Veterinar",
        phone: "+386 1 234 5680",
        email: "ana.kovac@gmail.com",
      },
      {
        id: 2,
        Name: "Dr. Nina Mlinar",
        type: "Veterinar",
        phone: "+386 1 234 5682",
        email: "nina.mlinar@gmail.com",
      },
      {
        id: 3,
        Name: "Dani Mlekar",
        type: "Negovalec",
        phone: "+386 1 234 5681",
        email: "dani.mlekar@gmail.com",
      },
    ],
  },
  {
    id: 1,
    name: "Srčkani Ljubljenčki",
    address: "Ul. Sončna pot 23",
    phone: "+386 40 123 456",
    email: "info@sljubljenčki.si",
    desc: "Vaši ljubljenčki zaslužijo nežno, strokovno in skrbno veterinarsko oskrbo. Smo tukaj zanje.",
    employees: [
      {
        id: 0,
        Name: "Dr. Simon Novak",
        type: "Glavni veterinar",
        phone: "+386 1 234 5679",
        email: "simon.novak@gmail.com",
      },
      {
        id: 1,
        Name: "Dr. Ana Kovač",
        type: "Veterinar",
        phone: "+386 1 234 5680",
        email: "ana.kovac@gmail.com",
      },
      {
        id: 2,
        Name: "Dr. Nina Mlinar",
        type: "Veterinar",
        phone: "+386 1 234 5682",
        email: "nina.mlinar@gmail.com",
      },
      {
        id: 3,
        Name: "Dani Mlekar",
        type: "Negovalec",
        phone: "+386 1 234 5681",
        email: "dani.mlekar@gmail.com",
      },
    ],
  },
  {
    id: 2,
    name: "DomačiVet",
    address: "Ul. Ljubezenska 14",
    phone: "+386 01 234 567",
    email: "info@vetklinika.si",
    desc: "Vrhunska veterinarska oskrba za vaše ljubljenčke - strokovnost in skrb za njihovo dobrobit.",
    employees: [
      {
        id: 0,
        Name: "Dr. Simon Novak",
        type: "Glavni veterinar",
        phone: "+386 1 234 5679",
        email: "simon.novak@gmail.com",
      },
      {
        id: 1,
        Name: "Dr. Ana Kovač",
        type: "Veterinar",
        phone: "+386 1 234 5680",
        email: "ana.kovac@gmail.com",
      },
      {
        id: 2,
        Name: "Dr. Nina Mlinar",
        type: "Veterinar",
        phone: "+386 1 234 5682",
        email: "nina.mlinar@gmail.com",
      },
      {
        id: 3,
        Name: "Dani Mlekar",
        type: "Negovalec",
        phone: "+386 1 234 5681",
        email: "dani.mlekar@gmail.com",
      },
    ],
  },
  {
    id: 3,
    name: "DomačiVet",
    address: "Ul. Ljubezenska 14",
    phone: "+386 01 234 567",
    email: "info@vetklinika.si",
    desc: "Vrhunska veterinarska oskrba za vaše ljubljenčke - strokovnost in skrb za njihovo dobrobit.",
    employees: [
      {
        id: 0,
        Name: "Dr. Simon Novak",
        type: "Glavni veterinar",
        phone: "+386 1 234 5679",
        email: "simon.novak@gmail.com",
      },
      {
        id: 1,
        Name: "Dr. Ana Kovač",
        type: "Veterinar",
        phone: "+386 1 234 5680",
        email: "ana.kovac@gmail.com",
      },
      {
        id: 2,
        Name: "Dr. Nina Mlinar",
        type: "Veterinar",
        phone: "+386 1 234 5682",
        email: "nina.mlinar@gmail.com",
      },
      {
        id: 3,
        Name: "Dani Mlekar",
        type: "Negovalec",
        phone: "+386 1 234 5681",
        email: "dani.mlekar@gmail.com",
      },
    ],
  },
  {
    id: 4,
    name: "DomačiVet",
    address: "Ul. Ljubezenska 14",
    phone: "+386 01 234 567",
    email: "info@vetklinika.si",
    desc: "Vrhunska veterinarska oskrba za vaše ljubljenčke - strokovnost in skrb za njihovo dobrobit.",
    employees: [
      {
        id: 0,
        Name: "Dr. Simon Novak",
        type: "Glavni veterinar",
        phone: "+386 1 234 5679",
        email: "simon.novak@gmail.com",
      },
      {
        id: 1,
        Name: "Dr. Ana Kovač",
        type: "Veterinar",
        phone: "+386 1 234 5680",
        email: "ana.kovac@gmail.com",
      },
      {
        id: 2,
        Name: "Dr. Nina Mlinar",
        type: "Veterinar",
        phone: "+386 1 234 5682",
        email: "nina.mlinar@gmail.com",
      },
      {
        id: 3,
        Name: "Dani Mlekar",
        type: "Negovalec",
        phone: "+386 1 234 5681",
        email: "dani.mlekar@gmail.com",
      },
    ],
  },
  {
    id: 5,
    name: "DomačiVet",
    address: "Ul. Ljubezenska 14",
    phone: "+386 01 234 567",
    email: "info@vetklinika.si",
    desc: "Vrhunska veterinarska oskrba za vaše ljubljenčke - strokovnost in skrb za njihovo dobrobit.",
    employees: [
      {
        id: 0,
        Name: "Dr. Simon Novak",
        type: "Glavni veterinar",
        phone: "+386 1 234 5679",
        email: "simon.novak@gmail.com",
      },
      {
        id: 1,
        Name: "Dr. Ana Kovač",
        type: "Veterinar",
        phone: "+386 1 234 5680",
        email: "ana.kovac@gmail.com",
      },
      {
        id: 2,
        Name: "Dr. Nina Mlinar",
        type: "Veterinar",
        phone: "+386 1 234 5682",
        email: "nina.mlinar@gmail.com",
      },
      {
        id: 3,
        Name: "Dani Mlekar",
        type: "Negovalec",
        phone: "+386 1 234 5681",
        email: "dani.mlekar@gmail.com",
      },
    ],
  },
];

var client = {
  username: "Peter Kos",
  email: "peter.kos@gmail.com",
  phone: "069245868",
  pass: "******",
};

var clientuser = document.getElementById("profileNameInput");
var clientemail = document.getElementById("profileEmailInput");
var clientphone = document.getElementById("profilePhoneInput");
var clientpass = document.getElementById("profilerepasswordnewInput");

var selectPet = document.getElementById("animalSelect");
var futureAppointments = document.getElementById("futureAppointments");
var previousAppointments = document.getElementById("previousAppointments");

var clinicTitleName = document.getElementById("clinicTitle");
var clinicAddress = document.getElementById("clinicAddress");
var clinicPhone = document.getElementById("clinicPhone");
var clinicEmail = document.getElementById("clinicEmail");

var speciesNode = document.getElementById("species");
var genderNode = document.getElementById("gender");
var ageNode = document.getElementById("age");
var breedNode = document.getElementById("breed");
var passportNode = document.getElementById("passport");
var chippedNode = document.getElementById("chipped");
// On load make pets appear
window.onload = function () {
  animals.forEach((animal) => {
    icons.innerHTML += generateCircleIcon(animal.name, animal.type);
  });

  addPetDropDown(animals[0], true);

  for (var i = 1; i < animals.length; i++) {
    addPetDropDown(animals[i], false);
  }

  appointments.future.forEach((appointment) => {
    futureAppointments.innerHTML +=
      "<tr><td>" +
      appointment.patient +
      "</td><td>" +
      appointment.appointment_type +
      "</td><td>" +
      appointment.date +
      "</td><td>" +
      appointment.time +
      "</td><td>" +
      appointment.doctor.name +
      "</td></tr>";
  });
  appointments.previous.forEach((appointment) => {
    previousAppointments.innerHTML +=
      "<tr><td>" +
      appointment.patient +
      "</td><td>" +
      appointment.appointment_type +
      "</td><td>" +
      appointment.date +
      "</td><td>" +
      appointment.time +
      "</td><td>" +
      appointment.doctor.name +
      "</td></tr>";
  });

  getPetAndSelect(animals[0].name);

  clinicTitleName.innerText = clinic[0].name;
  clinicAddress.innerText = clinic[0].address;
  clinicPhone.innerText = clinic[0].phone;
  clinicEmail.innerText = clinic[0].email;

  doctorList.innerHTML +=
    '<a class="pointer list-group-item list-group-item-action drListActive" onclick="selectDoctor(this, 0)">' +
    clinic[0].employees[0].Name +
    "</a>";
  doctorInfo.innerHTML += generateEmpoyeeCard(clinic[0].employees[0], false);

  for (var i = 1; i < clinic[0].employees.length; i++) {
    doctorList.innerHTML +=
      '<a class="pointer list-group-item list-group-item-action" onclick="selectDoctor(this, ' +
      i +
      ')">' +
      clinic[0].employees[i].Name +
      "</a>";
    doctorInfo.innerHTML += generateEmpoyeeCard(clinic[0].employees[i], true);
  }

  for (var i = 0; i < clinic.length; i += 2) {
    console.log(clinic.length, i);
    addCarouselItem(clinic[i], clinic[i + 1], i === 0);
  }

  insertClientInfo();
};

selectPet.onchange = (event) => {
  getPetAndSelect(event.target.value);
};

fetchFactApi();
function fetchFactApi() {
  let animalExists = getIfDogOrCatIsPet();
  if (animalExists[0] && animalExists[1]) {
    let apiToFetch = Math.floor(Math.random() * (iconImages.length / 2));
    if (apiToFetch === 0) {
      fetchCatFactApi();
    } else {
      fetchDogFactApi();
    }
  } else if (animalExists[1]) {
    fetchDogFactApi();
  } else {
    fetchCatFactApi();
  }
}

function fetchDogFactApi() {
  fetch("https://dogapi.dog/api/v2/facts?limit=1")
    .then((response) => response.json())
    .then((data) => {
      console.log("dog data", data);
      fact_elem.innerText = data.data[0].attributes.body;
    })
    .catch((error) => console.error("Error:", error));
}

function fetchCatFactApi() {
  fetch("https://catfact.ninja/fact?max_length=200")
    .then((response) => response.json())
    .then((data) => {
      console.log("cat data", data);
      fact_elem.innerText = data.fact;
    })
    .catch((error) => console.error("Error:", error));
}

function getIfDogOrCatIsPet() {
  //                       cat  , dog
  let animalsTypeExists = [false, false];

  animals.forEach((animal) => {
    if (animal.type === "cat") {
      animalsTypeExists[0] = true;
    } else if (animal.type === "dog") {
      animalsTypeExists[1] = true;
    }
  });
  return animalsTypeExists;
}

function changeUserData() {
  client.username = clientuser.value;
  client.email = clientemail.value;
  client.phone = clientphone.value;
  client.pass = clientpass.value;
  hidePopupLogin();
  // Hash and check password, if the old is correct
  // encrypt the new password
  // send to server, such that it can be changed in db
}

function addToFutureReservations(
  patient,
  appointment_type,
  date,
  time,
  doctor,
) {
  return (
    "<tr><td>" +
    patient +
    "</td><td>" +
    appointment_type +
    "</td><td>" +
    date +
    "</td><td>" +
    time +
    "</td><td>" +
    doctor +
    "</td></tr>"
  );
}

var createConfirmationPopup = document.getElementById("popupConfirmation");
function hidePopupConfirmation() {
  createConfirmationPopup.classList.remove("show");
  transperentPop.classList.add("hide");
}

function showPopupConfirmation() {
  createConfirmationPopup.classList.add("show");
  transperentPop.classList.remove("hide");
}

function getClinic() {
  return clinic.find((c) => {
    return c.id === selectedPet.clinic_id;
  });
}

function getDoctor() {
  let currentClinic = getClinic();
  return currentClinic.employees.find((employee) => {
    return employee.id === selectedPet.employee_id;
  });
}

var carouselItems = document.getElementById("carouselItems");
const carouselBackgroundImages = ["green.png", "violet.png", "pink.png"];
const carouselBackgroundColors = ["#e8f2f0", "#E8E9F9", "#F6EEF4"];
function addCarouselItem(clinic1, clinic2, isActive) {
  let s = '<div class="carousel-item ' + (isActive ? "active" : "") + '">';

  if (clinic1 !== undefined) {
    imageIndex = Math.floor(
      Math.random() * (carouselBackgroundImages.length / 2),
    );
    s +=
      '<div class="col-md-6">\n' +
      '                                                <div class="card">\n' +
      '                                                    <div class="card-img">\n' +
      '                                                        <div class="card-body">\n' +
      '                                                            <div class="card text-white bg-info mb-3" style="border-radius: 2.5vh; background-color: ' +
      carouselBackgroundColors[imageIndex] +
      ' !important; border: none; overflow: hidden;">\n' +
      '                                                                <div class="card-header" style="background-image: url(' +
      carouselBackgroundImages[imageIndex] +
      "); background-size: cover; color: #454545; font-family: 'Josefin Sans', sans-serif; text-align: center;\"><strong>" +
      clinic1.name +
      "</strong></div>\n" +
      '                                                                    <div class="card-body">\n' +
      '                                                                        <div class="oneLine" style="display: flex; justify-content: center;">\n' +
      '                                                                            <i class="fa-solid fa-map-location-dot" style="padding-right: 0.5vw; color: #454545 !important;"></i>\n' +
      '                                                                            <h4 class="card-title" style="flex-direction: row; color: #454545; text-align: center; font-size: 15px; font-family: \'Josefin Sans\', sans-serif;">Address: <small>' +
      clinic1.address +
      "</small></h4>\n" +
      "                                                                        </div>\n" +
      '                                                                        <div class="oneLine" style="display: flex; justify-content: center;">\n' +
      '                                                                            <i class="fa-solid fa-phone" style="padding-right: 0.5vw; color: #454545 !important;"></i>    \n' +
      '                                                                            <h5 class="card-title" style="flex-direction: row; color: #454545; text-align: center; font-size: 15px; font-family: \'Josefin Sans\', sans-serif;">Contact: <small>' +
      clinic1.phone +
      "</small></h5>\n" +
      "                                                                        </div>\n" +
      '                                                                        <div class="oneLine" style="display: flex; justify-content: center;">\n' +
      '                                                                            <i class="fa-solid fa-envelope" style="padding-right: 0.5vw; color: #454545 !important;"></i>    \n' +
      '                                                                            <h5 class="card-title" style="flex-direction: row; color: #454545; text-align: center; font-size: 15px; font-family: \'Josefin Sans\', sans-serif;">Email: <small>' +
      clinic1.email +
      "</small></h5>\n" +
      "                                                                        </div>\n" +
      '                                                                        <p class="card-text" style="color: #454545; text-align: justify; font-family: \'Josefin Sans\', sans-serif;">' +
      clinic1.desc +
      "</p>\n" +
      "                                                                    </div>\n" +
      "                                                                </div>\n" +
      "                                                            </div>\n" +
      "                                                    </div>\n" +
      "                                                </div>\n" +
      "                                            </div>";
  }

  if (clinic2 !== undefined) {
    imageIndex = Math.floor(
      Math.random() * (carouselBackgroundImages.length / 2),
    );
    s +=
      '<div class="col-md-6">\n' +
      '                                                <div class="card">\n' +
      '                                                    <div class="card-img">\n' +
      '                                                        <div class="card-body">\n' +
      '                                                            <div class="card text-white bg-info mb-3" style="border-radius: 2.5vh; background-color: ' +
      carouselBackgroundColors[imageIndex] +
      ' !important; border: none; overflow: hidden;">\n' +
      '                                                                <div class="card-header" style="background-image: url(' +
      carouselBackgroundImages[imageIndex] +
      "); background-size: cover; color: #454545; font-family: 'Josefin Sans', sans-serif; text-align: center;\"><strong>" +
      clinic2.name +
      "</strong></div>\n" +
      '                                                                    <div class="card-body">\n' +
      '                                                                        <div class="oneLine" style="display: flex; justify-content: center;">\n' +
      '                                                                            <i class="fa-solid fa-map-location-dot" style="padding-right: 0.5vw; color: #454545 !important;"></i>\n' +
      '                                                                            <h4 class="card-title" style="flex-direction: row; color: #454545; text-align: center; font-size: 15px; font-family: \'Josefin Sans\', sans-serif;">Address: <small>' +
      clinic2.address +
      "</small></h4>\n" +
      "                                                                        </div>\n" +
      '                                                                        <div class="oneLine" style="display: flex; justify-content: center;">\n' +
      '                                                                            <i class="fa-solid fa-phone" style="padding-right: 0.5vw; color: #454545 !important;"></i>    \n' +
      '                                                                            <h5 class="card-title" style="flex-direction: row; color: #454545; text-align: center; font-size: 15px; font-family: \'Josefin Sans\', sans-serif;">Contact: <small>' +
      clinic2.phone +
      "</small></h5>\n" +
      "                                                                        </div>\n" +
      '                                                                        <div class="oneLine" style="display: flex; justify-content: center;">\n' +
      '                                                                            <i class="fa-solid fa-envelope" style="padding-right: 0.5vw; color: #454545 !important;"></i>    \n' +
      '                                                                            <h5 class="card-title" style="flex-direction: row; color: #454545; text-align: center; font-size: 15px; font-family: \'Josefin Sans\', sans-serif;">Email: <small>' +
      clinic2.email +
      "</small></h5>\n" +
      "                                                                        </div>\n" +
      '                                                                        <p class="card-text" style="color: #454545; text-align: justify; font-family: \'Josefin Sans\', sans-serif;">' +
      clinic2.desc +
      "</p>\n" +
      "                                                                    </div>\n" +
      "                                                                </div>\n" +
      "                                                            </div>\n" +
      "                                                    </div>\n" +
      "                                                </div>\n" +
      "                                            </div>";
  }

  s += "</div>";
  carouselItems.innerHTML += s;
}

function addReservation() {
  // console.log(getDoctor())
  futureAppointments.innerHTML += addToFutureReservations(
    selectedPet.name,
    meetingTypeText,
    selectedDate.date + "/" + selectedDate.month + "/" + selectedDate.year,
    timeSelect.value,
    getDoctor().Name,
  );
  hidePopup();
}

function addPetDropDown(animal, selected) {
  selectPet.innerHTML +=
    '<option value="' +
    animal.name +
    '"' +
    (selected ? "selected" : "") +
    ">" +
    animal.name +
    "</option>";
}

function setMeetingType(x) {
  meetingTypeText = x.children[1].innerText;

  let allButtons = document.getElementsByClassName("checkUp");
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("active");
  }

  x.classList.add("active");
}

function generateEmpoyeeCard(employee, withHide) {
  var s = '<div class="tab-pane ';

  if (withHide) {
    s += "hide";
    console.log("welcome?");
  }
  s +=
    '" role="tabpanel"' +
    '                                     aria-labelledby="v-pills-profile-tab">' +
    "                                    <div" +
    '                                            class="card doctors border-info mb-3"' +
    '                                            style="height: 100%;"' +
    "                                    >" +
    "                                        <div" +
    '                                                class="card-body vet text-info"' +
    '                                                style="color: #3cb6a7 !important">' +
    '<h5 class="card-title">' +
    employee.Name +
    "                                            </h5>" +
    "                                            <hr" +
    '                                                    style="' +
    "                                                        margin-top: -1vh;" +
    "                                                        margin-bottom: 0vh;" +
    '                                                    "' +
    "                                            />" +
    '                                            <h6 class="profession">' +
    employee.type +
    "                                            </h6>" +
    "                                            <div" +
    '                                                    class="singleLine"' +
    '                                                    style="' +
    "                                                        display: flex;" +
    "                                                        flex-direction: row;" +
    '                                                    "' +
    "                                            >" +
    '                                                <div class="oneLine">' +
    '                                                    <i class="fa-solid phone fa-phone"' +
    '                                                       style="color: #3cb6a7 !important"></i>' +
    '                                                    <span style="font-size: 0.9em"' +
    "                                                    ><strong>Phone: </strong" +
    "                                                    >" +
    employee.phone +
    "</span" +
    "                                                    >" +
    "                                                </div>" +
    "                                            </div>" +
    "                                            <div" +
    '                                                    class="singleLine"' +
    '                                                    style="' +
    "                                                        display: flex;" +
    "                                                        flex-direction: row;" +
    '                                                    "' +
    "                                            >" +
    '                                                <div class="oneLine">' +
    '                                                    <i class="fa-solid fa-envelope" style="color: #3cb6a7 !important"></i>' +
    '                                                    <span style="font-size: 0.9em"' +
    "                                                    ><strong>Email: </strong" +
    "                                                    >" +
    employee.email +
    "</span" +
    "                                                    >" +
    "                                                </div>" +
    "                                            </div>" +
    "                                        </div>" +
    "                                    </div>" +
    "                                </div>";
  return s;
}

var createPetName = document.getElementById("name");
var createPetType = document.getElementById("vrsta");
var createPetGender = document.getElementById("spol");
var createPetDate = document.getElementById("starost");
var createPetBreed = document.getElementById("pasma");
var createPetPassport = document.getElementById("potni");
var createPetChipped = document.getElementById("cipiran");

function createPet() {
  let animal = {
    id: 45,
    type: createPetType.value,
    name: createPetName.value,
    gender: createPetGender.value,
    age:
      new Date().getUTCFullYear() -
      new Date(createPetDate.value).getUTCFullYear(),
    breed: createPetBreed.value,
    passport: createPetPassport.value,
    chipped: createPetChipped.value,
    clinic: "clinic",
    clinic_id: 1,
  };
  animals.push(animal);
  addPetDropDown(animal, false);
  icons.innerHTML += generateCircleIcon(animal.name, animal.type);
  createNewPopup.classList.remove("show");
}

function hidePopupPet() {
  createNewPopup.classList.remove("show");
  transperentPop.classList.add("hide");
}

function showCreatePet() {
  createNewPopup.classList.add("show");
  transperentPop.classList.remove("hide");
}

function generateCircleIcon(name, type) {
  imageIndex = Math.floor(Math.random() * (iconImages.length / 2));

  image = null;
  color = null;
  if (type == "dog") {
    image = iconImages[imageIndex + 3];
    color = colors[imageIndex + 3];
  } else {
    image = iconImages[imageIndex];
    color = colors[imageIndex];
  }

  return (
    '<div class="circleIcon pointer" style="background-color: ' +
    color +
    ' !important;" onClick="getPetAndSelect(\'' +
    name +
    "')\">" +
    '<img src="' +
    image +
    '" class="greenCat"/>' +
    '<span class="circleIconText">' +
    name +
    "</span>" +
    "</div>"
  );
}

var createRequest = document.getElementById("createAppointment");

function showPopupRequest() {
  createRequest.classList.add("show");
  transperentPop.classList.remove("hide");
}

function hidePopupRequest() {
  createRequest.classList.remove("show");
  transperentPop.classList.add("hide");
}

function showPopupLogin() {
  popuplogin.classList.add("show");
  transperentPop.classList.remove("hide");
}

function hidePopupLogin() {
  popuplogin.classList.remove("show");
  transperentPop.classList.add("hide");
}

function hidePopup() {
  popup.classList.remove("show");
  transperentPop.classList.add("hide");
}
function getPetAndSelect(pet) {
  petInfo = animals.find((x) => {
    return x.name == pet;
  });
  selectedPet = petInfo;
  insertPetInfoClientData(petInfo);
  setActiveOnIcons(petInfo);
}

function setActiveOnIcons(petInfo) {
  var children = icons.children;

  for (var i = 0; i < children.length; i++) {
    if (children[i].children[1].innerText == petInfo.name) {
      children[i].classList.add("active");
    } else {
      children[i].classList.remove("active");
    }
  }
}

function insertPetInfoClientData(petInfo) {
  console.log(petInfo.type);
  speciesNode.innerText = capitalize_letter(petInfo.type);
  genderNode.innerText = capitalize_letter(petInfo.gender);
  ageNode.innerText = capitalize_letter(petInfo.age);
  breedNode.innerText = capitalize_letter(petInfo.breed);
  passportNode.innerText = capitalize_letter(petInfo.passport);
  var chippedValue = petInfo.chipped ? "Da" : "Ne";
  chippedNode.innerText = chippedValue;
}

function insertClientInfo() {
  clientuser.value = capitalize_letter(client.username);
  clientemail.value = capitalize_letter(client.email);
  clientphone.value = capitalize_letter(client.phone);
}

function capitalize_letter(s) {
  return s;
}

function removeCat() {
  if (selectedPet != null) {
    icons.childNodes.forEach((element) => {
      if (element.children[1].innerText === selectedPet.name) {
        console.log(selectedPet);
        icons.removeChild(element);
      }
    });
  }
  hidePopupConfirmation();
}

function addIcon() {
  icons.innerHTML += generateCircleIcon("Alejhandro", "cat");
}

var items = document.querySelectorAll(".carousel .carousel-item");

items.forEach((el) => {
  const minPerSlide = 2;
  let next = el.nextElementSibling;
  console.log(next);
  for (var i = 1; i < minPerSlide; i++) {
    if (!next) {
      next = items[0];
    }
    let cloneChild = next.cloneNode(true);
    el.appendChild(cloneChild.children[0]);
    next = next.nextElementSibling;
  }
});

function selectDoctor(buttonClicked, number) {
  var activeClassName = "drListActive";
  var doctorInfoChildren = doctorInfo.children;
  if (doctorInfoChildren.length >= number && number !== currentSelectedDoctor) {
    var oldItem = doctorInfoChildren.item(currentSelectedDoctor);
    var newItem = doctorInfoChildren.item(number);

    var children = doctorList.children;

    for (let i = 0; i < children.length; i++) {
      children[i].classList.remove(activeClassName);
    }

    oldItem.classList.add("hide");
    newItem.classList.remove("hide");
    buttonClicked.classList.add(activeClassName);

    currentSelectedDoctor = number;
  }
}
