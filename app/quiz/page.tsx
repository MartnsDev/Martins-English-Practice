"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "Which sentence is grammatically correct?",
    options: ["She don't like coffee.", "She doesn't like coffee.", "She not like coffee.", "She no likes coffee."],
    correctAnswer: 1,
    explanation: 'In third person singular (she, he, it), we use "doesn\'t" for negative statements.',
    category: "Grammar",
    level: "beginner",
  },
  {
    id: "2",
    question: 'What is the past tense of "go"?',
    options: ["goed", "went", "gone", "going"],
    correctAnswer: 1,
    explanation: '"Went" is the simple past tense of "go". "Gone" is the past participle.',
    category: "Verb Tenses",
    level: "beginner",
  },
  {
    id: "3",
    question: 'Choose the correct preposition: "I\'m interested ___ learning English."',
    options: ["on", "in", "at", "for"],
    correctAnswer: 1,
    explanation: 'We use "interested in" when talking about something that attracts our attention.',
    category: "Prepositions",
    level: "intermediate",
  },
  {
    id: "4",
    question: 'Which word means "to make something better"?',
    options: ["deteriorate", "improve", "worsen", "decline"],
    correctAnswer: 1,
    explanation: '"Improve" means to make or become better. The other options mean to make worse.',
    category: "Vocabulary",
    level: "intermediate",
  },
  {
    id: "5",
    question: 'Identify the conditional sentence type: "If I had studied harder, I would have passed the exam."',
    options: ["Zero conditional", "First conditional", "Second conditional", "Third conditional"],
    correctAnswer: 3,
    explanation:
      'Third conditional uses "if + past perfect" and "would have + past participle" for hypothetical past situations.',
    category: "Conditionals",
    level: "advanced",
  },
  {
    id: "6",
    question: 'What is the plural form of "child"?',
    options: ["childs", "children", "childes", "childen"],
    correctAnswer: 1,
    explanation: '"Children" is the irregular plural form of "child".',
    category: "Nouns",
    level: "beginner",
  },
  {
    id: "7",
    question: 'Which of these is a synonym for "happy"?',
    options: ["sad", "joyful", "angry", "tired"],
    correctAnswer: 1,
    explanation: '"Joyful" means feeling, expressing, or causing great pleasure and happiness.',
    category: "Vocabulary",
    level: "beginner",
  },
  {
    id: "8",
    question: 'Complete the sentence: "She ___ to the store yesterday."',
    options: ["go", "goes", "went", "gone"],
    correctAnswer: 2,
    explanation: '"Went" is the simple past tense of "go", used for actions completed in the past.',
    category: "Verb Tenses",
    level: "intermediate",
  },
  {
    id: "9",
    question: 'Which phrasal verb means "to discover by chance"?',
    options: ["look up", "find out", "come across", "take off"],
    correctAnswer: 2,
    explanation: '"Come across" means to find or meet by chance.',
    category: "Phrasal Verbs",
    level: "advanced",
  },
  {
    id: "10",
    question: 'Choose the correct article: "He is ___ honest man."',
    options: ["a", "an", "the", "no article"],
    correctAnswer: 1,
    explanation: 'We use "an" before words that start with a vowel sound, like "honest" (the "h" is silent).',
    category: "Articles",
    level: "intermediate",
  },
  {
    id: "11",
    question: 'What is the passive voice of "The dog chased the cat"?',
    options: [
      "The cat chased the dog.",
      "The cat was chased by the dog.",
      "The dog was chased by the cat.",
      "The cat is chased by the dog.",
    ],
    correctAnswer: 1,
    explanation:
      'In passive voice, the object of the active sentence becomes the subject, and "to be" + past participle is used.',
    category: "Grammar",
    level: "advanced",
  },
  {
    id: "12",
    question: 'Which word is an antonym for "optimistic"?',
    options: ["hopeful", "positive", "pessimistic", "cheerful"],
    correctAnswer: 2,
    explanation: '"Pessimistic" means tending to see the worst aspect of things or believe that the worst will happen.',
    category: "Vocabulary",
    level: "intermediate",
  },
  {
    id: "13",
    question: 'Complete the idiom: "It\'s raining cats and ___."',
    options: ["dogs", "mice", "birds", "frogs"],
    correctAnswer: 0,
    explanation: "\"It's raining cats and dogs\" is an idiom meaning it's raining very heavily.",
    category: "Idioms",
    level: "beginner",
  },
  {
    id: "14",
    question: "Which sentence uses the correct form of the comparative adjective?",
    options: [
      "She is more taller than her brother.",
      "She is taller than her brother.",
      "She is most tall than her brother.",
      "She is tall than her brother.",
    ],
    correctAnswer: 1,
    explanation: 'For one-syllable adjectives, we add "-er" for the comparative form.',
    category: "Adjectives",
    level: "beginner",
  },
  {
    id: "15",
    question: 'What does "ubiquitous" mean?',
    options: ["rare", "scarce", "everywhere", "unique"],
    correctAnswer: 2,
    explanation: '"Ubiquitous" means present, appearing, or found everywhere.',
    category: "Vocabulary",
    level: "advanced",
  },
]

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per question
  const [timerActive, setTimerActive] = useState(false)

  const question = quizQuestions[currentQuestionIndex]

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer("")
    setShowResult(false)
    setTimeLeft(30)
    if (timerActive) {
      // Only restart timer if it was active
      setTimerActive(true)
    }
  }, [currentQuestionIndex])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitAnswer(true) // Auto-submit if time runs out
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft, showResult])

  const startQuiz = () => {
    setQuizCompleted(false)
    setScore(0)
    setUserAnswers([])
    setCurrentQuestionIndex(0) // Start from the first question
    setTimerActive(true)
    setTimeLeft(30)
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleSubmitAnswer = (timedOut = false) => {
    const answerIndex = timedOut ? -1 : Number.parseInt(selectedAnswer) // -1 for timeout
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newAnswers)
    setShowResult(true)
    setTimerActive(false)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setTimerActive(true) // Restart timer for next question
    } else {
      // Quiz completed
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    setQuizCompleted(true)
    setTimerActive(false)

    // Calculate score
    const correctAnswers = userAnswers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length
    setScore(correctAnswers)

    // Save progress to localStorage (optional, but good for tracking)
    const progress = JSON.parse(localStorage.getItem("englishLearningProgress") || "{}")
    progress.totalActivities = (progress.totalActivities || 0) + 1
    progress.completedActivities = (progress.completedActivities || 0) + (correctAnswers > 0 ? 1 : 0) // Mark as completed if at least one correct
    localStorage.setItem("englishLearningProgress", JSON.stringify(progress))
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer("")
    setUserAnswers([])
    setShowResult(false)
    setQuizCompleted(false)
    setScore(0)
    setTimeLeft(30)
    setTimerActive(false)
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

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
                <CardDescription>Here are your results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {score} out of {quizQuestions.length} correct
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Question Review:</h3>
                  {quizQuestions.map((q, index) => {
                    const userAnswer = userAnswers[index]
                    const isCorrect = userAnswer === q.correctAnswer
                    const wasAnswered = userAnswer !== undefined && userAnswer !== -1

                    return (
                      <div key={q.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-2">{q.question}</p>
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-medium">Correct answer:</span>{" "}
                                <span className="text-green-600 dark:text-green-400">{q.options[q.correctAnswer]}</span>
                              </p>
                              {wasAnswered && !isCorrect && (
                                <p>
                                  <span className="font-medium">Your answer:</span>{" "}
                                  <span className="text-red-600 dark:text-red-400">
                                    {userAnswer === -1 ? "No answer (timeout)" : q.options[userAnswer]}
                                  </span>
                                </p>
                              )}
                              <p className="text-gray-600 dark:text-gray-400 italic">{q.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-center">
                  <Button onClick={resetQuiz} size="lg">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Take Quiz Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">English Quiz</h1>
            <p className="text-gray-600 dark:text-gray-300">Test your English knowledge with interactive questions</p>
          </div>

          {!timerActive ? (
            /* Start Screen */
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Ready to Start?</CardTitle>
                <CardDescription>You'll have 30 seconds per question. Good luck!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Quiz Overview:</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Questions:</span> {quizQuestions.length}
                    </div>
                    <div>
                      <span className="font-medium">Time per question:</span> 30 seconds
                    </div>
                    <div>
                      <span className="font-medium">Categories:</span> Grammar, Vocabulary, etc.
                    </div>
                    <div>
                      <span className="font-medium">Levels:</span> Beginner to Advanced
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={startQuiz} size="lg">
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Quiz Interface */
            <div className="space-y-6">
              {/* Progress and Timer */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Time:</span>
                      <Badge variant={timeLeft <= 10 ? "destructive" : "secondary"}>{timeLeft}s</Badge>
                    </div>
                  </div>
                  <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="h-2" />
                </CardContent>
              </Card>

              {/* Question */}
              <Card key={question.id}>
                {" "}
                {/* Added key for re-render */}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(question.level)}>{question.level}</Badge>
                    <Badge variant="outline">{question.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{question.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!showResult ? (
                    <>
                      <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="flex justify-center">
                        <Button onClick={() => handleSubmitAnswer()} disabled={!selectedAnswer} size="lg">
                          Submit Answer
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Show Result */
                    <div className="space-y-4">
                      <div className="text-center">
                        {Number.parseInt(selectedAnswer) === question.correctAnswer ? (
                          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-8 w-8" />
                            <span className="text-xl font-semibold">Correct!</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                            <XCircle className="h-8 w-8" />
                            <span className="text-xl font-semibold">Incorrect</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="font-medium mb-2">Explanation:</p>
                        <p className="text-sm">{question.explanation}</p>
                      </div>

                      <div className="text-center">
                        <Button onClick={handleNextQuestion} size="lg">
                          {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
