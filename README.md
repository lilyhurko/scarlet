# Scarlet: Relationship Vibe Tracker 🚩

A full-stack application designed to help users objectively track interactions, identify red flags, and monitor the "health score" of their interpersonal relationships.

![Project Preview](public/preview.png)

## ✨ Features

- **📊 Vibe Score Algorithm:** Automatically calculates a safety score (0-100) based on positive and negative interaction tags.
- **📝 Interaction Logging:** Track notes with specific tags (e.g., "Gaslighting", "Supportive", "Love Bombing").
- **🔍 Real-time Search:** Instantly filter people and archive notes by keywords or names.
- **📱 Responsive Design:** Fully optimized UI for mobile and desktop using CSS Modules.
- **👤 User Profile:** CRUD functionality for user management (Edit bio, Delete account).
- **🎨 Custom UI:** Elegant "Scarlet" aesthetic with custom CSS variables and semantic styling.

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) (App Router)
- React.js
- CSS Modules (Scoped styling)
- Lucide React (Icons)

**Backend:**
- Next.js API Routes (Serverless functions)
- MongoDB (Database)
- Mongoose (ORM)

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/scarlet.git](https://github.com/your-username/scarlet.git)
cd scarlet
2. Install dependencies
Bash
npm install
3. Set up Environment Variables
Create a .env.local file in the root directory and add your MongoDB connection string:

Bash
MONGODB_URI=your_mongodb_connection_string
4. Run the development server
Bash
npm run dev
Open http://localhost:3000 with your browser to see the result.
