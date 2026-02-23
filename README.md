# Scarlet — Relationship Vibe Tracker 🚩

Scarlet is a full-stack behavioral analytics web application designed to help users objectively track interpersonal interactions, detect red flags, and monitor a dynamic relationship health score.

---

## ✨ Features

- **Warning Score Algorithm (0–100)**  
  Custom weighted scoring system that evaluates relationship dynamics based on positive and negative interaction tags.

- **Interaction Logging System**  
  Structured note tracking with categorized behavioral tags (e.g., Gaslighting, Supportive, Love Bombing).  
  Each interaction dynamically updates the overall score.

- **Real-Time Search & Filtering**  
  Instant filtering of users and archived notes by name, keyword, or tag.

- **Responsive UI (Mobile-First)**  
  Fully optimized interface for desktop and mobile devices using CSS Modules.

- **User Profile Management (CRUD)**  
  - Edit profile and bio  
  - Manage tracked individuals  
  - Secure account deletion  

- **Custom Design System ("Scarlet" UI)**  
  Custom CSS variables, semantic styling, consistent spacing and layout structure.

---

## 🛠 Tech Stack

### Frontend
- Next.js 15 (App Router)
- React
- CSS Modules
- Lucide React (icons)

### Backend
- Next.js API Routes (serverless functions)
- MongoDB
- Mongoose (schema-based data modeling)

---

## 🏗 Architecture

- Modular component-based structure
- Serverless API design
- Schema validation via Mongoose
- Clear separation between business logic and UI
- Scalable folder structure (App Router pattern)

---

## 🚀 Getting Started

### 1. Clone repository

```bash
git clone https://github.com/lilyhurko/scarlet.git
cd scarlet

### 2. Install dependencies
```bash
npm install

### 3. Configure environment variables
Create a .env.local file in the root directory:
```bash
MONGODB_URI=your_mongodb_connection_string

### 4. Run development server
```bash
npm run dev
