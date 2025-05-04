# Couple Call

This app is a lightweight video call app made for simple and fast communication on web.



## Steps to use it

1. Go to the website
2. Enter Room id or start a random
3. Share the id manually to your partner
4. Start video calling each other instantly :)



A private, peer-to-peer video calling web app using React (with Vite and Tailwind CSS) for the frontend and Node.js with Express and Socket.io for the backend. The app allows two users to connect in a secure video call room using WebRTC, with signaling handled via WebSocket communication. I deployed the frontend on Vercel and the backend on Render, resolving common deployment issues such as CORS and proxy trust settings. To enhance the app, I added a feedback form connected to a Supabase PostgreSQL database, allowing users to submit messages securely. Throughout the process, I ensured the app was limited to two users per room, considered potential security concerns, and implemented basic rate limiting for protection. The result is a clean, functional, and scalable video calling solution built entirely from scratch and designed for privacy and simplicity.


The backend is built in NodeJS and hosted on render, it's a free hosting service hence gets inactive after a while. Hence you might have to wait about 1 min before it connects you to the room :) Let me know if you face any issues via e-mail!

## 🤝 Contributing

Thank you for considering contributing to **Couple Call**! We appreciate your time and effort 💙

This project is split into two separate repositories:

- 🧠 **Backend (Node.js)**: [couple-call-backend](https://github.com/devpool007/couple-call-backend)
- 🎨 **Frontend (React + Tailwind CSS)**: This repo

To run and develop the project locally, you’ll need to **fork and clone both repos**.

---

### 📋 How to Contribute

1. **Fork both repositories**
   - [Frontend Repo](https://github.com/devpool007/couple-call)
   - [Backend Repo](https://github.com/devpool007/couple-call-backend)

2. **Clone your forks**
   ```bash
   # Frontend
   git clone https://github.com/devpool007/couple-call.git
   cd couple-call

   # In a separate terminal or folder
   git clone https://github.com/devpool007/couple-call-backend.git
   cd couple-call-backend

3. **Create a new branch in each repo**
   ```bash
   git checkout -b feature/your-feature-name

4. **Set up and run the backend**
Follow backend README instructions (e.g., install dependencies, set up .env, and run the server).

5. **Set up and run the frontend**
   ```bash
   cd couple-call-frontend
   npm install
   npm run dev
6. **Make your changes and test locally**

7. **Commit and push your changes**
   ```bash
   git add .
   git commit -m "Add: Short description of the change"
   git push origin feature/your-feature-name

8. **Open a Pull Request**
   - Go to your fork on GitHub
   - Open a PR from your branch to the original repo
   - Provide a clear description of the changes



