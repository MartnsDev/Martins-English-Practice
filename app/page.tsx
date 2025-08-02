"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, MessageSquare, Headphones, Mic, PenTool, FileText, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

interface UserProgress {
  totalActivities: number
  completedActivities: number
  vocabularyWords: number
  studyStreak: number
  level: string
}

export default function HomePage() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalActivities: 0,
    completedActivities: 0,
    vocabularyWords: 0,
    studyStreak: 0,
    level: "Beginner",
  })

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem("englishLearningProgress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  const progressPercentage =
    userProgress.totalActivities > 0 ? (userProgress.completedActivities / userProgress.totalActivities) * 100 : 0

  const studyModes = [
    {
      title: "Reading",
      description: "Practice reading with texts adapted to your level",
      icon: BookOpen,
      href: "/reading",
      color: "bg-blue-500",
    },
    {
      title: "Vocabulary",
      description: "Build your vocabulary with interactive flashcards",
      icon: Star,
      href: "/vocabulary",
      color: "bg-green-500",
    },
    {
      title: "Listening",
      description: "Improve your listening skills with audio exercises",
      icon: Headphones,
      href: "/listening",
      color: "bg-purple-500",
    },
    {
      title: "Speaking",
      description: "Practice pronunciation with voice recognition",
      icon: Mic,
      href: "/speaking",
      color: "bg-red-500",
    },
    {
      title: "Writing",
      description: "Enhance your writing with guided exercises",
      icon: PenTool,
      href: "/writing",
      color: "bg-yellow-500",
    },
    {
      title: "Quiz",
      description: "Test your knowledge with interactive quizzes",
      icon: MessageSquare,
      href: "/quiz",
      color: "bg-indigo-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Martins English Practice
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master English with Martins comprehensive, interactive learning platform designed for autonomous study
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Keep track of your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userProgress.completedActivities}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Activities Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userProgress.vocabularyWords}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Words Learned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {userProgress.studyStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userProgress.level}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Study Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {studyModes.map((mode) => (
            <Link key={mode.title} href={mode.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <mode.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Access Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/translator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Translator
                </CardTitle>
                <CardDescription>Instantly translate text between English and your native language</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/notes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Personal Notes
                </CardTitle>
                <CardDescription>Keep track of your learning with personal notes and observations</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
