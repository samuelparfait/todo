"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Upload,
  GripVertical,
  Edit2,
  X,
  Check,
  Download,
  CheckCircle,
  ListFilter,
  Hand,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ReactMarkdown from "react-markdown";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTodoStore, Todo } from "@/store/todo-store";
import { formatDate, greet } from "@/utils";

export default function TodoList() {
  const {
    todos,
    addTodo,
    deleteTodo,
    deleteMultipleTodos,
    editTodo,
    reorderTodos,
    uploadTodos,
  } = useTodoStore();
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      addTodo(newTodo);
      setNewTodo("");
    }
  };

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditSave = () => {
    if (editingId && editText.trim() !== "") {
      editTodo(editingId, editText);
      setEditingId(null);
      setEditText("");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSelectTodo = (id: string) => {
    if (selectedTodos.includes(id)) {
      setSelectedTodos(selectedTodos.filter((todoId) => todoId !== id));
    } else {
      setSelectedTodos([...selectedTodos, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTodos.length === todos.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(todos.map((todo) => todo.id));
    }
  };

  const handleDeleteSelected = () => {
    deleteMultipleTodos(selectedTodos);
    setSelectedTodos([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);

          if (Array.isArray(json)) {
            const newTodos = json.map((item) => ({
              id:
                Date.now().toString() + Math.random().toString(36).substr(2, 9),
              text: item.text || "",
            }));

            uploadTodos(newTodos);
          } else {
            console.error(
              "Invalid JSON format. Please upload an array of todos."
            );
          }
        } catch (err) {
          console.error(
            "Error parsing JSON file. Please check the file format.",
            err
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const onDragEnd = (result: DropResult) => {
    console.log("✅", result);

    if (!result.destination) {
      return;
    }

    const items = Array.from(todos);

    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    reorderTodos(items);
  };

  const handleExport = () => {
    const filename = `todo-${formatDate(new Date())}.json`;
    const jsonStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{greet()}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Today, {new Date().toDateString()}
      </p>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">{todos.length} tasks</h2>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            className="flex-grow text-md"
          />
          <Button onClick={handleAddTodo}>
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add todo</span>
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-5 w-5" />
            <span className="sr-only">Import todos</span>
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-5 w-5" />
            <span className="sr-only">Export todos</span>
          </Button>
          {selectedTodos.length > 0 && (
            <Button onClick={handleDeleteSelected} variant="destructive">
              <Trash2 className="h-5 w-5" />
              Delete {selectedTodos.length}
            </Button>
          )}
        </div>
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <CheckCircle className="h-16 w-16 mb-4" />
            <p className="text-lg">
              No tasks yet. Add one above to get started!
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            selectedTodos.length === todos.length &&
                            todos.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all tasks"
                        />
                      </TableHead>

                      <TableHead className="text-gray-400">Task</TableHead>
                      <TableHead className="w-[100px] text-gray-400 text-right">
                        Edit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {todos.map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${
                              snapshot.isDragging ? "bg-blue-100" : ""
                            }`}
                          >
                            <TableCell>
                              <span
                                {...provided.dragHandleProps}
                                className="cursor-move"
                              >
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </span>
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={selectedTodos.includes(todo.id)}
                                onCheckedChange={() =>
                                  handleSelectTodo(todo.id)
                                }
                                aria-label={`Select task: ${todo.text}`}
                              />
                            </TableCell>

                            <TableCell className="py-4">
                              {editingId === todo.id ? (
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full"
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && handleEditSave()
                                  }
                                />
                              ) : (
                                <div
                                  className="text-gray-800"
                                  aria-describedby={`task-${todo.id}`}
                                >
                                  <span id={`task-${todo.id}`}>
                                    <ReactMarkdown
                                      className="text-md leading-relaxed"
                                      components={{
                                        a: (props) => (
                                          <a
                                            className="bg-purple-200 text-sm text-purple-700 font-semibold p-1 rounded-sm"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                          />
                                        ),
                                      }}
                                    >
                                      {todo.text}
                                    </ReactMarkdown>
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2 justify-end">
                                {editingId === todo.id ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={handleEditSave}
                                    >
                                      <Check className="h-5 w-5 text-green-500" />
                                      <span className="sr-only">Save edit</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={handleEditCancel}
                                    >
                                      <X className="h-5 w-5 text-red-500" />
                                      <span className="sr-only">
                                        Cancel edit
                                      </span>
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditStart(todo)}
                                  >
                                    <Edit2 className="h-5 w-5 text-purple-500" />
                                    <span className="sr-only">Edit todo</span>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
