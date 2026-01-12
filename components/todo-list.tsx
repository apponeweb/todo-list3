"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Check, X } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const addTodo = () => {
    if (newTodo.trim() === "") return
    const todo: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
    }
    setTodos([...todos, todo])
    setNewTodo("")
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id: number) => {
    if (editText.trim() === "") return
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText.trim() } : todo)))
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">📝 My Todo List</h1>
          <p className="text-center mt-2 text-primary-foreground/80">Stay organized and get things done</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Add Todo Form */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={addTodo}>Add Task</Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>No tasks yet. Add your first task above!</p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo.id}>
                <CardContent className="py-4">
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(todo.id)
                          if (e.key === "Escape") cancelEdit()
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => saveEdit(todo.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Checkbox checked={todo.completed} onCheckedChange={() => toggleComplete(todo.id)} />
                      <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                        {todo.text}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing(todo)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {todos.length > 0 && (
          <p className="mt-6 text-center text-muted-foreground">
            {todos.filter((t) => t.completed).length} of {todos.length} tasks completed
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Todo App. Built with ❤️ using Next.js
          </p>
        </div>
      </footer>
    </div>
  )
}
