# 🛒 BUYZZAR – Frontend  
Modern E-Commerce Frontend built with **React, TailwindCSS, Axios, Razorpay, and Context/Redux**  
Backend: https://buyzzar-backend.onrender.com  
Live Frontend: https://buyzzar-frontend-sigma.vercel.app/

---

## 👥 Team Members

| Name | Role |
|------|------|
| **Praveen Kumar Singh** | Full Stack Developer |
| **Abhay Arora** | Frontend Developer |
| **Sandeep Kumar** | Backend Developer |

---

## 📌 Project Overview

Buyzzar is a scalable MERN e-commerce platform offering:

- Full authentication via HttpOnly cookies  
- Razorpay payment integration  
- Print-On-Demand (POD) integration using Qikink  
- Responsive UI + smooth UX  
- Category filter, search, product details  
- Cart management synced with backend  
- Order history & profile pages  
- Admin features (product CRUD, user CRUD)

This repository contains **ONLY the frontend**.

---

## 🛠️ Tech Stack

- **React.js**
- **React Router DOM**
- **Tailwind CSS + DaisyUI**
- **Axios (withCredentials)**
- **Cloudinary for images**
- **Razorpay Checkout**
- **Deployed on Vercel**

---

## 📁 Folder Structure

```
src/
│── assets/                     # Images & icons
│── common/
│     └── index.js              # Summary API routes
│── helper/
│     └── api.js                # Axios instance
│── components/
│     ├── Header/
│     ├── ProductCard/
│     ├── Cart/
│     ├── Footer/
│     └── Loading/
│── pages/
│     ├── Home/
│     ├── Login/
│     ├── Signup/
│     ├── ProductDetails/
│     ├── CategoryPage/
│     ├── Cart/
│     ├── Checkout/
│     ├── MyOrders/
│     └── Admin/
│── store/                      # Redux Toolkit store (if used)
│── App.js
└── index.js
```


## 🛒 Cart Functionality

| Feature | Status |
|--------|--------|
| Add to cart | ✔️ |
| Update quantity | ✔️ |
| Remove from cart | ✔️ |
| Cart count in header | ✔️ |
| View cart | ✔️ |

---

## 💳 Razorpay Checkout

Flow:

1. Frontend creates order via backend
2. Razorpay popup opens
3. Payment verifies via backend
4. Order is stored & cart cleared

---

## ⚙️ Environment Variables

Create `.env`:

```
REACT_APP_API_BASE_URL=https://buyzzar-backend.onrender.com
```

---

## 🧪 Local Setup

```bash
git clone <repo-url>
cd buyzzar-frontend
npm install
npm start
```

App runs at:

```
http://localhost:3000
```

---

## 🚀 Deployment (Vercel)

- Build command: `npm run build`
- Output: `build/`
- Add this environment variable:

```
REACT_APP_API_BASE_URL=https://buyzzar-backend.onrender.com
```



## 🙌 Contributors

### 👨‍💻 Praveen Kumar Singh  
Full Stack Developer  
- MERN Stack  
- Authentication + Razorpay + Integrations  
- Deployment + System Design  

### 🎨 Abhay Arora  
Frontend Developer  
- UI/UX  
- React Components  
- Responsive Design  
- State Management  

### 🛠️ Sandeep Kumar  
Backend Developer  
- Node.js + Express  
- Database + Auth Middleware  
- Payments + Order System  

---

## ⭐ Support

If this project helped you, please **star the repository** 🙏  
More updates & features coming soon!
