// script.js

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
let porociloInput = document.getElementById("poročilo");
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
    porociloInput = "";
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
/*function displayReminders() {
    reminderList.innerHTML = "";
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let eventDate = new Date(event.date);
        if (eventDate.getMonth() ===
            currentMonth &&
            eventDate.getFullYear() ===
            currentYear) {
            let listItem = document.createElement("li");
            listItem.innerHTML =
                `<strong>${event.title}</strong> - 
            ${event.description}`;

            // Add a delete button for each reminder item
            let deleteButton =
                document.createElement("button");
            deleteButton.className = "delete-event";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                deleteEvent(event.id);
            };
            //listItem.appendChild(deleteButton);
            reminderList.appendChild(deleteButton);
        }
    }
}*/

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

  //displayReminders();
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
const popup = document.querySelector("#popup");
const popupDateText = document.querySelector("#popupDateText");
const meetingTypeNode = document.querySelector("#meetingType");

tbody.addEventListener("click", function (e) {
  const cell = e.target.closest("td");
  if (!cell) {
    return;
  } // Quit, not clicked on a cell

  if (meetingTypeText === "") {
    return;
  }

  selectedDate = cell.dataset;

  popup.classList.add("show");
  transperentPop.classList.remove("hide");

  popupDateText.innerText =
    cell.dataset.date + "." + cell.dataset.month + "." + cell.dataset.year;
  meetingTypeNode.innerText = meetingTypeText;
});
//document.getElementById("eventDate").innerHTML = "Ni izbranega datuma.";

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
      '<input type="button" id="addEvent" class="buttonPorocilo" value="+">' +
      "</th><th>" +
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
}
function izberiPac() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("pacient").innerHTML);
  document.getElementById("drpdwn1").style.display = "none";
  document.getElementById("sortByBimi").style.display = "none";
  document.getElementById("sortByNona").style.display = "none";
  document.getElementById("sortByLili").style.display = "none";
  document.getElementById("sortByPac").style.display = "block";
}
function izberiVet() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("vet").innerHTML);
  document.getElementById("drpdwn1").style.display = "none";
}
function izberiVetAmb() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("vetAmb").innerHTML);
  document.getElementById("drpdwn1").style.display = "none";
}
function izberiNega() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("nega").innerHTML);
  document.getElementById("drpdwn1").style.display = "none";
}
function izberiDat() {
  let x = (document.getElementById("drpdwn").innerHTML =
    document.getElementById("dat").innerHTML);
  document.getElementById("drpdwn1").style.display = "none";
}

function izberiBimi() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("bimi").innerHTML);
  document.getElementById("sortByBimi").style.display = "block";
  document.getElementById("sortByNona").style.display = "none";
  document.getElementById("sortByLili").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
}
function izberiNona() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("nona").innerHTML);
  document.getElementById("sortByBimi").style.display = "none";
  document.getElementById("sortByNona").style.display = "block";
  document.getElementById("sortByLili").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
}
function izberiLili() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("lili").innerHTML);
  document.getElementById("sortByBimi").style.display = "none";
  document.getElementById("sortByNona").style.display = "none";
  document.getElementById("sortByLili").style.display = "block";
  document.getElementById("sortByPac").style.display = "none";
}
function izberiRex() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("rex").innerHTML);
  document.getElementById("sortByBimi").style.display = "none";
  document.getElementById("sortByNona").style.display = "none";
  document.getElementById("sortByLili").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
}
function izberiMax() {
  let x = (document.getElementById("drpdwn1").innerHTML =
    document.getElementById("max").innerHTML);
  document.getElementById("sortByBimi").style.display = "none";
  document.getElementById("sortByNona").style.display = "none";
  document.getElementById("sortByLili").style.display = "none";
  document.getElementById("sortByPac").style.display = "none";
}

function pokaziTekst() {
  if (document.getElementById("ik1").checked) {
    let x = (document.getElementById("crd-txt").innerHTML +=
      '<table class="table table-sm table-bordered" id="sortBy">' +
      "   <tr>" +
      "       <th>Peter Kos</th>" +
      "       <th>Bimi</th>" +
      "       <th>12.11.2023</th>" +
      "   </tr>" +
      "   <tr>" +
      "       <th>/</th>" +
      "       <th>/</th>" +
      "       <th>/</th>" +
      "   </tr>" +
      "   <tr>" +
      "       <th>/</th>" +
      "       <th>/</th>" +
      "       <th>/</th>" +
      "   </tr>" +
      "   <tr>" +
      "       <th>/</th>" +
      "       <th>/</th>" +
      "       <th>/</th>" +
      "   </tr>" +
      "</table>");
  }
}

function ostani() {
  document.getElementById("zav").style.display = "inline";
}
function rem() {
  document.getElementById("zav").style.display = "none";
}
function ostani1() {
  document.getElementById("zav1").style.display = "inline";
}
function rem1() {
  document.getElementById("zav1").style.display = "none";
}
function ostani2() {
  document.getElementById("zav2").style.display = "inline";
}
function rem2() {
  document.getElementById("zav2").style.display = "none";
}
function ostani3() {
  document.getElementById("zav3").style.display = "inline";
}
function rem3() {
  document.getElementById("zav3").style.display = "none";
}
