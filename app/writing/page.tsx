"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PenTool, CheckCircle, AlertCircle, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WritingPrompt {
  id: string
  title: string
  prompt: string
  level: "beginner" | "intermediate" | "advanced"
  category: string
  minWords: number
  tips: string[]
}

const writingPrompts: WritingPrompt[] = [
  {
    id: "1",
    title: "My Daily Routine",
    prompt:
      "Describe your typical day from morning to evening. Include what time you wake up, what you eat for breakfast, your work or study activities, and how you spend your free time.",
    level: "beginner",
    category: "Personal",
    minWords: 100,
    tips: [
      "Use simple present tense (I wake up, I eat, I go)",
      "Include time expressions (at 7 AM, in the morning, after lunch)",
      "Use sequence words (first, then, after that, finally)",
    ],
  },
  {
    id: "2",
    title: "Technology in Education",
    prompt:
      "Discuss the advantages and disadvantages of using technology in education. Consider how computers, tablets, and online learning platforms affect students' learning experience.",
    level: "intermediate",
    category: "Academic",
    minWords: 200,
    tips: [
      "Structure your essay with introduction, body, and conclusion",
      "Use linking words (however, furthermore, on the other hand)",
      "Provide specific examples to support your points",
    ],
  },
  {
    id: "3",
    title: "Climate Change Solutions",
    prompt:
      "Analyze the most effective strategies for addressing climate change. Evaluate both individual actions and government policies, considering their potential impact and feasibility.",
    level: "advanced",
    category: "Environment",
    minWords: 300,
    tips: [
      "Use complex sentence structures and advanced vocabulary",
      "Present multiple perspectives and counterarguments",
      "Support arguments with logical reasoning and examples",
    ],
  },
  {
    id: "4",
    title: "My Favorite Hobby",
    prompt:
      "Write about your favorite hobby. What is it? How did you start doing it? Why do you enjoy it? Describe a memorable experience related to your hobby.",
    level: "beginner",
    category: "Personal",
    minWords: 120,
    tips: [
      "Use descriptive adjectives to make your writing more engaging.",
      "Organize your thoughts into paragraphs.",
      "Share your feelings and emotions about your hobby.",
    ],
  },
  {
    id: "5",
    title: "The Impact of Social Media",
    prompt:
      "Discuss the positive and negative impacts of social media on individuals and society. Consider aspects like communication, mental health, privacy, and information dissemination.",
    level: "intermediate",
    category: "Social Issues",
    minWords: 250,
    tips: [
      "Present a balanced argument, acknowledging both pros and cons.",
      "Use transition words to connect ideas smoothly.",
      "Conclude with a summary of your main points or a final thought.",
    ],
  },
  {
    id: "6",
    title: "Future of Work",
    prompt:
      "Explore how automation and artificial intelligence might reshape the future of work. Discuss potential job displacement, the emergence of new roles, and the skills necessary for the workforce of tomorrow.",
    level: "advanced",
    category: "Future Trends",
    minWords: 350,
    tips: [
      "Cite potential sources or research to strengthen your arguments.",
      "Use formal and academic language.",
      "Consider long-term implications and offer possible solutions or adaptations.",
    ],
  },
  {
    id: "7",
    title: "A Memorable Trip",
    prompt:
      "Describe a memorable trip you have taken. Where did you go? Who did you go with? What did you see and do? What made it memorable?",
    level: "beginner",
    category: "Travel",
    minWords: 100,
    tips: [
      "Use past tense verbs (e.g., went, saw, ate).",
      "Describe sensory details (what you saw, heard, smelled, tasted, felt).",
      "Focus on one or two key moments that made the trip special.",
    ],
  },
  {
    id: "8",
    title: "The Role of Art in Society",
    prompt:
      "Discuss the significance of art in society. How does it reflect culture, challenge norms, or inspire change? Provide examples of different art forms and their societal contributions.",
    level: "intermediate",
    category: "Culture",
    minWords: 200,
    tips: [
      "Define what 'art' means to you in the context of your essay.",
      "Explore various functions of art (e.g., aesthetic, political, social).",
      "Use strong topic sentences for each paragraph.",
    ],
  },
  {
    id: "9",
    title: "Ethical Dilemmas in Science",
    prompt:
      "Analyze a significant ethical dilemma arising from scientific advancements (e.g., genetic engineering, AI, climate intervention). Discuss the moral implications, potential benefits, and risks, and propose a framework for ethical decision-making.",
    level: "advanced",
    category: "Ethics",
    minWords: 400,
    tips: [
      "Clearly state the dilemma and its various facets.",
      "Present arguments from different ethical perspectives (e.g., utilitarianism, deontology).",
      "Offer a nuanced conclusion that acknowledges complexity.",
    ],
  },
  {
    id: "10",
    title: "My Dream Job",
    prompt:
      "Describe your dream job. What kind of work would you do? What skills would you need? Why is this your dream job, and what impact would you like to make?",
    level: "beginner",
    category: "Career",
    minWords: 150,
    tips: [
      "Be specific about the tasks and responsibilities.",
      "Connect your skills and interests to the job requirements.",
      "Express your passion and long-term vision.",
    ],
  },
]

export default function WritingPage() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [userText, setUserText] = useState("")
  const [feedback, setFeedback] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const selectedPrompt = writingPrompts[currentPromptIndex]

  // Reset state when prompt changes
  useEffect(() => {
    resetWriting()
  }, [currentPromptIndex])

  const analyzeWriting = async () => {
    if (userText.trim().split(/\s+/).filter(Boolean).length < 50) {
      toast({
        title: "Text too short",
        description: "Please write at least 50 words for analysis.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simple writing analysis (in a real app, use AI-powered analysis)
    const words = userText.trim().split(/\s+/).filter(Boolean).length
    const sentences = userText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0

    const analysis = {
      wordCount: words,
      sentenceCount: sentences,
      avgWordsPerSentence,
      meetsMinimum: words >= selectedPrompt.minWords,
      strengths: [],
      improvements: [],
      score: 0,
    } as any // Use 'any' for now to allow dynamic property assignment

    // Basic scoring logic
    let score = 60 // Base score

    if (words >= selectedPrompt.minWords) {
      score += 20
      analysis.strengths.push("Meets minimum word requirement")
    } else {
      analysis.improvements.push(`Write at least ${selectedPrompt.minWords} words (current: ${words})`)
    }

    if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 20) {
      score += 10
      analysis.strengths.push("Good sentence length variety")
    } else if (avgWordsPerSentence < 8 && sentences > 0) {
      analysis.improvements.push("Try using more complex sentences")
    } else if (avgWordsPerSentence > 20) {
      analysis.improvements.push("Some sentences might be too long - consider breaking them up")
    }

    if (sentences >= 5) {
      score += 10
      analysis.strengths.push("Good paragraph structure")
    } else if (sentences > 0) {
      analysis.improvements.push("Add more sentences to develop your ideas")
    }

    // Check for common words that indicate good writing
    const goodWords = ["however", "therefore", "furthermore", "although", "because", "since", "while"]
    const hasGoodConnectors = goodWords.some((word) => userText.toLowerCase().includes(word))

    if (hasGoodConnectors) {
      score += 10
      analysis.strengths.push("Uses good connecting words")
    } else {
      analysis.improvements.push("Try using more connecting words (however, therefore, etc.)")
    }

    analysis.score = Math.min(score, 100)

    setFeedback(analysis)
    setIsAnalyzing(false)
  }

  const resetWriting = () => {
    setUserText("")
    setFeedback(null)
  }

  const nextPrompt = () => {
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % writingPrompts.length)
  }

  const previousPrompt = () => {
    setCurrentPromptIndex((prevIndex) => (prevIndex - 1 + writingPrompts.length) % writingPrompts.length)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Writing Practice</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Improve your writing skills with guided prompts and instant feedback
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Writing Prompts Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Writing Prompts</CardTitle>
                  <CardDescription>Choose a prompt to start writing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {writingPrompts.map((prompt, index) => (
                    <div
                      key={prompt.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        currentPromptIndex === index
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => setCurrentPromptIndex(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">{prompt.title}</h3>
                        <Badge className={getLevelColor(prompt.level)} variant="secondary">
                          {prompt.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {prompt.category} • {prompt.minWords}+ words
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">{prompt.prompt}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Writing Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Prompt */}
              <Card key={selectedPrompt.id}>
                {" "}
                {/* Added key for re-render */}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      {selectedPrompt.title}
                    </CardTitle>
                    <Badge className={getLevelColor(selectedPrompt.level)}>{selectedPrompt.level}</Badge>
                  </div>
                  <CardDescription>{selectedPrompt.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Writing Prompt:</h4>
                      <p className="text-sm">{selectedPrompt.prompt}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Minimum words: {selectedPrompt.minWords}
                      </p>
                    </div>

                    {/* Writing Tips */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Writing Tips:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {selectedPrompt.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Writing Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Writing</CardTitle>
                  <CardDescription>
                    Write your response below. Word count:{" "}
                    {
                      userText
                        .trim()
                        .split(/\s+/)
                        .filter((word) => word.length > 0).length
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Start writing your response here..."
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />

                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" onClick={resetWriting}>
                      Clear Text
                    </Button>

                    <Button
                      onClick={analyzeWriting}
                      disabled={isAnalyzing || userText.trim().split(/\s+/).filter(Boolean).length < 50}
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Writing"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              {feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Writing Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Score */}
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(feedback.score)}`}>
                          {feedback.score}/100
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overall Writing Score</p>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-semibold">{feedback.wordCount}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold">{feedback.sentenceCount}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold">{feedback.avgWordsPerSentence}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Words/Sentence</div>
                        </div>
                      </div>

                      {/* Strengths */}
                      {feedback.strengths.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {feedback.strengths.map((strength: string, index: number) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Areas for Improvement */}
                      {feedback.improvements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-1">
                            {feedback.improvements.map((improvement: string, index: number) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-orange-500">!</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prompt Navigation */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button variant="outline" onClick={previousPrompt}>
                  Previous Prompt
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Prompt {currentPromptIndex + 1} of {writingPrompts.length}
                </span>
                <Button variant="outline" onClick={nextPrompt}>
                  Next Prompt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
