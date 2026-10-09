# 🚀 Eventix – Free Cloud Deployment & Razorpay Setup Guide

This guide explains how to deploy **Eventix** to the live web for free and activate **Razorpay Live/Test Payments**.

---

## 📋 Architecture for Deployment

| Component | Recommended Free Host | Repository Subdirectory |
| :--- | :--- | :--- |
| **Backend API** | [Render.com](https://render.com) (Web Service) | `server` |
| **Frontend UI** | [Vercel](https://vercel.com) or [Render](https://render.com) (Static Site) | `client` |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas/database) (Free M0 Cluster) | Cloud URI |
| **Payments** | [Razorpay Dashboard](https://dashboard.razorpay.com) (Test & Live Keys) | Environment Variables |

---

## 🗄️ Step 1: Create a Free MongoDB Atlas Database

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up/log in.
2. Click **Create a Deployment** and select the **M0 Free Tier**.
3. Create a database user (e.g. `eventix_admin` + a strong password).
4. Under **Network Access**, click **Add IP Address** -> Select **Allow Access From Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** -> Choose **Drivers (Node.js)** -> Copy the connection string:
   ```env
   mongodb+srv://eventix_admin:<password>@cluster0.xxxxx.mongodb.net/event_ticketing?retryWrites=true&w=majority
   ```

---

## 💳 Step 2: Get your Razorpay API Keys

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com) and log in / create an account.
2. In the left sidebar, navigate to **Settings** -> **API Keys**.
3. Click **Generate Test Key** (or **Live Key** when KYC is completed).
4. Copy:
   - **Key ID** (`rzp_test_...` or `rzp_live_...`)
   - **Key Secret** (`...`)

---

## ⚙️ Step 3: Deploy the Backend to Render.com

1. Push this repository to your **GitHub** account.
2. Go to [Render Dashboard](https://dashboard.render.com) -> Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Name**: `eventix-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. In the **Environment Variables** section, add:
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=mongodb+srv://eventix_admin:<password>@cluster0.xxxxx.mongodb.net/event_ticketing?retryWrites=true&w=majority
   JWT_SECRET=generate_a_random_secure_string_here_32_chars
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://eventix-api.onrender.com`).
8. *(Optional)* Seed initial data: In the Render dashboard, open the **Shell** tab and run:
   ```bash
   node seeder.js
   ```

---

## 🎨 Step 4: Deploy the Frontend to Vercel (or Render Static Site)

### Option A: Deploy on Vercel (Recommended for React/Vite)
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** -> Import your repository.
3. In the project setup:
   - **Root Directory**: Click `Edit` and select `client`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   ```env
   VITE_API_BASE_URL=https://eventix-api.onrender.com/api
   ```
   *(Replace with your actual Render backend URL from Step 3)*
5. Click **Deploy**.

---

## 📱 Step 5: Connecting from your Phone Browser on Local Wi-Fi

To test the application right now on your phone without deploying:
1. Ensure your phone and computer are on the **same Wi-Fi network**.
2. Start the backend:
   ```bash
   cd server
   npm start
   ```
3. Start the frontend with host access:
   ```bash
   cd client
   npm run dev
   ```
4. Open the displayed Network URL in your phone's mobile browser:
   ```
   http://192.168.0.200:5173
   ```
   *(Both UI and API calls to `http://192.168.0.200:4000/api` will automatically work!)*

---

## 👑 Demo Accounts Summary

- **Admin**: `admin@eventix.com` / `admin123` *(Rahul Sharma)*
- **Organizer**: `organizer@eventix.com` / `organizer123` *(Mohit Verma)*
- **Attendee**: `attendee@eventix.com` / `attendee123` *(Ram Kumar)*
- **Attendee 2**: `keshav@eventix.com` / `keshav123` *(Keshav Gupta)*
- **Attendee 3**: `vanshika@eventix.com` / `vanshika123` *(Vanshika Singh)*
- **Official Contact**: `+91 9389849873`
