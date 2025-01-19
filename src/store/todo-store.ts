import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, newText: string) => void
  reorderTodos: (todos: Todo[]) => void
  uploadTodos: (newTodos: Todo[]) => void
  importTodos: (importedTodos: Todo[]) => void
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [...state.todos, { id: Date.now().toString(), text, completed: false }],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      editTodo: (id, newText) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
          ),
        })),
      reorderTodos: (newTodos) =>
        set(() => ({
          todos: newTodos,
        })),
      uploadTodos: (newTodos) =>
        set((state) => ({
          todos: [...state.todos, ...newTodos],
        })),
      importTodos: (importedTodos) =>
        set(() => ({
          todos: importedTodos,
        })),
    }),
    {
      name: 'todo-storage',
    }
  )
)

