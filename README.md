

  <h2 align="center">ChantelleAI</h2>

  <div align="center">
     <b>ChantelleAI</b> is designed to make resume creation effortless. With the help of AI, users can generate, update, and customize their resumes, ensuring they stand out to potential employers. The application is secure, user-friendly, and highly customizable.
  </div>
  <br />
  <a href=""><strong>➥ Visit ChantelleAI App</strong></a>
</div>

## <a name="features">✨ Features</a>

- **AI-Powered Resume Generation:** Generate a professional resume using AI.

- **User Authentication:** Secure login and registration with Clerk.

- **Real-Time Preview:** See live updates as you fill out the resume form.

- **Easy Customization:** Edit sections like experience, education, skills, and more.

- **Save and Share:** Save your resume and share a link with potential employers.

- **Responsiveness:** Ensures the application adapts seamlessly to various screen sizes and devices.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Frontend:** Next.js 14

- **Authentication:** Clerk

- **AI Integration:** Gemini API

- **Styling:** TailwindCSS

- **Backend:** Node.js

- **Database:** MongoDB

## <a name="quick-start">🚀 Quick Start</a>

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Cloning the Repository

```bash
git clone ""
cd ChantelleAI
```

### Installation

Install the project dependencies using npm:

```bash
npm install
```

### Set Up Environment Variables

Create a new file named `.env` in the root of your project and add the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

MONGODB_URL=

GEMINI_API_KEY=

BASE_URL=localhost:3000
```

Replace the placeholder values with your actual credentials. You can obtain these credentials by signing up for the corresponding websites on [Clerk](https://clerk.com/), [MongoDB](https://mongodb.com/) and [Google AI Studio](https://aistudio.google.com/app/apikey). 

### Running the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

- Fork the repository.
- Create your feature branch (`git checkout -b feature/AmazingFeature`).
- Commit your changes (`git commit -m 'Add some AmazingFeature'`).
- Push to the branch (`git push origin feature/AmazingFeature`).
- Open a pull request.

