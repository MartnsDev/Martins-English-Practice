"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Volume2, RotateCcw, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SpeakingExercise {
  id: string
  title: string
  phrase: string
  level: "beginner" | "intermediate" | "advanced"
  category: string
  phonetic?: string
}

const speakingExercises: SpeakingExercise[] = [
  {
    id: "1",
    title: "Basic Greetings",
    phrase: "Hello, how are you today?",
    level: "beginner",
    category: "Greetings",
    phonetic: "/həˈloʊ, haʊ ɑr ju təˈdeɪ/",
  },
  {
    id: "2",
    title: "Ordering Food",
    phrase: "I would like a cup of coffee, please.",
    level: "intermediate",
    category: "Restaurant",
    phonetic: "/aɪ wʊd laɪk ə kʌp ʌv ˈkɔfi, pliz/",
  },
  {
    id: "3",
    title: "Business Meeting",
    phrase: "Could you please elaborate on that proposal?",
    level: "advanced",
    category: "Business",
    phonetic: "/kʊd ju pliz ɪˈlæbəˌreɪt ɑn ðæt prəˈpoʊzəl/",
  },
  {
    id: "4",
    title: "Weather Talk",
    phrase: "It's a beautiful sunny day outside.",
    level: "beginner",
    category: "Weather",
    phonetic: "/ɪts ə ˈbjutəfəl ˈsʌni deɪ ˈaʊtˌsaɪd/",
  },
  {
    id: "5",
    title: "Asking for Directions",
    phrase: "Excuse me, could you tell me how to get to the nearest subway station?",
    level: "intermediate",
    category: "Travel",
    phonetic: "/ɪkˈskjuz mi, kʊd ju tɛl mi haʊ tu gɛt tu ðə ˈnɪrɪst ˈsʌbˌweɪ ˈsteɪʃən/",
  },
  {
    id: "6",
    title: "Expressing Opinions",
    phrase: "In my opinion, sustainable energy sources are crucial for the future.",
    level: "advanced",
    category: "Debate",
    phonetic: "/ɪn maɪ əˈpɪnjən, səˈsteɪnəbəl ˈɛnərdʒi ˈsɔrsɪz ɑr ˈkruʃəl fɔr ðə ˈfjuʧər/",
  },
  {
    id: "7",
    title: "Making a Reservation",
    phrase: "I'd like to book a table for two at 7 PM under the name Smith.",
    level: "beginner",
    category: "Restaurant",
    phonetic: "/aɪd laɪk tu bʊk ə ˈteɪbəl fɔr tu æt ˈsɛvən pi ɛm ˈʌndər ðə neɪm smɪθ/",
  },
  {
    id: "8",
    title: "Discussing Hobbies",
    phrase: "What do you enjoy doing in your free time?",
    level: "intermediate",
    category: "Social",
    phonetic: "/wʌt du ju ɛnˈʤɔɪ ˈduɪŋ ɪn jʊər fri taɪm/",
  },
  {
    id: "9",
    title: "Problem Solving",
    phrase: "We need to find an innovative solution to this complex challenge.",
    level: "advanced",
    category: "Business",
    phonetic: "/wi nid tu faɪnd ən ˈɪnəˌveɪtɪv səˈluʃən tu ðɪs ˈkɑmplɛks ˈʧælɪnʤ/",
  },
  {
    id: "10",
    title: "Giving Compliments",
    phrase: "That's a fantastic idea! I really appreciate your creativity.",
    level: "beginner",
    category: "Social",
    phonetic: "/ðæts ə fænˈtæstɪk aɪˈdiə! aɪ ˈrɪli əˈpriʃiˌeɪt jʊər ˌkriəˈtɪvɪti/",
  },
]

export default function SpeakingPage() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState("")
  const [accuracy, setAccuracy] = useState(0)
  const [hasRecorded, setHasRecorded] = useState(false)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  const exercise = speakingExercises[currentExerciseIndex]

  // Reset state when exercise changes
  useEffect(() => {
    resetExercise()
  }, [currentExerciseIndex])

  useEffect(() => {
    // Initialize Speech Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript
        setTranscript(result)
        analyzePronunciation(result, exercise.phrase)
        setHasRecorded(true)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        toast({
          title: "Recognition Error",
          description: "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        })
        setIsRecording(false)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
        setIsListening(false)
      }
    } else {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      })
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [exercise.phrase]) // Re-initialize recognition when phrase changes

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript("")
      setFeedback("")
      setAccuracy(0)
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const speakPhrase = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel() // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const analyzePronunciation = (userSpeech: string, targetPhrase: string) => {
    // Simple pronunciation analysis (in a real app, use more sophisticated algorithms)
    const userWords = userSpeech.toLowerCase().split(/\s+/).filter(Boolean)
    const targetWords = targetPhrase.toLowerCase().split(/\s+/).filter(Boolean)

    let matchingWords = 0
    const totalWords = targetWords.length

    targetWords.forEach((word, index) => {
      if (userWords[index] && userWords[index].includes(word.substring(0, Math.min(word.length, 3)))) {
        matchingWords++
      }
    })

    const accuracyScore = totalWords > 0 ? Math.round((matchingWords / totalWords) * 100) : 0
    setAccuracy(accuracyScore)

    if (accuracyScore >= 80) {
      setFeedback("Excellent pronunciation! Well done!")
    } else if (accuracyScore >= 60) {
      setFeedback("Good effort! Try to pronounce each word more clearly.")
    } else {
      setFeedback("Keep practicing! Listen to the example and try again.")
    }
  }

  const nextExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % speakingExercises.length)
  }

  const previousExercise = () => {
    setCurrentExerciseIndex((prevIndex) => (prevIndex - 1 + speakingExercises.length) % speakingExercises.length)
  }

  const resetExercise = () => {
    setTranscript("")
    setFeedback("")
    setAccuracy(0)
    setHasRecorded(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel() // Stop any ongoing speech
    }
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

  const getAccuracyColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Speaking Practice</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Practice your pronunciation with voice recognition technology
            </p>
          </div>

          {/* Exercise Navigation */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button variant="outline" onClick={previousExercise}>
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Exercise {currentExerciseIndex + 1} of {speakingExercises.length}
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
                    <Mic className="h-5 w-5" />
                    {exercise.title}
                  </CardTitle>
                  <CardDescription>{exercise.category}</CardDescription>
                </div>
                <Badge className={getLevelColor(exercise.level)}>{exercise.level}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Phrase */}
              <div className="text-center space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Practice this phrase:</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{exercise.phrase}</p>
                  {exercise.phonetic && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{exercise.phonetic}</p>
                  )}
                </div>

                <Button onClick={() => speakPhrase(exercise.phrase)} variant="outline" size="lg">
                  <Volume2 className="h-5 w-5 mr-2" />
                  Listen to Example
                </Button>
              </div>

              {/* Recording Controls */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} size="lg" variant="destructive">
                      <MicOff className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}

                  <Button onClick={resetExercise} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {isListening && (
                  <div className="flex items-center justify-center gap-2 text-red-500">
                    <div className="animate-pulse">
                      <Mic className="h-6 w-6" />
                    </div>
                    <span>Listening...</span>
                  </div>
                )}
              </div>

              {/* Results */}
              {hasRecorded && (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">What you said:</h4>
                    <p className="text-lg italic">"{transcript}"</p>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Pronunciation Accuracy</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>{accuracy}%</span>
                        {accuracy >= 80 && <CheckCircle className="h-6 w-6 text-green-500" />}
                      </div>
                    </div>
                    <Progress value={accuracy} className="h-3 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feedback}</p>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Speaking Tips:</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Make sure you're in a quiet environment</li>
                  <li>• Listen to the example pronunciation first</li>
                  <li>• Practice the phrase multiple times</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exercises Completed</span>
                  <span>
                    {currentExerciseIndex + 1} / {speakingExercises.length}
                  </span>
                </div>
                <Progress value={((currentExerciseIndex + 1) / speakingExercises.length) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
