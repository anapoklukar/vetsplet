# 🐶 **VetSplet** 🐱

Group project for the **Web Programming** course at the **University of Ljubljana, Faculty of Computer and Information Science** during the **2023/2024** academic year.

### **Authors:**
- Matej Ferk ([MatejaF](https://github.com/MatejaF))
- Angela Ilioska ([ailioska](https://github.com/ailioska))
- Lenart Marjanovič ([lenart111](https://github.com/lenart111))
- Ana Poklukar ([anapoklukar](link))
- Matea Velichkovska ([velichkovskaM](https://github.com/velichkovskaM))

---

**VetSplet** addresses the growing demand for pet care services by providing a platform where pet owners can easily find and book appointments with local veterinarians. While many platforms focus on child care, VetSplet caters specifically to pets.

### **Key Features:**
- **Veterinarians:** Can promote their services and manage appointments through an intuitive dashboard.
- **Pet Owners:** Browse veterinary services, book appointments, and receive email reminders for upcoming visits.
- **Notifications:** Appointment confirmations and reminders are sent to both veterinarians and clients.
- **Schedule Management:** Veterinarians can manage their schedules, and clients can approve appointments through the website.

---

### **Application Pages Overview:**

<img src="docs/loginPage.png"/>

> _Guests can register as veterinarians or clients, log into an existing account, or explore the site as a guest._  
The design is optimized for laptops, tablets, and mobile devices.

- **Guests:** Can browse as **GUESTS** or choose to register as **VETERINARIANS** or **CLIENTS**.
- **Registration Forms:** Separate forms for veterinarians, clients, and clinic registration.
- **Cross-Browser Compatibility:** Consistent performance across Chrome, Opera, and Brave.

---

<img src="docs/registriranUporabnik-updated.png"/>

> _A user logs in as a **CLIENT**._  
Clients can add pets and associate them with specific clinics.

---

<img src="docs/loginVeterinar-updated.png"/>

> _Veterinarians can register their clinics and access the veterinarian dashboard._

- **Veterinarians:** Register clinics with detailed information (name, address, contact details, etc.), and manage staff under the clinic's profile.
- **Chief Veterinarians:** Can approve new veterinarians and manage clinic schedules.

---

### **VetSplet Dashboards**

#### **Veterinarian Dashboard**

<img src="docs/veterinarPage.png"/>

- **Upper Left:** Appointment management, filters by veterinarian, animal, or owner, and email notifications.
- **Upper Right:** Scheduling calendar with selected dates.
- **Bottom:** A table displaying all scheduled animals and appointments.

#### **Client Dashboard**

<img src="docs/strankaPage.png"/>

- **Left:** Personal information and pet profiles.
- **Middle:** Appointment scheduling and veterinarian requests.
- **Right:** Clinic details and clinic carousel.

---

<img src="docs/guestPage.png"/>

> _Guests can explore the website and learn more about VetSplet without registering._

---

### **Instructions for Running VetSplet Locally:**

1. Ensure Docker is installed and all dependencies are loaded with `npm install`.
2. From the project’s root directory, start MongoDB:  
   ```bash
   docker-compose up mongo-db
   ```
3. Launch the Node.js application:  
   ```bash
   npm start
   ```
4. Access the application via [http://localhost:3000](http://localhost:3000).

---

### **Instructions for Cloud Launch:**

1. Set up a `.env` file with the following MongoDB Atlas URI:  
   ```bash
   MONGODB_ATLAS_URI=mongodb+srv://***:***@vetsplet.sy2kprx.mongodb.net/?retryWrites=true&w=majority
   ```
2. Run the application in production mode:  
   ```bash
   NODE_ENV=production nodemon
   ```

---

### **Running in Test Environment:**

1. Build the Docker image:  
   ```bash
   docker-compose build --no-cache node-api
   ```
2. Run the Docker image:  
   ```bash
   docker-compose up --force-recreate --no-deps -d node-api
   ```
3. View logs:  
   ```bash
   docker logs vetsplet-app
   ```
4. Start in test mode:  
   ```bash
   NODE_ENV=test nodemon
   ```

---

### **Additional Libraries Used:**
- **[Compression](https://www.npmjs.com/package/compression):** Compresses communication between server and client to improve transfer speeds.
- **[Morgan](https://www.npmjs.com/package/morgan):** Logs HTTP requests for better tracking of traffic and user activity.

---

### **Master-Detail Pattern:**
- Implemented in the client dashboard for selecting a pet and viewing detailed information about that animal.

<img src="docs/master_detail.png"/>

---

### **Decentralized Application (DApp) on Blockchain:**

VetSplet includes a token-based system where clients can earn discount tokens for appointments made via the platform, with payments made in ETH. Clients earn tokens when an appointment is canceled and can redeem them for future discounts.

**DApp Features:**
- User registration and token management
- ETH payments for appointments
- Token-based discounts for clients
- VetSplet handles token distribution through veterinarians
- Clients can redeem tokens but cannot delete orders

<img src="docs/tokens.png"/>