"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, FileText, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  dateCreated: string
  dateModified: string
}

const categories = ["Grammar", "Vocabulary", "Pronunciation", "Reading", "Writing", "Listening", "Speaking", "General"]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const savedNotes = localStorage.getItem("englishLearningNotes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    } else {
      // Add some sample notes
      const sampleNotes: Note[] = [
        {
          id: "1",
          title: "Present Perfect vs Simple Past",
          content: `Present Perfect:
- Used for actions that happened at an unspecified time
- "I have visited Paris" (when is not important)
- Often used with: already, just, yet, ever, never

Simple Past:
- Used for actions that happened at a specific time
- "I visited Paris last year" (specific time mentioned)
- Often used with: yesterday, last week, in 2020, etc.`,
          category: "Grammar",
          tags: ["tenses", "present-perfect", "past-simple"],
          dateCreated: new Date().toISOString(),
          dateModified: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Business Vocabulary",
          content: `Important business terms:
- Revenue: total income generated
- Profit: money left after expenses
- Stakeholder: person with interest in company
- Quarterly: every three months
- ROI: Return on Investment
- B2B: Business to Business
- B2C: Business to Consumer`,
          category: "Vocabulary",
          tags: ["business", "professional", "workplace"],
          dateCreated: new Date().toISOString(),
          dateModified: new Date().toISOString(),
        },
      ]
      setNotes(sampleNotes)
      localStorage.setItem("englishLearningNotes", JSON.stringify(sampleNotes))
    }
  }, [])

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes)
    localStorage.setItem("englishLearningNotes", JSON.stringify(updatedNotes))
  }

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content fields.",
        variant: "destructive",
      })
      return
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    }

    const updatedNotes = [...notes, note]
    saveNotes(updatedNotes)

    setNewNote({
      title: "",
      content: "",
      category: "General",
      tags: "",
    })
    setIsDialogOpen(false)

    toast({
      title: "Note added!",
      description: "Your note has been saved successfully.",
    })
  }

  const updateNote = () => {
    if (!editingNote || !newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content fields.",
        variant: "destructive",
      })
      return
    }

    const updatedNote: Note = {
      ...editingNote,
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      dateModified: new Date().toISOString(),
    }

    const updatedNotes = notes.map((note) => (note.id === editingNote.id ? updatedNote : note))
    saveNotes(updatedNotes)

    setEditingNote(null)
    setNewNote({
      title: "",
      content: "",
      category: "General",
      tags: "",
    })
    setIsDialogOpen(false)

    toast({
      title: "Note updated!",
      description: "Your note has been updated successfully.",
    })
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    saveNotes(updatedNotes)
    toast({
      title: "Note deleted",
      description: "Note has been removed from your collection.",
    })
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(", "),
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingNote(null)
    setNewNote({
      title: "",
      content: "",
      category: "General",
      tags: "",
    })
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Grammar: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Vocabulary: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Pronunciation: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Reading: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Writing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Listening: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Speaking: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      General: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    }
    return colors[category] || colors["General"]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Personal Notes</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of your English learning journey with personal notes
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add Note Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingNote(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
                  <DialogDescription>
                    {editingNote ? "Update your note below." : "Create a new note for your English learning."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter note title"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newNote.category}
                      onValueChange={(value) => setNewNote({ ...newNote, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tags" className="text-right">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      value={newNote.tags}
                      onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="content" className="text-right">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="col-span-3 min-h-[200px]"
                      placeholder="Write your note content here..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button onClick={editingNote ? updateNote : addNote}>
                    {editingNote ? "Update Note" : "Add Note"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(note.category)}>{note.category}</Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(note)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {note.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    Created: {formatDate(note.dateCreated)}
                    {note.dateModified !== note.dateCreated && (
                      <span className="ml-2">• Modified: {formatDate(note.dateModified)}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">{note.content}</p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "No notes found matching your criteria."
                  : "No notes yet. Start by adding your first note!"}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Note
                </Button>
              )}
            </div>
          )}

          {/* Statistics */}
          {notes.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Notes Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{notes.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Notes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {new Set(notes.map((note) => note.category)).size}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {notes.reduce((acc, note) => acc + note.tags.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Tags</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.round(notes.reduce((acc, note) => acc + note.content.length, 0) / notes.length)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Characters</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
