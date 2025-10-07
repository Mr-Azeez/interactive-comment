# 💬 Interactive Comment Section

An interactive comment section built with **React** and **TailwindCSS**, featuring nested replies, upvote/downvote functionality, and dynamic comment management (add, edit, delete, reply).  

![Preview](./public/preview.png)

---

## 🚀 Features

- 🧩 Add, edit, and delete comments  
- 💬 Reply to other comments (nested replies)  
- 🔼 Upvote and downvote system  
- 👤 Displays current user with avatar  
- 💻 Responsive layout for both desktop and mobile  
- ⚡ Real-time updates without needing a refresh  
- 📂 Data persisted via a `data.json` file and a lightweight Express backend  

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + TailwindCSS  
- **Backend:** Node.js + Express  
- **Data Storage:** JSON file (simulating a database)  

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mr-Azeez/interactive-comment.git
   cd interactive-comment-section
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   cd server
   node server.js
   ```
   The Express API will run at [http://localhost:4000](http://localhost:4000)

4. **Start the frontend**
   ```bash
   cd ..
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to preview the app.

---

## 🧠 How It Works

- The **frontend** communicates with a lightweight **Express API** to manage comment data.  
- Each comment and reply is stored in `data.json`.  
- **State updates** reflect instantly in the UI without page reloads.  
- Nested comments are handled recursively for clean thread rendering.

### Example Comment Structure (`data.json`)

```json
{
  "currentUser": {
    "image": { 
      "png": "./images/avatars/image-juliusomo.png",
      "webp": "./images/avatars/image-juliusomo.webp"
    },
    "username": "juliusomo"
  },
  "comments": [
    {
      "id": 1,
      "content": "This is an example comment",
      "createdAt": "1 month ago",
      "score": 12,
      "user": {
        "image": {
          "png": "./images/avatars/image-amyrobson.png",
          "webp": "./images/avatars/image-amyrobson.webp"
        },
        "username": "amyrobson"
      },
      "replies": [
        {
          "id": 2,
          "content": "This is a nested reply",
          "createdAt": "2 weeks ago",
          "score": 5,
          "replyingTo": "amyrobson",
          "user": {
            "image": {
              "png": "./images/avatars/image-maxblagun.png",
              "webp": "./images/avatars/image-maxblagun.webp"
            },
            "username": "maxblagun"
          },
          "replies": []
        }
      ]
    }
  ]
}
```

---

## 📁 Project Structure

```
interactive-comment-section/
│
├── public/
│   ├── preview.png          # Project preview image
│   └── images/              # Avatar images
│
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # Global context or utilities
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── server.js            # Express backend
│   └── data.json            # Comment data file
│
└── package.json
```

---

## 🧩 Example API Routes

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| GET    | `/comments`          | Fetch all comments         |
| POST   | `/comments`          | Add a new comment          |
| DELETE | `/comments/:id`      | Delete a comment by ID     |
| POST   | `/comments/:id/reply`| Reply to an existing comment |

---

## 📸 Preview

Here’s a sneak peek of the UI:  
![Comment Section Preview](./public/preview.png)

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to contribute:
1. Fork the repository  
2. Create a new branch (`feature/my-feature`)  
3. Commit your changes  
4. Open a pull request  

---

## 🪪 License

This project is open source and available under the [MIT License](LICENSE).

---

### 🌟 Show Your Support

If you like this project, please **star it on GitHub** ⭐  
It really helps me keep improving it!

---

**Developed with ❤️ by Abdulazeez Abolurin**
