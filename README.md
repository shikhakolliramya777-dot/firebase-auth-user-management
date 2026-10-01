# Firebase Auth User Management

A modern user authentication and management application built using **React, TypeScript, Vite, Tailwind CSS, and Firebase Authentication**.

## 🚀 Features

- User Registration
- User Login
- Email Verification
- Resend Verification Email
- Forgot Password / Password Reset
- Password Strength Validation
- Confirm Password Validation
- Display Name during Registration
- Authentication State Persistence
- Protected Dashboard
- Logout
- Responsive User Interface

## 🛠️ Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Bun / npm

## 📁 Project Structure

```text
firebase-auth-user-management/
│
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── ...
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── bun.lock
└── README.md
```

## 🔐 Firebase Configuration

Create a `.env` file in the project root and add your Firebase configuration.

Use `.env.example` as a reference.

**Important:** Do not upload your actual `.env` file or private API credentials to GitHub.

## ▶️ How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/shikhakolliramya777-dot/firebase-auth-user-management.git
```

### 2. Open the project

```bash
cd firebase-auth-user-management
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a `.env` file and add the required Firebase environment variables.

### 5. Start the development server

```bash
npm run dev
```

The application will be available on the local development URL shown in the terminal.

## 🔑 Authentication Flow

1. User creates an account.
2. A verification email is sent to the registered email address.
3. User verifies the email.
4. The application checks the verification status.
5. Verified users can access the dashboard.
6. Users can reset their password using the Forgot Password option.
7. Users can log out securely.

## 📌 Purpose of the Project

This project demonstrates how Firebase Authentication can be integrated with a modern React application to build a secure and user-friendly authentication system.

## 👩‍💻 Author

**Shikhakolli Bhanu Vyshnavi**

B.Tech – Artificial Intelligence & Data Science

## 📄 License

This project is created for educational and internship purposes.
