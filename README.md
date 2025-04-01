# **Airline Reservation System**

## **Project Overview**

The **Airline Reservation System** is a web-based platform that allows users to search for flights, book tickets, make payments, and manage their reservations. Additionally, an **admin panel** is included where administrators can add flights and airlines.

## **Technologies Used**

* **Frontend**: Vite \+ React

* **Backend**: Node.js \+ Express.js

* **Database**: PostgreSQL

* **Payment Gateway**: Stripe

## **Features**

### **User Features**

* User registration and login

* Flight search with filters

* Ticket booking and seat selection

* Secure payment processing via Stripe

* Booking confirmation and ticket viewing

* Printable e-tickets

### **Admin Features**

* Admin login

* Add, update, and delete flights

* Manage airlines

## **Setup Instructions**

### **Prerequisites**

Make sure you have the following installed:

* Node.js (v18 or later recommended)

* PostgreSQL

* Git

### **Environment Variables**

Create a `.env` file in the backend directory and include the following:

DB\_HOST=your\_postgres\_host  
DB\_USER=your\_postgres\_username  
DB\_PASSWORD=your\_postgres\_password  
DB\_NAME=your\_database\_name  
DB\_PORT=5432 (default)  
STRIPE\_SECRET\_KEY=your\_stripe\_secret\_key  
JWT\_SECRET=your\_jwt\_secret\_key

### **Installation & Running the Project**

#### **Backend Setup**

Navigate to the backend directory:

 cd backend

1. 

Install dependencies:

 npm install

2. 

Start the backend server:

 node server.js

3. 

#### **Frontend Setup**

Navigate to the frontend directory:

 cd frontend

1. 

Install dependencies:

 npm install

2. 

Start the frontend server:

 npm run dev

3. 

## **API Endpoints**

### **Authentication**

* `POST /api/user/register` \- Register a new user

* `POST /api/user/login` \- Log in a user

* `POST /api/admin/register` \- Register a new admin

* `POST /api/admin/login` \- Admin login

### **Flights**

* `GET /api/flights` \- Get available flights

* `GET /api/flights/:id` \- Get flight details

* `POST /api/admin/flights` \- Add a new flight (Admin only)

* `PUT /api/admin/flights/:id` \- Update flight details (Admin only)

* `DELETE /api/admin/flights/:id` \- Remove a flight (Admin only)

### **Airlines**

* `POST /api/admin/airlines` \- Add a new airline (Admin only)

* `GET /api/airlines` \- Get list of airlines

### **Booking**

* `POST /api/bookings` \- Create a booking

* `GET /api/bookings/:userId` \- Get user bookings

### **Payments**

* `POST /api/payments` \- Process a payment

## **User Manual**

1. **Sign Up/Login** \- Users and admins can create an account or log in.

2. **Search Flights** \- Users can search for available flights.

3. **Book Tickets** \- Users can select seats and proceed to payment.

4. **Make Payment** \- Securely pay using Stripe.

5. **Admin Panel** \- Admins can log in and manage flights and airlines.

6. **View & Print Tickets** \- Users can access their bookings and print e-tickets.

## **Contribution**

If you'd like to contribute:

1. Fork the repository.

2. Create a new branch (`feature-xyz`).

3. Commit your changes and push.

4. Submit a pull request.

## **License**

This project is open-source and available under the MIT License.

## **Contact**

For any issues or inquiries, please reach out via GitHub or email at shinitks7@gmail.com.

