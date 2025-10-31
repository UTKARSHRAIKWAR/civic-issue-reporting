# Civic Reporting Frontend

This is the **frontend** of the Civic Reporting App — a web application that allows users to report civic issues, track their status, and interact with authorities.  
It supports **User** and **Admin** roles with separate dashboards and access control.

---

## 🚀 Tech Stack

- **React.js** — Frontend framework
- **Tailwind CSS** — Styling
- **Axios** — API communication
- **React Router DOM** — Routing
- **Sonner** — Toast notifications
- **Leaflet.js** — Map integration

---

## 🧩 Features

### 👤 User Features

- Register and login securely
- Report civic issues with image and location
- View issue history and status updates
- Edit profile and update profile picture
- Responsive design for mobile & desktop

### 🛠️ Admin Features

- Register as **Admin** using organization email (e.g., ends with `@yourdomain.com`)
- Manage all user-reported issues
- Update issue status (Pending → Resolved)
- Manage registered users
- Access admin dashboard with analytics

---

## 🔑 Admin Registration

Admins can register directly from the **Register Page** if their email domain matches the environment variable:

```
DOMAIN_NAME=@yourdomain.com
```

Example:

- `user@gmail.com` → registered as **User**
- `john@yourdomain.com` → registered as **Admin**

Make sure your backend `.env` includes this line:

```bash
DOMAIN_NAME=@yourdomain.com
```

When testing through Postman or frontend:

- If `email` ends with the configured domain, role = **admin**
- Otherwise, role = **user**

---

## 📦 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/UTKARSHRAIKWAR/civic-issue-reporting.git
cd civic-issue-reporting/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the project

```bash
npm run dev
```

---

## 🧠 Folder Structure

```
civic-reporting-frontend/
│
├── src/
│   ├── components/         # Reusable components
│   ├── pages/              # Page-level components
│   ├── context/            # Global state (Search, Auth)
│   ├── axios.js            # Axios instance setup
│   ├── App.jsx             # Main app entry
│   └── main.jsx            # ReactDOM entry
│
├── public/
│   └── assets/             # Images, icons, etc.
│
└── package.json
```

---

## 🔒 Authentication

- Uses **JWT tokens** stored in `localStorage`.
- Role-based access implemented using **ProtectedRoute**.

Example:

```jsx
<ProtectedRoute role="admin">
  <AdminDashboard />
</ProtectedRoute>
```

---

## 🗺️ Map Integration

- Uses **Leaflet.js** for map rendering and geolocation.
- “Locate Me” feature fetches user’s live position for issue reporting.

---

## 🧰 Utilities

- **Toast notifications** for success and error feedback.
- **Axios interceptors** for JWT handling.
- **Fully responsive Tailwind UI** for mobile & desktop.

---

## 🧑‍💻 Author

**Utkarsh Raikwar**  
Full Stack Developer — React + Node.js  
[GitHub](https://github.com/UTKARSHRAIKWAR)

---

## 📜 License

This project is licensed under the **MIT License**.
