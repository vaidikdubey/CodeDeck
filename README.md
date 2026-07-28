# CodeDeck

## Overview

CodeDeck is a modern, interactive coding platform inspired by LeetCode, designed for users to practice and improve their coding skills. It supports multiple programming languages and provides a real-time code execution environment powered by Judge0.

## Features

* **Interactive Coding Environment:** Solve coding problems with instant code execution.
* **Multi-language Support:** Execute code in various programming languages.
* **User-friendly Interface:** Clean and responsive design using Tailwind CSS and DaisyUI.
* **Form Validation:** Robust input handling using Zod and react-hook-form.
* **State Management:** Efficient state handling with Zustand.

## Tech Stack

### Backend

* **Node.js** - JavaScript runtime for building the backend.
* **Express.js** - Web framework for building RESTful APIs.
* **PostgreSQL** - Relational database for storing user and problem data.
* **Prisma** - ORM for interacting with the database.
* **Judge0** - API for executing code in multiple languages.

### Frontend

* **React.js / Vite** - Frontend library and build tool.
* **JavaScript** - Core scripting language.
* **Tailwind CSS** - Utility-first CSS framework for styling.
* **DaisyUI** - UI components for quick and aesthetic design.
* **Zustand** - State management library.
* **Zod & react-hook-form** - Schema validation and form handling.

## Installation

### Backend

1. Clone the repository:

```bash
git clone <repository-url>
cd codedeck/backend
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables (`.env`):

```env
DATABASE_URL=your_postgres_connection_string
JUDGE0_API_URL=your_judge0_api_endpoint
JUDGE0_API_KEY=your_judge0_api_key
```

4. Run migrations and start the server:

```bash
npx prisma migrate dev --name init
npm run dev
```

### Frontend

1. Navigate to frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Usage

* Open the application in your browser.
* Register or log in to your account.
* Choose a coding problem and select the programming language.
* Write your solution and submit.
* View the result and optimize your code.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes.
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Open a Pull Request.

## Contact

For any queries or issues, contact:

* **Name:** Vaidik Dubey
* **LinkedIn:** [linkedin.com/in/vaidik-dubey](https://www.linkedin.com/in/vaidik-dubey/)
* **X (Twitter):** [x.com/vaidik_26](https://x.com/vaidik_26)
