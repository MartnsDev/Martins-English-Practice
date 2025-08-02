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
import { Plus, Trash2, Volume2, RotateCcw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { translateWithCache } from "@/lib/translator"

interface VocabularyWord {
  id: string
  word: string
  translation: string
  definition: string
  example: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  dateAdded: string
  timesReviewed: number
}

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [newWord, setNewWord] = useState({
    word: "",
    translation: "",
    definition: "",
    example: "",
    category: "",
    difficulty: "medium" as const,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedWords = localStorage.getItem("vocabularyWords")
    if (savedWords) {
      setWords(JSON.parse(savedWords))
    } else {
      // Add some sample words
      const sampleWords: VocabularyWord[] = [
        {
          id: "1",
          word: "Serendipity",
          translation: "Serendipidade",
          definition: "The occurrence of events by chance in a happy way",
          example: "Meeting my best friend was pure serendipity.",
          category: "Advanced",
          difficulty: "hard",
          dateAdded: new Date().toISOString(),
          timesReviewed: 0,
        },
        {
          id: "2",
          word: "Resilient",
          translation: "Resiliente",
          definition: "Able to recover quickly from difficulties",
          example: "She remained resilient despite the challenges.",
          category: "Personality",
          difficulty: "medium",
          dateAdded: new Date().toISOString(),
          timesReviewed: 0,
        },
        {
          id: "3",
          word: "Accomplish",
          translation: "Realizar/Conquistar",
          definition: "To achieve or complete successfully",
          example: "She was able to accomplish all her goals this year.",
          category: "Achievement",
          difficulty: "medium",
          dateAdded: new Date().toISOString(),
          timesReviewed: 0,
        },
        {
          id: "4",
          word: "Enthusiasm",
          translation: "Entusiasmo",
          definition: "Intense and eager enjoyment or interest",
          example: "His enthusiasm for learning English is inspiring.",
          category: "Emotions",
          difficulty: "medium",
          dateAdded: new Date().toISOString(),
          timesReviewed: 0,
        },
      ]
      setWords(sampleWords)
      localStorage.setItem("vocabularyWords", JSON.stringify(sampleWords))
    }
  }, [])

  const saveWords = (updatedWords: VocabularyWord[]) => {
    setWords(updatedWords)
    localStorage.setItem("vocabularyWords", JSON.stringify(updatedWords))
  }

  const autoTranslateWord = async () => {
    if (!newWord.word.trim()) {
      toast({
        title: "Error",
        description: "Please enter a word first.",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      const translation = await translateWithCache(newWord.word, "en", "pt")
      setNewWord({ ...newWord, translation })

      toast({
        title: "Translation completed",
        description: "Word has been translated using MyMemory API.",
      })
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Unable to translate word. Please enter manually.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const addWord = () => {
    if (!newWord.word || !newWord.translation) {
      toast({
        title: "Error",
        description: "Please fill in at least the word and translation fields.",
        variant: "destructive",
      })
      return
    }

    const word: VocabularyWord = {
      id: Date.now().toString(),
      ...newWord,
      dateAdded: new Date().toISOString(),
      timesReviewed: 0,
    }

    const updatedWords = [...words, word]
    saveWords(updatedWords)

    setNewWord({
      word: "",
      translation: "",
      definition: "",
      example: "",
      category: "",
      difficulty: "medium",
    })
    setIsDialogOpen(false)

    toast({
      title: "Word added!",
      description: "New word has been added to your vocabulary.",
    })
  }

  const deleteWord = (id: string) => {
    const updatedWords = words.filter((word) => word.id !== id)
    saveWords(updatedWords)
    toast({
      title: "Word deleted",
      description: "Word has been removed from your vocabulary.",
    })
  }

  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  const nextCard = () => {
    setCurrentWordIndex((prev) => (prev + 1) % words.length)
    setShowTranslation(false)
  }

  const previousCard = () => {
    setCurrentWordIndex((prev) => (prev - 1 + words.length) % words.length)
    setShowTranslation(false)
  }

  const markAsReviewed = () => {
    const updatedWords = words.map((word) =>
      word.id === words[currentWordIndex].id ? { ...word, timesReviewed: word.timesReviewed + 1 } : word,
    )
    saveWords(updatedWords)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Vocabulary Builder</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Build and practice your English vocabulary with interactive flashcards
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Word
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Word</DialogTitle>
                  <DialogDescription>Add a new word to your vocabulary collection.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="word" className="text-right">
                      Word
                    </Label>
                    <Input
                      id="word"
                      value={newWord.word}
                      onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter English word"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="translation" className="text-right">
                      Translation
                    </Label>
                    <div className="col-span-3 flex gap-2">
                      <Input
                        id="translation"
                        value={newWord.translation}
                        onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
                        placeholder="Translation in your language"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={autoTranslateWord}
                        disabled={isTranslating || !newWord.word.trim()}
                      >
                        {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Auto"}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="definition" className="text-right">
                      Definition
                    </Label>
                    <Textarea
                      id="definition"
                      value={newWord.definition}
                      onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
                      className="col-span-3"
                      placeholder="English definition"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="example" className="text-right">
                      Example
                    </Label>
                    <Textarea
                      id="example"
                      value={newWord.example}
                      onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                      className="col-span-3"
                      placeholder="Example sentence"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={newWord.category}
                      onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Business, Travel, etc."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addWord}>Add Word</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant={studyMode ? "default" : "outline"} onClick={() => setStudyMode(!studyMode)}>
              {studyMode ? "Exit Study Mode" : "Study Mode"}
            </Button>
          </div>

          {studyMode && words.length > 0 ? (
            /* Study Mode - Flashcards */
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Card {currentWordIndex + 1} of {words.length}
                </span>
              </div>

              <Card className="min-h-[400px] cursor-pointer" onClick={() => setShowTranslation(!showTranslation)}>
                <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="mb-4">
                    <Badge className={getDifficultyColor(words[currentWordIndex].difficulty)}>
                      {words[currentWordIndex].difficulty}
                    </Badge>
                  </div>

                  <h2 className="text-4xl font-bold mb-4">{words[currentWordIndex].word}</h2>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      speakWord(words[currentWordIndex].word)
                    }}
                    className="mb-6"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>

                  {showTranslation ? (
                    <div className="space-y-4">
                      <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
                        {words[currentWordIndex].translation}
                      </p>
                      {words[currentWordIndex].definition && (
                        <p className="text-gray-600 dark:text-gray-400">{words[currentWordIndex].definition}</p>
                      )}
                      {words[currentWordIndex].example && (
                        <p className="text-sm italic text-gray-500 dark:text-gray-500">
                          "{words[currentWordIndex].example}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Click to reveal translation</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4 mt-6">
                <Button variant="outline" onClick={previousCard}>
                  Previous
                </Button>
                <Button variant="outline" onClick={() => setShowTranslation(!showTranslation)}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Flip
                </Button>
                <Button
                  onClick={() => {
                    nextCard()
                    markAsReviewed()
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            /* Word List View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {words.map((word) => (
                <Card key={word.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {word.word}
                        <Button variant="ghost" size="sm" onClick={() => speakWord(word.word)}>
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWord(word.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{word.translation}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {word.definition && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{word.definition}</p>
                    )}
                    {word.example && (
                      <p className="text-sm italic text-gray-500 dark:text-gray-500 mb-3">"{word.example}"</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(word.difficulty)}>{word.difficulty}</Badge>
                      <span className="text-xs text-gray-500">Reviewed {word.timesReviewed} times</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {words.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No words in your vocabulary yet. Start by adding some words!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
