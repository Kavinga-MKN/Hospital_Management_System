# 🏥 CareSync - Hospital Management System

A modern, full-stack Hospital Management System designed to streamline healthcare administration. Built with an optimized **Charcoal & Mint** design system, this platform empowers healthcare staff (Administrators, Doctors, Nurses, etc.) to securely manage patients, appointments, billing, and pharmacy inventories.

---

## ✨ Features & Architecture

*   **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide React Icons, Recharts (for analytics).
*   **Backend**: Node.js, Express, strict JWT Authentication.
*   **Database**: MySQL (relational database handling medical records and role bindings).
*   **Design**: Distinct role-based dashboards, cohesive healthcare SaaS layout, fully responsive.

---

## 🚀 Step-by-Step Setup Guide (For Recruiters/Evaluators)

Follow these exact steps to run the application locally on your machine.

### 1. Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [XAMPP](https://www.apachefriends.org/index.html) (or any local MySQL server like WAMP or MySQL Workbench)

### 2. Database Setup (Crucial)
Because this application relies on a robust relational database, you must initialize the MySQL schemas first.

1.  Open **XAMPP Control Panel** and click **Start** next to **Apache** and **MySQL**.
2.  Open your browser and navigate to `http://localhost/phpmyadmin`.
3.  Click **New** on the left sidebar to create a new database.
4.  Name the database **`hospital_management`** and click **Create**.
5.  Select the `hospital_management` database you just created.
6.  Click the **Import** tab at the top.
7.  Click **Choose File** and locate `database/schema.sql` inside this project repository. Click **Import** at the very bottom right.
8.  *After the schema finishes importing*, click **Choose File** again.
9.  This time, select `database/seed.sql` and click **Import**. This will inject all the necessary mock roles, departments, and demo accounts!

*(Alternatively, you can just start MySQL and run `node src/init-db.js` inside the `backend` folder!)*

### 3. Backend Setup

1.  Open a terminal inside the root project directory.
2.  Navigate to the backend:
    ```bash
    cd backend
    ```
3.  Install the required dependencies:
    ```bash
    npm install
    ```
4.  *(Optional but recommended)*: Review the `.env` file in the backend folder to ensure `DB_USER` and `DB_PASS` match your XAMPP setup (default XAMPP is usually `user: root` and empty password).
5.  Start the backend server:
    ```bash
    npm start
    ```
    ✅ You should see: `Server is running on port 5000` and `Database connected successfully!`. Keep this terminal open!

### 4. Frontend Setup

1.  Open a **new, separate terminal** inside the root project directory.
2.  Navigate to the frontend:
    ```bash
    cd frontend
    ```
3.  Install the user interface dependencies:
    ```bash
    npm install
    ```
4.  Start the Vite developer server:
    ```bash
    npm run dev
    ```
5.  Your terminal will show a local link (typically `http://localhost:5173/`). `Ctrl+Click` that link to open the application in your browser!

---

## 🔑 Demo Login Accounts

Since this is an internal administrative system, public users cannot freely register. Please use one of the pre-seeded demo accounts to test the restricted sections of the application:

The password for **EVERY** demo account is exactly: **`password123`**

*   **Administrator**: `admin@hms.com` *(Unlocks all views!)*
*   **Doctor**: `doctor@hms.com`
*   **Nurse**: `nurse@hms.com`
*   **Receptionist**: `receptionist@hms.com`
*   **Pharmacist**: `pharmacy@hms.com`
*   **Laboratory Staff**: `lab@hms.com`
*   **Accountant**: `accountant@hms.com`

Enjoy exploring CareSync!
