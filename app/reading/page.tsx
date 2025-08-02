"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Volume2, HelpCircle, Loader2 } from "lucide-react"
import { translateWithCache } from "@/lib/translator"
import { useEffect } from "react"

interface ReadingText {
  id: string
  title: string
  content: string
  level: "beginner" | "intermediate" | "advanced"
  category: string
  wordCount: number
}

const readingTexts: ReadingText[] = [
  {
    id: "1",
    title: "A Day at the Beach",
    content: `Sarah woke up early on Saturday morning. The sun was shining brightly through her bedroom window. She looked outside and saw that it was a perfect day for the beach.

She packed her beach bag with sunscreen, a towel, and a good book. Her friend Emma called and asked if she wanted to go together. "Of course!" Sarah replied happily.

They drove to the beach and found a nice spot near the water. The sand was warm under their feet, and the ocean waves made a peaceful sound. They spent the whole day swimming, reading, and enjoying the beautiful weather.

As the sun began to set, they packed their things and headed home. It had been a wonderful day at the beach.`,
    level: "beginner",
    category: "Daily Life",
    wordCount: 120,
  },
  {
    id: "2",
    title: "The Future of Technology",
    content: `Technology continues to evolve at an unprecedented pace, fundamentally transforming how we live, work, and interact with the world around us. Artificial intelligence, once confined to the realm of science fiction, has become an integral part of our daily lives.

From smartphones that can recognize our voices to cars that can drive themselves, AI applications are becoming increasingly sophisticated. Machine learning algorithms analyze vast amounts of data to provide personalized recommendations, whether we're shopping online or streaming our favorite shows.

The Internet of Things (IoT) has connected everyday objects to the internet, creating smart homes where we can control lighting, temperature, and security systems remotely. Wearable devices monitor our health and fitness, providing real-time feedback about our physical condition.

However, these technological advances also raise important questions about privacy, security, and the future of employment. As we embrace these innovations, we must carefully consider their implications for society and ensure that technology serves humanity's best interests.`,
    level: "advanced",
    category: "Technology",
    wordCount: 180,
  },
  {
    id: "3",
    title: "Cooking Your First Meal",
    content: `Learning to cook can seem challenging at first, but with practice and patience, anyone can prepare delicious meals. Start with simple recipes that require only a few ingredients and basic cooking techniques.

One of the easiest dishes to begin with is pasta. Boil water in a large pot, add salt, and cook the pasta according to the package instructions. While the pasta cooks, you can prepare a simple sauce using olive oil, garlic, and tomatoes.

Always read the entire recipe before you start cooking. This helps you understand the steps and prepare all the ingredients beforehand. Professional chefs call this "mise en place," which means having everything in its place.

Don't be afraid to make mistakes – they're part of the learning process. Each time you cook, you'll gain more confidence and develop your own style. Soon, you'll be creating your own recipes and impressing friends and family with your culinary skills.`,
    level: "intermediate",
    category: "Cooking",
    wordCount: 150,
  },
  {
    id: "4",
    title: "The Benefits of Reading",
    content: `Reading is a powerful tool for personal growth and intellectual development. It expands your vocabulary, improves comprehension, and exposes you to new ideas and perspectives. Regular reading can also reduce stress and enhance your critical thinking skills. Whether it's fiction or non-fiction, make reading a consistent part of your daily routine.`,
    level: "beginner",
    category: "Education",
    wordCount: 90,
  },
  {
    id: "5",
    title: "Understanding Climate Change",
    content: `Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas. This generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun’s heat and raising temperatures.`,
    level: "intermediate",
    category: "Environment",
    wordCount: 110,
  },
  {
    id: "6",
    title: "The Rise of E-commerce",
    content: `E-commerce, or electronic commerce, has revolutionized the way businesses operate and consumers shop. The convenience of online shopping, coupled with a vast selection of products and competitive pricing, has led to its rapid growth. Companies now invest heavily in user-friendly websites, secure payment gateways, and efficient logistics to meet the demands of the digital marketplace.`,
    level: "advanced",
    category: "Business",
    wordCount: 100,
  },
  {
    id: "7",
    title: "My Favorite Season",
    content: `My favorite season is autumn. I love when the leaves on the trees change colors to red, orange, and yellow. The air becomes crisp and cool, perfect for long walks. I also enjoy drinking hot chocolate and wearing cozy sweaters. Autumn always feels like a fresh start, even more than spring.`,
    level: "beginner",
    category: "Personal",
    wordCount: 80,
  },
  {
    id: "8",
    title: "The History of the Internet",
    content: `The Internet began in the 1960s as a U.S. government research project, ARPANET, designed to allow computers to communicate. It evolved into a global network in the 1990s with the invention of the World Wide Web by Tim Berners-Lee. This made information accessible to everyone, transforming communication, commerce, and education worldwide.`,
    level: "intermediate",
    category: "Technology",
    wordCount: 95,
  },
  {
    id: "9",
    title: "Quantum Computing Explained",
    content: `Quantum computing is a new type of computing that uses the principles of quantum mechanics to solve complex problems that classical computers cannot. Instead of bits, which are either 0 or 1, quantum computers use qubits, which can be 0, 1, or both simultaneously. This allows them to process vast amounts of information much faster, potentially revolutionizing fields like medicine and cryptography.`,
    level: "advanced",
    category: "Science",
    wordCount: 105,
  },
  {
    id: "10",
    title: "The Importance of Water",
    content: `Water is essential for all known forms of life. It covers about 71% of the Earth's surface, mostly in oceans and other large water bodies. Humans need water to survive, and it plays a crucial role in agriculture, industry, and ecosystems. Conserving water is vital for the planet's future.`,
    level: "beginner",
    category: "Environment",
    wordCount: 75,
  },
]

export default function ReadingPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [currentTextIndex, setCurrentTextIndex] = useState(0) // Changed to index
  const [selectedWord, setSelectedWord] = useState<string>("")
  const [wordTranslation, setWordTranslation] = useState<string>("")
  const [isTranslatingWord, setIsTranslatingWord] = useState(false)

  // Filter texts based on selected level
  const filteredTexts =
    selectedLevel === "all" ? readingTexts : readingTexts.filter((text) => text.level === selectedLevel)

  // Reset selected word/translation when text changes
  useEffect(() => {
    setSelectedWord("")
    setWordTranslation("")
  }, [currentTextIndex, selectedLevel])

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

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel() // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleWordClick = async (word: string) => {
    // Remove punctuation and convert to lowercase
    const cleanWord = word.replace(/[^\w]/g, "").toLowerCase()
    if (!cleanWord || cleanWord.length < 2) {
      setWordTranslation("Invalid word for translation.")
      setSelectedWord(word) // Still show the original word
      return
    }

    setSelectedWord(cleanWord)
    setIsTranslatingWord(true)
    setWordTranslation("Translating...")

    try {
      // Use the API to translate the word
      const translation = await translateWithCache(cleanWord, "en", "pt")
      setWordTranslation(translation)
    } catch (error) {
      console.error("Translation error:", error)
      setWordTranslation("Translation failed. Check internet connection.")
    } finally {
      setIsTranslatingWord(false)
    }
  }

  const renderTextWithClickableWords = (text: string) => {
    return text.split(" ").map((word, index) => (
      <span
        key={index}
        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 px-1 rounded transition-colors"
        onClick={() => handleWordClick(word)}
      >
        {word}{" "}
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Reading Practice</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Improve your reading skills with texts adapted to your level
            </p>
          </div>

          {/* Level Filter */}
          <div className="flex justify-center mb-8">
            <Select
              value={selectedLevel}
              onValueChange={(value) => {
                setSelectedLevel(value)
                setCurrentTextIndex(0) // Reset to first text when filter changes
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reading Texts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTexts.map((text, index) => (
              <Card key={text.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getLevelColor(text.level)}>{text.level}</Badge>
                    <span className="text-sm text-gray-500">{text.wordCount} words</span>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {text.title}
                  </CardTitle>
                  <CardDescription>{text.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {text.content.substring(0, 150)}...
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setCurrentTextIndex(index)}>
                        {" "}
                        {/* Set index on click */}
                        Read Full Text
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {filteredTexts[currentTextIndex].title} {/* Use currentTextIndex */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(filteredTexts[currentTextIndex].content)}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </DialogTitle>
                        <DialogDescription>
                          <div className="flex items-center gap-4">
                            <Badge className={getLevelColor(filteredTexts[currentTextIndex].level)}>
                              {filteredTexts[currentTextIndex].level}
                            </Badge>
                            <span>{filteredTexts[currentTextIndex].category}</span>
                            <span>{filteredTexts[currentTextIndex].wordCount} words</span>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="text-lg leading-relaxed">
                            {renderTextWithClickableWords(filteredTexts[currentTextIndex].content)}
                          </div>
                        </div>

                        {/* Word Translation Popup */}
                        {selectedWord && (
                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <HelpCircle className="h-4 w-4" />
                              <span className="font-semibold">Word Translation</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{selectedWord}</span>
                              <div className="flex items-center gap-2">
                                {isTranslatingWord && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span className="text-blue-600 dark:text-blue-400">{wordTranslation}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => speakText(selectedWord)}>
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                          <p>💡 Tip: Click on any word to see its translation (powered by MyMemory API)</p>
                          <p>🌐 Internet connection required for translations</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredTexts.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No reading texts found for the selected level.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
