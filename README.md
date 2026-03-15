# ✂️ Trimly – URL Shortener (MERN Stack)

**Trimly** is a modern **URL Shortener Web Application** built using the **MERN Stack (MongoDB, Express, React, Node.js)**. It converts long URLs into short, clean, and shareable links while maintaining fast performance and a smooth user experience.

🔗 Live Demo: https://trimly-frontend-71hp.onrender.com/  
📦 Repository: https://github.com/santhosh29dev/Trimly

---

## 🚀 Features

- Instantly shorten long URLs
- Generate unique and shareable short links
- Track number of visits to each link
- Fast backend built with Express & Node.js
- MongoDB database integration
- Fully responsive UI
- Clean and simple user experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Deployment
- Render

---

## 📂 Project Structure

```
Trimly/
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│
├── backend/               # Express server
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/santhosh29dev/Trimly.git
cd Trimly
```

### 2. Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
```

---

## ▶️ Running the Project

Start Backend:

```bash
cd backend
npm run dev
```

Start Frontend:

```bash
cd frontend
npm start
```

Application will run at:

```
Frontend → http://localhost:3000
Backend → http://localhost:5000
```

---

## 🔗 API Endpoints

### Create Short URL

```
POST /api/url/shorten
```

Request Body:

```json
{
  "longUrl": "https://example.com/very/long/url"
}
```

### Redirect to Original URL

```
GET /:shortCode
```

---

## 📸 Screenshots

You can add screenshots like:

- Homepage
- URL shortened result
- Click analytics page

Example:

```
/screenshots/home.png
/screenshots/result.png
```

---

## 🔮 Future Improvements

- User authentication (JWT)
- Advanced analytics dashboard
- Link expiration feature
- User dashboard to manage URLs
- Device & location tracking

---

## 👨‍💻 Author

**Santhosh**

GitHub: https://github.com/santhosh29dev

---

## ⭐ Support

If you like this project, consider giving it a **star ⭐ on GitHub!**
