# Mini E-commerce Application
[Try it now](https://e-commerce-mu-jade-45.vercel.app/)
- If the application shows loading for extra time, see the Deployment Info(render backend service may have spun down).

A full-stack mini e-commerce application consisting of a **backend** built with Node.js/Express and PostgreSQL, and a **frontend** built with Next.js, React and TailwindCSS. This repository contains both the frontend and backend code, providing a seamless developer experience for setting up, running, and extending the project.

---

## Project Overview

This mini e-commerce application allows users to browse products, purchase items directly or add them to a cart, and complete a checkout process. After checkout, an order is created, transaction is simulated with approved/declined/error status and an email notification is sent (using Mailtrap sandbox). The application then displays a “Thank You” page showing the order summary and status. Product inventory counts are decremented upon order completion. Users can also look up their past orders by entering their phone number.

---

## Features

- **Product Listing**  
  - Browse a catalog of products.
  - View product details (price, description, available quantity).
- **Direct Buy or Add to Cart**  
  - Skip the cart entirely by using “Buy Now.”
  - Add multiple items to a cart and proceed to checkout.
- **Checkout & Order Creation**  
  - Complete orders either from the cart or direct buy flows.
  - Order Transaction status simulation: `approved`, `declined`, and `error`.
- **Email Notification**  
  - Upon successful checkout, an order confirmation email is sent via Mailtrap sandbox.
- **Thank You Page & Order Summary**  
  - Displays order details (items, total price, status).
  - Shows a “Thank You” message with order number.
- **Inventory Management**  
  - Inventory counts are decremented based on purchased quantities.
- **Order History Lookup**  
  - Users can retrieve past orders by entering their associated phone number.
- **Dummy Data / Seeding**  
  - A `seed.js` script (in the frontend) to populate the database with 25 dummy products.

---

## Tech Stack

### Backend

- **Node.js**  
- **Express**
- **PostgreSQL** (hosted on Aiven)
- **Nodemailer** (for email notifications) with **Mailtrap**(sandbox mode)

### Frontend

- **Next.js** 
- **React**
- **React Hook Form** (for form handling)  
- **Tailwind CSS** (for styling)  
- **Lucide-React** (for icons)  

---

# 🚀 Project Setup

Follow these steps to get the **Mini E-commerce Application** up and running on your local machine.

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/mini-ecommerce.git
cd mini-ecommerce
```

You will see two folders:

- `mini-ecommerce-backend/`
- `mini-ecommerce-frontend/`

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd mini-ecommerce-backend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Start the backend server (this will also create any necessary tables if they do not exist):

```bash
npm run dev
# or
yarn dev
```

> 🟢 **Backend API will be available at** `http://localhost:<PORT>`

---

## 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd ../mini-ecommerce-frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Start the development server:

```bash
npm run dev
# or
yarn dev
```

> 🟢 **Frontend will run at** `http://localhost:3000` by default.

---

## 4. Seeding Dummy Data (Optional)

A `seed.js` script is included in the frontend folder to add 25 dummy products.

### Steps:

1. Open `mini-ecommerce-frontend/seed.js` and update the backend url in seed() function:

2. Run the seed script:

```bash
node seed.js
```

> ⚠️ Ensure the backend is running before executing this script.

---

## 5. Verify & Use

### ✅ Browse Products

- Visit `http://localhost:3000`
- If you seeded the database, you’ll see 25 dummy products

### ✅ Perform a Checkout

- Click **Choose Options** to **Buy Now** or **Add to Cart**
- Fill in name, phone, email, and address
- Submit the form
- Check **Mailtrap** for the confirmation email

### ✅ Thank You Page

After checkout, a “Thank You” page will show:

- Order summary
- Order status (approved, declined, error)
- Product inventory will be updated accordingly

### ✅ Order Lookup

- Navigate to **Orders**
- Enter your phone number
- View your past orders

---

## 📁 Environment Variables

### Backend (`mini-ecommerce-backend/.env`)

```env
# Mailtrap SMTP
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_username
MAIL_PASS=your_mailtrap_password

# Express server
PORT=5000

# PostgreSQL (Aiven)
AVN_USER=your_db_user
AVN_PASS=your_db_password
AVN_HOST=your_db_host
AVN_DB=your_db_name
AVN_PORT=5432

# Frontend URL (CORS + Email Links)
FRONTEND_URL=http://localhost:3000
```

> 💡 Make sure your PostgreSQL user has permissions to create tables and run standard queries (`INSERT`, `SELECT`, `UPDATE`, `DELETE`)

---


### Frontend (`mini-ecommerce-frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/
```

## 🚀 Deployment Info

- **Frontend** is deployed on **Vercel**  
- **Backend** is deployed on **Render**

> ⚠️ **Important:**  
> Render spins down a Free web service that goes 15 minutes without receiving inbound traffic.  
> When idle, the service is spun down and will spin back up on the next incoming request.  
> Spinning up can take up to a minute, causing a noticeable delay for that first request (e.g., a page load may hang temporarily).
