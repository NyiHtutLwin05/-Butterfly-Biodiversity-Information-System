# 🚀 Full Stack Project Setup

This project contains two main folders:

- `backend` – Node.js + MongoDB
- `frontend` – Static frontend (HTML, CSS, JS)

---

## 📁 Project Structure

```bash
project-root/
│
├── backend/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── index.html
│   └── ...

```
⚙️ Backend Setup
## 1️⃣ Go to Backend Folder

```bash
cd backend
```

## 2️⃣ Install Dependencies

```bash
npm install

```

## 3️⃣ Start MongoDB
✅ MongoDB Compass (Required)

Open MongoDB Compass

Use this connection string:

```bash
mongodb://localhost:27017/

```

Create or select your database (project name)

🖥 macOS (Homebrew)

Make sure MongoDB service is running:

brew services start mongodb-community

🪟 Windows

Choose one of the following methods:

Option 1: MongoDB runs automatically (Recommended)

MongoDB usually runs as a Windows Service by default

Just open MongoDB Compass and connect

Option 2: Start MongoDB manually

```bash
net start MongoDB

```

OR
```bash
mongod

```


(make sure MongoDB is added to your system PATH)

## 4️⃣ Run Backend Server

```bash
npm run dev

```


✅ If successful, you should see:

MongoDB is connected successfully

🎨 Frontend Setup

## 1️⃣ Open Frontend Folder

```bash

cd frontend
```

## 2️⃣ Run with Live Server

Open the frontend folder in VS Code

Right-click index.html

Click Open with Live Server

🌐 The frontend will open in your browser automatically.

✅ Tech Stack

Backend: Node.js, Express, MongoDB

Frontend: HTML, CSS, JavaScript

Database Tool: MongoDB Compass

```bash
📌 Notes

Make sure MongoDB is running before starting the backend

Backend must be running for full functionality
```
