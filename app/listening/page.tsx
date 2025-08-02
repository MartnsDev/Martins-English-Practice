"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Volume2, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ListeningExercise {
  id: string
  title: string
  text: string
  level: "beginner" | "intermediate" | "advanced"
  category: string
  questions: {
    question: string
    answer: string
    type: "fill-blank" | "multiple-choice"
    options?: string[]
  }[]
}

const listeningExercises: ListeningExercise[] = [
  {
    id: "1",
    title: "Daily Routine",
    text: "Every morning, I wake up at seven o'clock. I brush my teeth, take a shower, and have breakfast. Then I go to work by bus. I work from nine to five. In the evening, I like to read books or watch movies.",
    level: "beginner",
    category: "Daily Life",
    questions: [
      {
        question: "What time does the person wake up?",
        answer: "seven o'clock",
        type: "fill-blank",
      },
      {
        question: "How does the person go to work?",
        answer: "by bus",
        type: "multiple-choice",
        options: ["by car", "by bus", "on foot", "by train"],
      },
      {
        question: "What does the person do in the evening?",
        answer: "read books or watch movies",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "2",
    title: "Weather Forecast",
    text: "Tomorrow will be partly cloudy with temperatures reaching twenty-five degrees Celsius. There is a thirty percent chance of rain in the afternoon. Winds will be light from the southwest. It will be a perfect day for outdoor activities.",
    level: "intermediate",
    category: "Weather",
    questions: [
      {
        question: "What will the temperature be tomorrow?",
        answer: "twenty-five degrees",
        type: "fill-blank",
      },
      {
        question: "What is the chance of rain?",
        answer: "thirty percent",
        type: "multiple-choice",
        options: ["twenty percent", "thirty percent", "forty percent", "fifty percent"],
      },
      {
        question: "What kind of day will it be for outdoor activities?",
        answer: "perfect",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "3",
    title: "The History of Coffee",
    text: "Coffee originated in Ethiopia and was first cultivated in Yemen. It became popular in the Arab world before spreading to Europe in the 17th century. Coffee houses became centers of social and intellectual life. Today, coffee is one of the most consumed beverages globally.",
    level: "intermediate",
    category: "History",
    questions: [
      {
        question: "Where did coffee originate?",
        answer: "Ethiopia",
        type: "fill-blank",
      },
      {
        question: "When did coffee spread to Europe?",
        answer: "17th century",
        type: "fill-blank",
      },
      {
        question: "What did coffee houses become?",
        answer: "centers of social and intellectual life",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "4",
    title: "Space Exploration",
    text: "Humanity's journey into space began in the mid-20th century. The first artificial satellite, Sputnik 1, was launched by the Soviet Union in 1957. Just a few years later, Yuri Gagarin became the first human to orbit the Earth. Today, organizations like NASA and SpaceX continue to push the boundaries of space exploration, with ambitious plans for missions to Mars and beyond.",
    level: "advanced",
    category: "Science",
    questions: [
      {
        question: "When did humanity's journey into space begin?",
        answer: "mid-20th century",
        type: "fill-blank",
      },
      {
        question: "Who was the first human to orbit the Earth?",
        answer: "Yuri Gagarin",
        type: "fill-blank",
      },
      {
        question: "What are organizations like NASA and SpaceX planning?",
        answer: "missions to Mars and beyond",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "5",
    title: "Healthy Eating Habits",
    text: "Maintaining a balanced diet is crucial for good health. It involves consuming a variety of fruits, vegetables, whole grains, and lean proteins. Limiting processed foods, sugary drinks, and excessive fats can significantly improve your well-being. Remember to stay hydrated by drinking plenty of water throughout the day.",
    level: "beginner",
    category: "Health",
    questions: [
      {
        question: "What is crucial for good health?",
        answer: "balanced diet",
        type: "fill-blank",
      },
      {
        question: "What should you limit in your diet?",
        answer: "processed foods, sugary drinks, and excessive fats",
        type: "fill-blank",
      },
      {
        question: "How can you stay hydrated?",
        answer: "drinking plenty of water",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "6",
    title: "The Importance of Sleep",
    text: "Sleep is vital for both physical and mental health. During sleep, your body repairs itself, and your brain processes information and consolidates memories. Lack of sleep can lead to fatigue, irritability, and difficulty concentrating. Adults typically need 7-9 hours of sleep per night for optimal functioning.",
    level: "intermediate",
    category: "Health",
    questions: [
      {
        question: "What does your body do during sleep?",
        answer: "repairs itself",
        type: "fill-blank",
      },
      {
        question: "What can lack of sleep lead to?",
        answer: "fatigue, irritability, and difficulty concentrating",
        type: "fill-blank",
      },
      {
        question: "How many hours of sleep do adults typically need?",
        answer: "7-9 hours",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "7",
    title: "Artificial Intelligence Ethics",
    text: "As artificial intelligence becomes more sophisticated, ethical considerations are increasingly important. Questions arise about data privacy, algorithmic bias, and the impact on employment. Developers and policymakers must work together to ensure AI is developed responsibly and benefits all of humanity, not just a select few.",
    level: "advanced",
    category: "Technology",
    questions: [
      {
        question: "What are important considerations as AI becomes sophisticated?",
        answer: "ethical considerations",
        type: "fill-blank",
      },
      {
        question: "Who must work together to ensure responsible AI development?",
        answer: "developers and policymakers",
        type: "fill-blank",
      },
      {
        question: "What are some questions that arise about AI?",
        answer: "data privacy, algorithmic bias, and the impact on employment",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "8",
    title: "The Benefits of Exercise",
    text: "Regular exercise offers numerous benefits for physical and mental well-being. It strengthens your heart and lungs, helps manage weight, and reduces the risk of chronic diseases. Exercise also boosts mood, reduces stress, and improves cognitive function. Aim for at least 30 minutes of moderate-intensity activity most days of the week.",
    level: "beginner",
    category: "Health",
    questions: [
      {
        question: "What does regular exercise strengthen?",
        answer: "heart and lungs",
        type: "fill-blank",
      },
      {
        question: "What can exercise reduce the risk of?",
        answer: "chronic diseases",
        type: "fill-blank",
      },
      {
        question: "How much moderate-intensity activity is recommended?",
        answer: "at least 30 minutes most days of the week",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "9",
    title: "Global Warming Impacts",
    text: "Global warming is causing significant changes to our planet. Rising temperatures lead to melting glaciers, rising sea levels, and more frequent extreme weather events like heatwaves and floods. These changes threaten ecosystems, agriculture, and human settlements. Urgent action is needed to reduce greenhouse gas emissions and mitigate these impacts.",
    level: "advanced",
    category: "Environment",
    questions: [
      {
        question: "What are some impacts of rising temperatures?",
        answer: "melting glaciers, rising sea levels, and more frequent extreme weather events",
        type: "fill-blank",
      },
      {
        question: "What do these changes threaten?",
        answer: "ecosystems, agriculture, and human settlements",
        type: "fill-blank",
      },
      {
        question: "What kind of action is needed to address global warming?",
        answer: "urgent action to reduce greenhouse gas emissions",
        type: "fill-blank",
      },
    ],
  },
  {
    id: "10",
    title: "The Art of Storytelling",
    text: "Storytelling is an ancient art form that has been used across cultures to entertain, educate, and preserve history. A good story captures the imagination, evokes emotion, and often conveys a deeper message. Whether through spoken word, written text, or visual media, stories connect us and help us understand the human experience.",
    level: "intermediate",
    category: "Culture",
    questions: [
      {
        question: "What is storytelling?",
        answer: "an ancient art form",
        type: "fill-blank",
      },
      {
        question: "What does a good story do?",
        answer: "captures the imagination, evokes emotion, and often conveys a deeper message",
        type: "fill-blank",
      },
      {
        question: "How do stories connect us?",
        answer: "help us understand the human experience",
        type: "fill-blank",
      },
    ],
  },
]

export default function ListeningPage() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const { toast } = useToast()

  const exercise = listeningExercises[currentExerciseIndex]

  // Reset state when exercise changes
  useEffect(() => {
    resetExercise()
  }, [currentExerciseIndex])

  const speakText = (text: string, rate: number = playbackRate) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel() // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      utterance.rate = rate
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answer
    setUserAnswers(newAnswers)
  }

  const checkAnswers = () => {
    setShowResults(true)
    const correctAnswersCount = userAnswers.filter((answer, index) =>
      answer.toLowerCase().includes(exercise.questions[index].answer.toLowerCase()),
    ).length

    toast({
      title: "Results",
      description: `You got ${correctAnswersCount} out of ${exercise.questions.length} questions correct!`,
    })
  }

  const resetExercise = () => {
    setUserAnswers(Array(exercise.questions.length).fill("")) // Initialize with empty strings
    setShowResults(false)
    stopSpeech()
  }

  const nextExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % listeningExercises.length)
  }

  const previousExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex - 1 + listeningExercises.length) % listeningExercises.length)
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

  const isAnswerCorrect = (questionIndex: number) => {
    if (!showResults) return null
    const userAnswer = userAnswers[questionIndex] || ""
    const correctAnswer = exercise.questions[questionIndex].answer
    return userAnswer.toLowerCase().includes(correctAnswer.toLowerCase())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Listening Practice</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Improve your listening skills with audio exercises and comprehension questions
            </p>
          </div>

          {/* Exercise Navigation */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button variant="outline" onClick={previousExercise}>
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Exercise {currentExerciseIndex + 1} of {listeningExercises.length}
            </span>
            <Button variant="outline" onClick={nextExercise}>
              Next
            </Button>
          </div>

          {/* Current Exercise */}
          <Card className="mb-8" key={exercise.id}>
            {" "}
            {/* Added key for re-render */}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    {exercise.title}
                  </CardTitle>
                  <CardDescription>{exercise.category}</CardDescription>
                </div>
                <Badge className={getLevelColor(exercise.level)}>{exercise.level}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Audio Controls */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Button onClick={() => (isPlaying ? stopSpeech() : speakText(exercise.text))} size="lg">
                  {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isPlaying ? "Pause" : "Play Audio"}
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Speed:</span>
                  <Button
                    variant={playbackRate === 0.5 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackRate(0.5)}
                  >
                    0.5x
                  </Button>
                  <Button
                    variant={playbackRate === 0.75 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackRate(0.75)}
                  >
                    0.75x
                  </Button>
                  <Button
                    variant={playbackRate === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackRate(1)}
                  >
                    1x
                  </Button>
                </div>

                <Button variant="outline" onClick={resetExercise}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Comprehension Questions</h3>

                {exercise.questions.map((question, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {index + 1}. {question.question}
                      </span>
                      {showResults && (
                        <div className="flex items-center">
                          {isAnswerCorrect(index) ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {question.type === "fill-blank" ? (
                      <Input
                        placeholder="Type your answer here..."
                        value={userAnswers[index] || ""}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        disabled={showResults}
                        className={showResults ? (isAnswerCorrect(index) ? "border-green-500" : "border-red-500") : ""}
                      />
                    ) : (
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              checked={userAnswers[index] === option}
                              onChange={(e) => handleAnswerChange(index, e.target.value)}
                              disabled={showResults}
                              className="text-blue-600"
                            />
                            <span
                              className={
                                showResults && option === question.answer
                                  ? "text-green-600 font-semibold"
                                  : showResults && userAnswers[index] === option && option !== question.answer
                                    ? "text-red-600"
                                    : ""
                              }
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {showResults && !isAnswerCorrect(index) && (
                      <p className="text-sm text-green-600 dark:text-green-400">Correct answer: {question.answer}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                {!showResults ? (
                  <Button
                    onClick={checkAnswers}
                    disabled={userAnswers.filter(Boolean).length !== exercise.questions.length}
                    size="lg"
                  >
                    Check Answers
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-4">
                      Score:{" "}
                      {
                        userAnswers.filter((answer, index) =>
                          answer.toLowerCase().includes(exercise.questions[index].answer.toLowerCase()),
                        ).length
                      }{" "}
                      / {exercise.questions.length}
                    </p>
                    <Button onClick={resetExercise} size="lg">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exercises Completed</span>
                  <span>
                    {currentExerciseIndex + 1} / {listeningExercises.length}
                  </span>
                </div>
                <Progress value={((currentExerciseIndex + 1) / listeningExercises.length) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
