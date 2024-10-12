// script.js
/*Podatki za tabele*/
let veterinar = {
  NinaMlinar: ["Bimi", "Nona", "Lili", "Max", "Rex"],
};
let vetAmbulanta = {
  idk: ["Bimi", "Nona", "Lili", "Max", "Rex"],
};
let nega = ["Urejanje", "Higiena"];
let bimi = {
  ime: "Bimi",
  narocenNa: ["Pregled", "Pregled", "Urejanje"],
  datum: ["11.12.2023", "23.1.2024", "13.2.2024"],
  lastnik: "Peter Kos",
  veterinar: "Nina Mlinar",
  vetAmbulanta: "idk",
};
let nona = {
  ime: "Nona",
  narocenNa: ["Higiena", "Pregled"],
  datum: ["5.1.2024", "13.2.2024"],
  lastnik: "Peter Kos",
  veterinar: "Nina Mlinar",
  vetAmbulanta: "idk",
};
let lili = {
  ime: "Lili",
  narocenNa: ["Operacija", "Pregled", "Higiena"],
  datum: ["5.1.2024", "13.2.2024", "13.2.2024"],
  lastnik: "Peter Kos",
  veterinar: "Nina Mlinar",
  vetAmbulanta: "idk",
};
let max = {
  ime: "Max",
  narocenNa: ["Še ni naročen"],
  datum: ["/"],
  lastnik: "Peter Kos",
  veterinar: "Nina Mlinar",
  vetAmbulanta: "idk",
};
let rex = {
  ime: "Rex",
  narocenNa: ["Še ni naročen"],
  datum: ["/"],
  lastnik: "Peter Kos",
  veterinar: "Nina Mlinar",
  vetAmbulanta: "idk",
};
var client = {
  username: "Nina Mlinar",
  email: "ninamlinar@gmail.com",
  phone: "069245868",
  pass: "******",
};
var vsiKiCakajoNaPotrditev = [
  "Dr. Ana",
  "Dr. Mateja",
  "Dr. Lenart",
  "Dr. Matea",
  "Dr. Angela",
];
var uporabnik1 = {
  imePriimek: "Peter Kos",
  zival: "Bimi",
  datum: "11.12.2023",
  zahteva: "Odstranjevanje šivov po operaciji.",
  gmail: "peter.kos35@gmail.com",
};
var uporabnik2 = {
  imePriimek: "Angela Stopar",
  zival: "Roki",
  datum: "11.12.2023",
  zahteva: "Pregled po operaciji.",
  gmail: "angelastopar@gmail.com",
};
var uporabnik3 = {
  imePriimek: "Anže Osolnik",
  zival: "Bobi",
  datum: "11.12.2023",
  zahteva: "Pregled srca.",
  gmail: "anzeo66@gmail.com",
};
var uporabnik4 = {
  imePriimek: "Niki Kokol",
  zival: "Zia",
  datum: "11.12.2023",
  zahteva: "Pregled po operaciji.",
  gmail: "niki.kokol@gmail.com",
};
var uporabniki = ["Peter Kos", "Angela Stopar", "Anže Osolnik", "Niki Kokol"];
var glavniVet = {
  gmail: "glavnivet@gmail.com",
};
// Define an array to store events
let events = [];

// letiables to store event input fields and reminder list
let eventDateInput = document.getElementById("eventDate");
let lastnikInput = document.getElementById("lastnik");
let zivalInput = document.getElementById("žival");
let narocenInput = document.getElementById("naročen");
let uraInput = document.getElementById("ura");
let ustvarjenoInput = document.getElementById("ustvarjeno");
let opombeInput = document.getElementById("opombe");
let ustvarilInput = document.getElementById("ustvaril");
let reminderList = document.getElementById("reminderList");

// Counter to generate unique event IDs
let eventIdCounter = 1;

// Function to add events
function addEvent() {
  let date = eventDateInput.innerHTML;
  let title = lastnikInput.value;
  let description = zivalInput.value;

  if (date && title) {
    // Create a unique event ID
    let eventId = eventIdCounter++;

    events.push({
      id: eventId,
      date: date,
      title: title,
      description: description,
    });
    showCalendar(currentMonth, currentYear);
    eventDateInput.innerHTML = "";
    lastnikInput.value = "";
    zivalInput.value = "";
    narocenInput.value = "";
    uraInput.value = "";
    ustvarjenoInput.value = "";
    opombeInput = "";
    ustvarilInput = "";
    displayReminders();
  }
}

// Function to delete an event by ID
function deleteEvent(eventId) {
  // Find the index of the event with the given ID
  let eventIndex = events.findIndex((event) => event.id === eventId);

  if (eventIndex !== -1) {
    // Remove the event from the events array
    events.splice(eventIndex, 1);
    showCalendar(currentMonth, currentYear);
    displayReminders();
  }
  // Check if there are any rows to remove in the output table
  let outputTable = document.querySelector("#output tbody");
  if (outputTable.rows.length > 0) {
    // Remove the last row
    outputTable.deleteRow(outputTable.rows.length - 1);
  }
  document.getElementById("eventDate").innerHTML = "Ni izbranega datuma.";
}

// Function to display reminders
function displayReminders() {
  reminderList.innerHTML = "";
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    let eventDate = new Date(event.date);
    if (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    ) {
      let listItem = document.createElement("li");
      listItem.innerHTML = `<strong>${event.title}</strong> - 
            ${event.description}`;

      // Add a delete button for each reminder item
      let deleteButton = document.createElement("button");
      deleteButton.className = "delete-event";
      deleteButton.textContent = "Delete";
      deleteButton.onclick = function () {
        deleteEvent(event.id);
      };
      //listItem.appendChild(deleteButton);
      reminderList.appendChild(deleteButton);
    }
  }
}

// Function to generate a range of
// years for the year select input
function generate_year_range(start, end) {
  let years = "";
  for (let year = start; year <= end; year++) {
    years += "<option value='" + year + "'>" + year + "</option>";
  }
  return null;
}

// Initialize date-related letiables
today = new Date();
currentDay = today.getDay();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

createYear = generate_year_range(1970, 2050);

document.getElementById("year").innerHTML = createYear;

let calendar = document.getElementById("calendar");
let months = [
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
  "December",
];
let days = ["PON", "TOR", "SRE", "ČET", "PET", "SOB", "NED"];

$dataHead = "<tr>";
for (dhead in days) {
  $dataHead += "<th data-days='" + days[dhead] + "'>" + days[dhead] + "</th>";
}
$dataHead += "</tr>";

document.getElementById("thead-month").innerHTML = $dataHead;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

// Function to navigate to the next month
function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

// Function to navigate to the previous month
function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

// Function to display the calendar
function showCalendar(month, year) {
  let firstDay = new Date(year, month, 1).getDay() - 1;
  tbl = document.getElementById("calendar-body");
  tbl.innerHTML = "";
  monthAndYear.innerHTML = months[month] + " " + year;
  selectYear.value = year;
  selectMonth.value = month;

  let date = 1;
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        break;
      } else {
        cell = document.createElement("td");
        cell.setAttribute("data-date", date);
        cell.setAttribute("data-month", month + 1);
        cell.setAttribute("data-year", year);
        cell.setAttribute("data-month_name", months[month]);
        cell.className = "date-picker";
        cell.innerHTML = "<span>" + date + "</span";
        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          cell.className = "date-picker selected";
        }
        // Check if there are events on this date
        if (hasEventOnDate(date, month, year)) {
          cell.classList.add("event-marker");
          cell.appendChild(createEventTooltip(date, month, year));
        }

        row.appendChild(cell);
        date++;
      }
    }
    tbl.appendChild(row);
  }

  displayReminders();
}

// Function to create an event tooltip
function createEventTooltip(date, month, year) {
  let tooltip = document.createElement("div");
  tooltip.className = "event-tooltip";
  let eventsOnDate = getEventsOnDate(date, month, year);
  for (let i = 0; i < eventsOnDate.length; i++) {
    let event = eventsOnDate[i];
    let eventDate = new Date(event.date);
    let eventText = `<strong>${event.title}</strong> - 
            ${event.description}`;
    let eventElement = document.createElement("p");
    eventElement.innerHTML = eventText;
    tooltip.appendChild(eventElement);
  }
  return tooltip;
}

// Function to get events on a specific date
function getEventsOnDate(date, month, year) {
  return events.filter(function (event) {
    let eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date &&
      eventDate.getMonth() === month &&
      eventDate.getFullYear() === year
    );
  });
}

// Function to check if there are events on a specific date
function hasEventOnDate(date, month, year) {
  return getEventsOnDate(date, month, year).length > 0;
}

// Function to get the number of days in a month
function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

// Call the showCalendar function initially to display the calendar
showCalendar(currentMonth, currentYear);

//Clickable days
const tbody = document.querySelector("#calendar-body");
tbody.addEventListener("click", function (e) {
  const cell = e.target.closest("td");
  if (!cell) {
    return;
  } // Quit, not clicked on a cell
  const row = cell.parentElement;
  let x = (document.getElementById("eventDate").innerHTML =
    days[cell.cellIndex] +
    " - " +
    cell.innerHTML.replace(/[^0-9]/g, "") +
    ". " +
    monthAndYear.innerHTML);
  if (cell.innerHTML.replace(/[^0-9]/g, "") === "") {
    document.getElementById("eventDate").innerHTML = "Ni izbranega datuma.";
  }
});
document.getElementById("eventDate").innerHTML = "Ni izbranega datuma.";

function dodajDog() {
  document.getElementById("reminder-section").style.display = "block";
  document.getElementById("btnDodaj").style.display = "none";
}
function minDatum() {
  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  let z = (document.getElementById("ustvarjeno").value = now
    .toISOString()
    .slice(0, 16));
}
function add() {
  var datum = document.getElementById("eventDate");
  var lastnik = document.getElementById("lastnik");
  var zival = document.getElementById("žival");
  var narocen = document.getElementById("naročen");
  var ura = document.getElementById("ura");
  var ustvarjeno = document
    .getElementById("ustvarjeno")
    .value.replace("T", ", ");
  var opombe = document.getElementById("opombe");
  var ustvaril = document.getElementById("ustvaril");
  var odstrani = document.getElementsByClassName("delete-event");
  var output = document.querySelector("#output tbody");
  if (
    lastnik.value === "" ||
    zival.value === "" ||
    narocen.value === "" ||
    ura.value === "" ||
    ustvarjeno === "" ||
    ustvaril.value === ""
  ) {
    alert("Prosimo izpolnite vsa polja.");
    return;
  }
  if (datum.innerHTML === "Ni izbranega datuma.") {
    alert("Prosimo izberite datum.");
    return;
  }
  if (
    datum.innerHTML.slice(0, 3) === "SOB" ||
    datum.innerHTML.slice(0, 3) === "NED"
  ) {
    alert("Ob vikendih ambulanta ne obratuje");
    return;
  }
  if (
    ura.value.replace(/[^0-9]/g, "") < 700 ||
    ura.value.replace(/[^0-9]/g, "") > 1600
  ) {
    alert("Ambulanta obratuje PON-PET od 7:00 do 16:00");
    return;
  } else {
    output.innerHTML +=
      "<tr><th>" +
      datum.innerHTML.slice(6) +
      "</th><th>" +
      lastnik.value +
      "</th><th>" +
      zival.value +
      "</th>" +
      "<th>" +
      narocen.value +
      "</th><th>" +
      ura.value +
      "</th><th>" +
      ustvarjeno +
      "</th><th>" +
      opombe.value +
      "</th>" +
      "<th>" +
      ustvaril.value +
      "</th>" +
      '<th><ul id="reminderList">' +
      '        <li data-event-id="1">' +
      '           <button class="delete-event" onclick="deleteEvent(1)">' +
      '           <span class="material-symbols-outlined">delete</span>' +
      "           </button>" +
      "        </li>" +
      "     </ul></th></tr>";
  }
}
function izberiStr() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("str").innerHTML);
  document.getElementById("drpdwn1").style.display = "inline";
  document.getElementById("sortByStr").style.display = "block";
  document.getElementById("sortByPac").style.display = "none";
  document.getElementById("sortByVet").style.display = "none";
  document.getElementById("sortByVetAmb").style.display = "none";
  document.getElementById("sortByNega").style.display = "none";
  document.getElementById("sortByDatum").style.display = "none";
}
function izberiPac() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("pacient").innerHTML);
  document.getElementById("sortByPac").innerHTML = "";
  for (var bimiCount = 0; bimiCount < bimi.narocenNa.length; bimiCount++) {
    document.getElementById("sortByPac").innerHTML +=
      "<tr>" +
      "<th>" +
      bimi.narocenNa[bimiCount] +
      "</th>" +
      "<th>" +
      bimi.datum[bimiCount] +
      "</th>" +
      "<th>" +
      bimi.lastnik +
      "</th>" +
      "</tr>";
  }
  document.getElementById("drpdwn1").style.display = "none";
  document.getElementById("sortByStr").style.display = "none";
  document.getElementById("sortByPac").style.display = "block";
  document.getElementById("sortByVet").style.display = "none";
  document.getElementById("sortByVetAmb").style.display = "none";
  document.getElementById("sortByNega").style.display = "none";
  document.getElementById("sortByDatum").style.display = "none";
}
function izberiVet() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("vet").innerHTML);
  document.getElementById("sortByVet").innerHTML = "";
  for (var vetCount = 0; vetCount < veterinar.NinaMlinar.length; vetCount++) {
    if (veterinar.NinaMlinar[vetCount] === bimi.ime) {
      for (
        var zivalCount = 0;
        zivalCount < bimi.narocenNa.length;
        zivalCount++
      ) {
        document.getElementById("sortByVet").innerHTML +=
          "<tr>" +
          "<th>" +
          veterinar.NinaMlinar[vetCount] +
          "</th>" +
          "<th>" +
          bimi.narocenNa[zivalCount] +
          "</th>" +
          "<th>" +
          bimi.datum[zivalCount] +
          "</th>" +
          "</tr>";
      }
    } else if (veterinar.NinaMlinar[vetCount] === nona.ime) {
      vnesiVVetTab(nona, vetCount);
    } else if (veterinar.NinaMlinar[vetCount] === lili.ime) {
      vnesiVVetTab(lili, vetCount);
    } else if (veterinar.NinaMlinar[vetCount] === max.ime) {
      vnesiVVetTab(max, vetCount);
    } else if (veterinar.NinaMlinar[vetCount] === rex.ime) {
      vnesiVVetTab(rex, vetCount);
    }
  }
  document.getElementById("drpdwn1").style.display = "none";
  document.getElementById("sortByStr").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
  document.getElementById("sortByVet").style.display = "block";
  document.getElementById("sortByVetAmb").style.display = "none";
  document.getElementById("sortByNega").style.display = "none";
  document.getElementById("sortByDatum").style.display = "none";
}
function vnesiVVetTab(imeZivali, vetCount) {
  if (veterinar.NinaMlinar[vetCount] === imeZivali.ime) {
    for (
      var zivalCount = 0;
      zivalCount < imeZivali.narocenNa.length;
      zivalCount++
    ) {
      document.getElementById("sortByVet").innerHTML +=
        "<tr>" +
        "<th>" +
        veterinar.NinaMlinar[vetCount] +
        "</th>" +
        "<th>" +
        imeZivali.narocenNa[zivalCount] +
        "</th>" +
        "<th>" +
        imeZivali.datum[zivalCount] +
        "</th>" +
        "</tr>";
    }
  }
}
function izberiVetAmb() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("vetAmb").innerHTML);
  document.getElementById("sortByVetAmb").innerHTML = "";
  for (
    var vetAmbCount = 0;
    vetAmbCount < vetAmbulanta.idk.length;
    vetAmbCount++
  ) {
    if (vetAmbulanta.idk[vetAmbCount] === bimi.ime) {
      vnesiVVetAmbTab(bimi, vetAmbCount);
    } else if (vetAmbulanta.idk[vetAmbCount] === nona.ime) {
      vnesiVVetAmbTab(nona, vetAmbCount);
    } else if (vetAmbulanta.idk[vetAmbCount] === lili.ime) {
      vnesiVVetAmbTab(lili, vetAmbCount);
    } else if (vetAmbulanta.idk[vetAmbCount] === max.ime) {
      vnesiVVetAmbTab(max, vetAmbCount);
    } else if (vetAmbulanta.idk[vetAmbCount] === rex.ime) {
      vnesiVVetAmbTab(rex, vetAmbCount);
    }
  }
  document.getElementById("drpdwn1").style.display = "none";
  document.getElementById("sortByStr").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
  document.getElementById("sortByVet").style.display = "none";
  document.getElementById("sortByVetAmb").style.display = "block";
  document.getElementById("sortByNega").style.display = "none";
  document.getElementById("sortByDatum").style.display = "none";
}
function vnesiVVetAmbTab(imeZivali, vetCount) {
  if (veterinar.NinaMlinar[vetCount] === imeZivali.ime) {
    for (
      var zivalCount = 0;
      zivalCount < imeZivali.narocenNa.length;
      zivalCount++
    ) {
      document.getElementById("sortByVetAmb").innerHTML +=
        "<tr>" +
        "<th>" +
        vetAmbulanta.idk[vetCount] +
        "</th>" +
        "<th>" +
        imeZivali.narocenNa[zivalCount] +
        "</th>" +
        "<th>" +
        imeZivali.datum[zivalCount] +
        "</th>" +
        "</tr>";
    }
  }
}
function izberiNega() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("nega").innerHTML);
  document.getElementById("sortByNega").innerHTML = "";
  vnesiVNegaTab(bimi);
  vnesiVNegaTab(nona);
  vnesiVNegaTab(lili);
  vnesiVNegaTab(max);
  vnesiVNegaTab(rex);
  document.getElementById("drpdwn1").style.display = "none";
  document.getElementById("sortByStr").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
  document.getElementById("sortByVet").style.display = "none";
  document.getElementById("sortByVetAmb").style.display = "none";
  document.getElementById("sortByNega").style.display = "block";
  document.getElementById("sortByDatum").style.display = "none";
}
function vnesiVNegaTab(imeZival) {
  for (var negaCount = 0; negaCount < nega.length; negaCount++) {
    for (
      var zivalCount = 0;
      zivalCount < imeZival.narocenNa.length;
      zivalCount++
    ) {
      if (nega[negaCount] === imeZival.narocenNa[zivalCount]) {
        document.getElementById("sortByNega").innerHTML +=
          "<tr>" +
          "<th>" +
          imeZival.ime +
          "</th>" +
          "<th>" +
          nega[negaCount] +
          "</th>" +
          "<th>" +
          imeZival.datum[zivalCount] +
          "</th>" +
          "</tr>";
      }
    }
  }
}
function izberiDat() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("dat").innerHTML);
  document.getElementById("sortByDatum").innerHTML = "";
  var datum = "13.2.2024";
  vnesiVDatTab(bimi, datum);
  vnesiVDatTab(nona, datum);
  vnesiVDatTab(lili, datum);
  vnesiVDatTab(max, datum);
  vnesiVDatTab(rex, datum);
  document.getElementById("drpdwn1").style.display = "none";
  document.getElementById("sortByStr").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
  document.getElementById("sortByVet").style.display = "none";
  document.getElementById("sortByVetAmb").style.display = "none";
  document.getElementById("sortByNega").style.display = "none";
  document.getElementById("sortByDatum").style.display = "block";
}
function vnesiVDatTab(imeZival, datum) {
  for (var zivalCount = 0; zivalCount < imeZival.datum.length; zivalCount++) {
    if (datum === imeZival.datum[zivalCount]) {
      document.getElementById("sortByDatum").innerHTML +=
        "<tr>" +
        "<th>" +
        imeZival.lastnik +
        "</th>" +
        "<th>" +
        imeZival.ime +
        "</th>" +
        "<th>" +
        imeZival.narocenNa[zivalCount] +
        "</th>" +
        "<th>" +
        imeZival.datum[zivalCount] +
        "</th>" +
        "</tr>";
    }
  }
}
function izberiBimi() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("bimi").innerHTML);
  document.getElementById("sortByStr").innerHTML = "";
  for (var bimiCount = 0; bimiCount < bimi.narocenNa.length; bimiCount++) {
    document.getElementById("sortByStr").innerHTML +=
      "<tr>" +
      "<th>" +
      bimi.ime +
      "</th>" +
      "<th>" +
      bimi.narocenNa[bimiCount] +
      "</th>" +
      "<th>" +
      bimi.datum[bimiCount] +
      "</th>" +
      "</tr>";
  }
}
function izberiNona() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("nona").innerHTML);
  document.getElementById("sortByStr").innerHTML = "";
  for (var nonaCount = 0; nonaCount < nona.narocenNa.length; nonaCount++) {
    document.getElementById("sortByStr").innerHTML +=
      "<tr>" +
      "<th>" +
      nona.ime +
      "</th>" +
      "<th>" +
      nona.narocenNa[nonaCount] +
      "</th>" +
      "<th>" +
      nona.datum[nonaCount] +
      "</th>" +
      "</tr>";
  }
}
function izberiLili() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("lili").innerHTML);
  document.getElementById("sortByStr").innerHTML = "";
  for (var liliCount = 0; liliCount < lili.narocenNa.length; liliCount++) {
    document.getElementById("sortByStr").innerHTML +=
      "<tr>" +
      "<th>" +
      lili.ime +
      "</th>" +
      "<th>" +
      lili.narocenNa[liliCount] +
      "</th>" +
      "<th>" +
      lili.datum[liliCount] +
      "</th>" +
      "</tr>";
  }
}
function izberiMax() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("max").innerHTML);
  document.getElementById("sortByStr").innerHTML = "";
  for (var maxCount = 0; maxCount < max.narocenNa.length; maxCount++) {
    document.getElementById("sortByStr").innerHTML +=
      "<tr>" +
      "<th>" +
      max.ime +
      "</th>" +
      "<th>" +
      max.narocenNa[maxCount] +
      "</th>" +
      "<th>" +
      max.datum[maxCount] +
      "</th>" +
      "</tr>";
  }
}
function izberiRex() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("rex").innerHTML);
  document.getElementById("sortByStr").innerHTML = "";
  for (var rexCount = 0; rexCount < rex.narocenNa.length; rexCount++) {
    document.getElementById("sortByStr").innerHTML +=
      "<tr>" +
      "<th>" +
      rex.ime +
      "</th>" +
      "<th>" +
      rex.narocenNa[rexCount] +
      "</th>" +
      "<th>" +
      rex.datum[rexCount] +
      "</th>" +
      "</tr>";
  }
}
function showPopupLogin() {
  popuplogin.classList.add("show");
}

function hidePopupLogin() {
  popuplogin.classList.remove("show");
}
var clientuser = document.getElementById("profileNameInput");
var clientemail = document.getElementById("profileEmailInput");
var clientphone = document.getElementById("profilePhoneInput");
var clientpass = document.getElementById("profilerepasswordnewInput");

function insertClientInfo() {
  clientuser.value = capitalize_letter(client.username);
  clientemail.value = capitalize_letter(client.email);
  clientphone.value = capitalize_letter(client.phone);
}
function capitalize_letter(s) {
  return s;
}
window.onload = function () {
  insertClientInfo();
};
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
document.getElementById("zavrni").value = "Začnite pisati...";
function pokaziSprejmiNovVet() {
  alertPopup.classList.add("show");
}
function skrijSprejmiNovVet() {
  alertPopup.classList.remove("show");
}
for (var i = 0; i < vsiKiCakajoNaPotrditev.length; i++) {
  recieve_ask(vsiKiCakajoNaPotrditev[i]);
}
function recieve_ask(kdoZeliReg) {
  var alertPopup = document.getElementById("alertPopup");
  alertPopup.innerHTML +=
    '<div class="alert alert-success" role="alert" onclick="removeAlert(this)">' +
    kdoZeliReg +
    '<button class="btn btn-secondary" style="float: right">Deny</button> <button class="btn btn-primary" style="float: right">Accept</button>' +
    "</div>";
}
function removeAlert(x) {
  x.remove();
  if (
    document.getElementById("alertPopup").innerHTML.includes("alert") === false
  ) {
    document.getElementById("bell").style.color = "#454545";
  } else {
    document.getElementById("bell").style.color = "#F3E38B";
  }
}
if (
  document.getElementById("alertPopup").innerHTML.includes("alert") === false
) {
  document.getElementById("bell").style.color = "#454545";
} else {
  document.getElementById("bell").style.color = "#F3E38B";
}
function posvInZdrTveganje() {
  document.getElementById("posInZdrTveganjeTab").innerHTML = "";
  for (var upCount = 0; upCount < uporabniki.length; upCount++) {
    if (uporabniki[upCount] === uporabnik1.imePriimek) {
      document.getElementById("posInZdrTveganjeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq1()">' +
        uporabnik1.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik1.zival +
        "</td>" +
        "<td>" +
        uporabnik1.datum +
        "</td>";
      document.getElementById("popupReq1").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik1.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi()">Zavrni</button>' +
        '       <div id="izberiDat" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji1()">' +
        '                       <a id="komuPosljem">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq1()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik2.imePriimek) {
      document.getElementById("posInZdrTveganjeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq2()">' +
        uporabnik2.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik2.zival +
        "</td>" +
        "<td>" +
        uporabnik2.datum +
        "</td>";
      document.getElementById("popupReq2").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik2.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni2()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi2()">Zavrni</button>' +
        '       <div id="izberiDat2" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav2">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni2" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji2()">' +
        '                       <a id="komuPosljem2">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq2()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik3.imePriimek) {
      document.getElementById("posInZdrTveganjeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq3()">' +
        uporabnik3.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik3.zival +
        "</td>" +
        "<td>" +
        uporabnik3.datum +
        "</td>";
      document.getElementById("popupReq3").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik3.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni3()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi3()">Zavrni</button>' +
        '       <div id="izberiDat3" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav3">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni3" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji3">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji3()">' +
        '                       <a id="komuPosljem3">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq3()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik4.imePriimek) {
      document.getElementById("posInZdrTveganjeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq4()">' +
        uporabnik4.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik4.zival +
        "</td>" +
        "<td>" +
        uporabnik4.datum +
        "</td>";
      document.getElementById("popupReq4").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik4.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni4()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi4()">Zavrni</button>' +
        '       <div id="izberiDat4" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav4">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni4" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji4">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji4()">' +
        '                       <a id="komuPosljem4">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq4()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    }
  }
  document.getElementById("posInZdrTveganjeTab").style.display = "block";
  document.getElementById("operacijeInNujnoTab").style.display = "none";
  document.getElementById("zunanjePoskodbeTab").style.display = "none";
  document.getElementById("notranjePoskodbeTab").style.display = "none";
}
function operacijeInNujno() {
  document.getElementById("operacijeInNujnoTab").innerHTML = "";
  for (var upCount = 0; upCount < uporabniki.length; upCount++) {
    if (uporabniki[upCount] === uporabnik1.imePriimek) {
      document.getElementById("operacijeInNujnoTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq1()">' +
        uporabnik1.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik1.zival +
        "</td>" +
        "<td>" +
        uporabnik1.datum +
        "</td>";
      document.getElementById("popupReq1").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik1.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi()">Zavrni</button>' +
        '       <div id="izberiDat" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji1()">' +
        '                       <a id="komuPosljem">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq1()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik2.imePriimek) {
      document.getElementById("operacijeInNujnoTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq2()">' +
        uporabnik2.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik2.zival +
        "</td>" +
        "<td>" +
        uporabnik2.datum +
        "</td>";
      document.getElementById("popupReq2").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik2.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni2()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi2()">Zavrni</button>' +
        '       <div id="izberiDat2" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav2">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni2" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji2">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji2()">' +
        '                       <a id="komuPosljem2">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq2()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik3.imePriimek) {
      document.getElementById("operacijeInNujnoTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq3()">' +
        uporabnik3.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik3.zival +
        "</td>" +
        "<td>" +
        uporabnik3.datum +
        "</td>";
      document.getElementById("popupReq3").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik3.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni3()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi3()">Zavrni</button>' +
        '       <div id="izberiDat3" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav3">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni3" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji3()">' +
        '                       <a id="komuPosljem3">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq3()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    }
  }
  document.getElementById("posInZdrTveganjeTab").style.display = "none";
  document.getElementById("operacijeInNujnoTab").style.display = "block";
  document.getElementById("zunanjePoskodbeTab").style.display = "none";
  document.getElementById("notranjePoskodbeTab").style.display = "none";
}
function zunanjePoskodbe() {
  document.getElementById("zunanjePoskodbeTab").innerHTML = "";
  for (var upCount = 0; upCount < uporabniki.length; upCount++) {
    if (uporabniki[upCount] === uporabnik1.imePriimek) {
      document.getElementById("zunanjePoskodbeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq1()">' +
        uporabnik1.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik1.zival +
        "</td>" +
        "<td>" +
        uporabnik1.datum +
        "</td>";
      document.getElementById("popupReq1").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik1.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi()">Zavrni</button>' +
        '       <div id="izberiDat" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji1()">' +
        '                       <a id="komuPosljem">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq1()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik2.imePriimek) {
      document.getElementById("zunanjePoskodbeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq2()">' +
        uporabnik2.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik2.zival +
        "</td>" +
        "<td>" +
        uporabnik2.datum +
        "</td>";
      document.getElementById("popupReq2").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik2.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni2()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi2()">Zavrni</button>' +
        '       <div id="izberiDat2" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav2">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni2" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji2" onclick="pošlji2()">' +
        '                       <a id="komuPosljem2">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq2()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik4.imePriimek) {
      document.getElementById("zunanjePoskodbeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq4()">' +
        uporabnik4.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik4.zival +
        "</td>" +
        "<td>" +
        uporabnik4.datum +
        "</td>";
      document.getElementById("popupReq4").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik4.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni4()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi4()">Zavrni</button>' +
        '       <div id="izberiDat4" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav4">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni4" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji4()">' +
        '                       <a id="komuPosljem4">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq4()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    }
  }
  document.getElementById("posInZdrTveganjeTab").style.display = "none";
  document.getElementById("operacijeInNujnoTab").style.display = "none";
  document.getElementById("zunanjePoskodbeTab").style.display = "block";
  document.getElementById("notranjePoskodbeTab").style.display = "none";
}
function notranjePoskodbe() {
  document.getElementById("notranjePoskodbeTab").innerHTML = "";
  for (var upCount = 0; upCount < uporabniki.length; upCount++) {
    if (uporabniki[upCount] === uporabnik1.imePriimek) {
      document.getElementById("notranjePoskodbeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq1()">' +
        uporabnik1.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik1.zival +
        "</td>" +
        "<td>" +
        uporabnik1.datum +
        "</td>";
      document.getElementById("popupReq1").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik1.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi()">Zavrni</button>' +
        '       <div id="izberiDat" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji" onclick="pošlji1()">' +
        '                       <a id="komuPosljem">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq1()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    } else if (uporabniki[upCount] === uporabnik2.imePriimek) {
      document.getElementById("notranjePoskodbeTab").innerHTML +=
        "" +
        '<td class="ime" onclick="showPopupReq2()">' +
        uporabnik2.imePriimek +
        '<span class="material-symbols-outlined">arrow_right</span>' +
        "</td>" +
        "<td>" +
        uporabnik2.zival +
        "</td>" +
        "<td>" +
        uporabnik2.datum +
        "</td>";
      document.getElementById("popupReq2").innerHTML =
        "" +
        '<div style="flex-direction: column">' +
        '   <div id="zahteva">' +
        '       <span style="font-weight: bold">Zahteva:</span><br>' +
        uporabnik2.zahteva +
        "   </div>" +
        '   <div class="gumba">' +
        '       <button class="btn btn-primary gumb1" onclick="remZavrni2()">Izberi datum</button>' +
        '       <button class="btn btn-primary gumb2" onclick="remIzberi2()">Zavrni</button>' +
        '       <div id="izberiDat2" class="izberiDat">Preverite koledar za proste datume.</div>' +
        '           <div class="zavrni" id="zav2">' +
        '               <span class="odgovorStr">Odgovorite stranki:</span>' +
        '               <textarea class="card-text odgovor" id="zavrni2" name="zavrnjenMail"></textarea>' +
        '               <div class="pošlji">' +
        '                   <button type="submit" class="btn btn-primary gumb3" id="pošlji2" onclick="pošlji2()">' +
        '                       <a id="komuPosljem2">' +
        "                       Pošlji" +
        "                       </a>" +
        "                   </button>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        '       <div class="pointer" onclick="hidePopupReq2()">' +
        '           <i class="fa-solid fa-x" style="position: absolute; top: 10px; right: 10px;"></i>' +
        "       </div>" +
        "   </div>" +
        "</div>";
    }
  }
  document.getElementById("posInZdrTveganjeTab").style.display = "none";
  document.getElementById("operacijeInNujnoTab").style.display = "none";
  document.getElementById("zunanjePoskodbeTab").style.display = "none";
  document.getElementById("notranjePoskodbeTab").style.display = "block";
}
function showPopupReq1() {
  popupReq1.classList.add("show");
}
function hidePopupReq1() {
  popupReq1.classList.remove("show");
}
function pošlji1() {
  let vsebina = encodeURIComponent(document.getElementById("zavrni").value);
  document.getElementById("komuPosljem").href =
    "" +
    "mailto:" +
    uporabnik1.gmail +
    "?cc=" +
    glavniVet.gmail +
    "&subject=Zavrnjen%20poskus%20naročanja&" +
    "body=" +
    vsebina;
}
function showPopupReq2() {
  popupReq2.classList.add("show");
}
function hidePopupReq2() {
  popupReq2.classList.remove("show");
}
function pošlji2() {
  let vsebina = encodeURIComponent(document.getElementById("zavrni2").value);
  document.getElementById("komuPosljem2").href =
    "" +
    "mailto:" +
    uporabnik2.gmail +
    "?cc=" +
    glavniVet.gmail +
    "&subject=Zavrnjen%20poskus%20naročanja&" +
    "body=" +
    vsebina;
}
function showPopupReq3() {
  popupReq3.classList.add("show");
}
function hidePopupReq3() {
  popupReq3.classList.remove("show");
}
function pošlji3() {
  let vsebina = encodeURIComponent(document.getElementById("zavrni3").value);
  document.getElementById("komuPosljem3").href =
    "" +
    "mailto:" +
    uporabnik3.gmail +
    "?cc=" +
    glavniVet.gmail +
    "&subject=Zavrnjen%20poskus%20naročanja&" +
    "body=" +
    vsebina;
}
function showPopupReq4() {
  popupReq4.classList.add("show");
}
function hidePopupReq4() {
  popupReq4.classList.remove("show");
}
function pošlji4() {
  let vsebina = encodeURIComponent(document.getElementById("zavrni4").value);
  document.getElementById("komuPosljem4").href =
    "" +
    "mailto:" +
    uporabnik4.gmail +
    "?cc=" +
    glavniVet.gmail +
    "&subject=Zavrnjen%20poskus%20naročanja&" +
    "body=" +
    vsebina;
}
function remZavrni() {
  document.getElementById("izberiDat").style.display = "block";
  document.getElementById("zav").style.display = "none";
}
function remIzberi() {
  document.getElementById("izberiDat").style.display = "none";
  document.getElementById("zav").style.display = "block";
}
function remZavrni2() {
  document.getElementById("izberiDat2").style.display = "block";
  document.getElementById("zav2").style.display = "none";
}
function remIzberi2() {
  document.getElementById("izberiDat2").style.display = "none";
  document.getElementById("zav2").style.display = "block";
}
function remZavrni3() {
  document.getElementById("izberiDat3").style.display = "block";
  document.getElementById("zav3").style.display = "none";
}
function remIzberi3() {
  document.getElementById("izberiDat3").style.display = "none";
  document.getElementById("zav3").style.display = "block";
}
function remZavrni4() {
  document.getElementById("izberiDat4").style.display = "block";
  document.getElementById("zav4").style.display = "none";
}
function remIzberi4() {
  document.getElementById("izberiDat4").style.display = "none";
  document.getElementById("zav4").style.display = "block";
}
