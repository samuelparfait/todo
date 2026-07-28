# 📝 Interactive React / Next.js Todo App

A feature-rich, modern task management application built with **React**, **Next.js**, **Tailwind CSS**, and **Zustand**. This application supports drag-and-drop task reordering, Markdown formatting inside task items, bulk task selection/deletion, and JSON import/export functionality.

---

## ✨ Features

- ** Drag and Drop Reordering:** Reorder your tasks seamlessly using `@hello-pangea/dnd`.
- ** Markdown Support:** Write tasks using Markdown syntax (including custom styled links).
- ** Bulk Task Management:** Select individual or all tasks to perform batch deletions.
- ** Data Import & Export:**
  - **Export:** Download your active task list as a timestamped `.json` file.
  - **Import:** Upload an existing `.json` task array directly into your app state.
- ** In-line Editing:** Quickly update existing task titles without opening separate modals.
- ** Dynamic Greetings:** Displays personalized greetings based on the time of day.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Client Components)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Drag & Drop:** [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Lucide React Icons](https://lucide.dev/)
- **Markdown Parsing:** [react-markdown](https://github.com/remarkjs/react-markdown)

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed on your system.

### 2. Installation

1. Clone this repository:
   ```bash
   git clone [https://github.com/your-username/todo-app.git](https://github.com/your-username/todo-app.git)
   cd todo-app
   ```

````

2. Install dependencies:
```bash
npm install

````

3. Run the development server:

```bash
npm run dev

```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📄 Importing Task Lists

When uploading task lists using the **Import** button, ensure your JSON file follows an array structure containing objects with a `text` property:

```json
[
  {
    "text": "Buy groceries and visit [Store](https://example.com)"
  },
  {
    "text": "Complete project documentation"
  }
]
```

---

## 📂 Project Structure

```text
├── components/
│   └── ui/               # Reusable UI primitives (Button, Input, Checkbox, Table)
├── store/
│   └── todo-store.ts     # Zustand global store for state management
├── utils/
│   └── index.ts          # Helper functions (formatDate, greet)
├── app/
│   └── page.tsx          # Main TodoList component view
└── README.md
```
