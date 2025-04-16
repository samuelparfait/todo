'use client';

import { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  GripVertical,
  Edit2,
  X,
  Check,
  Download,
} from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import ReactMarkdown from 'react-markdown';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTodoStore, Todo } from '@/store/todo-store';
import { greet } from '@/utils/greet';

export default function TodoList() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
    uploadTodos,
  } = useTodoStore();
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditSave = () => {
    if (editingId && editText.trim() !== '') {
      editTodo(editingId, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
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
              text: item.text || '',
              completed: item.completed || false,
            }));

            uploadTodos(newTodos);
          } else {
            console.error(
              'Invalid JSON format. Please upload an array of todos.'
            );
          }
        } catch (err) {
          console.error(
            'Error parsing JSON file. Please check the file format.',
            err
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const onDragEnd = (result: DropResult) => {
    console.log('✅', result);

    if (!result.destination) {
      return;
    }

    const items = Array.from(todos);

    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    reorderTodos(items);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `todo-list-backup-${timestamp}.json`;
    const jsonStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-12'>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>{greet('Sam')}</h1>
      <p className='text-lg text-muted-foreground mb-8'>
        Today, {new Date().toDateString()}
      </p>
      <div className='w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-6'>
        <h2 className='text-xl font-semibold'>
          {todos.filter((todo) => todo.completed).length}
          <span className='text-muted-foreground'> / {todos.length}</span>
        </h2>
        <div className='flex space-x-2'>
          <Input
            type='text'
            placeholder='Add a new todo...'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            className='flex-grow text-md'
          />
          <Button onClick={handleAddTodo}>
            <Plus className='h-5 w-5' />
            <span className='sr-only'>Add todo</span>
          </Button>
          <input
            type='file'
            accept='.json'
            onChange={handleFileUpload}
            ref={fileInputRef}
            className='hidden'
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className='h-5 w-5' />
            <span className='sr-only'>Import todos</span>
          </Button>
          <Button onClick={handleExport}>
            <Download className='h-5 w-5' />
            <span className='sr-only'>Export todos</span>
          </Button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='todos'>
            {(provided) => (
              <Table className='text-base'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[50px]'>Order</TableHead>
                    <TableHead className='w-[50px]'>Done</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className='w-[100px]'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
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
                            snapshot.isDragging ? 'bg-blue-100' : ''
                          }`}
                        >
                          <TableCell>
                            <span
                              {...provided.dragHandleProps}
                              className='cursor-move'
                            >
                              <GripVertical className='h-5 w-5 text-gray-400' />
                            </span>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={todo.completed}
                              onCheckedChange={() => toggleTodo(todo.id)}
                              id={`todo-${todo.id}`}
                            />
                          </TableCell>
                          <TableCell className='py-4'>
                            {editingId === todo.id ? (
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className='w-full'
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && handleEditSave()
                                }
                              />
                            ) : (
                              <label
                                htmlFor={`todo-${todo.id}`}
                                className={`${
                                  todo.completed
                                    ? 'line-through text-gray-500'
                                    : 'text-gray-800'
                                }`}
                              >
                                <ReactMarkdown
                                  className='text-md leading-relaxed'
                                  components={{
                                    a: (props) => (
                                      <a
                                        className='bg-green-200 font-semibold'
                                        target='_blank'
                                        {...props}
                                      />
                                    ),
                                  }}
                                >
                                  {todo.text}
                                </ReactMarkdown>
                              </label>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className='flex space-x-2'>
                              {editingId === todo.id ? (
                                <>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={handleEditSave}
                                  >
                                    <Check className='h-5 w-5 text-green-500' />
                                    <span className='sr-only'>Save edit</span>
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={handleEditCancel}
                                  >
                                    <X className='h-5 w-5 text-red-500' />
                                    <span className='sr-only'>Cancel edit</span>
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleEditStart(todo)}
                                >
                                  <Edit2 className='h-5 w-5 text-purple-500' />
                                  <span className='sr-only'>Edit todo</span>
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => deleteTodo(todo.id)}
                              >
                                <Trash2 className='h-5 w-5 text-red-500' />
                                <span className='sr-only'>Delete todo</span>
                              </Button>
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
      </div>
    </div>
  );
}
