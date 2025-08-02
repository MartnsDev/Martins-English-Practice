"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, Copy, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { translateWithAPI } from "@/lib/translator"

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("pt")
  const [isTranslating, setIsTranslating] = useState(false)
  const { toast } = useToast()

  const languages = [
    { code: "en", name: "English" },
    { code: "pt", name: "Portuguese" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
  ]

  // Translation function using MyMemory API
  const translateText = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)

    try {
      const translation = await translateWithAPI(sourceText, sourceLang, targetLang)
      setTranslatedText(translation)

      toast({
        title: "Translation completed",
        description: "Text has been translated successfully using MyMemory API.",
      })
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation failed",
        description: "Unable to translate text. Please check your internet connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    })
  }

  const speakText = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "pt" ? "pt-BR" : lang
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Martins Translator</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Instantly translate text between different languages using MyMemory API
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Language Translator</CardTitle>
              <CardDescription>Enter text below and get instant translations powered by MyMemory API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="flex items-center justify-center space-x-4">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" onClick={swapLanguages} className="shrink-0 bg-transparent">
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>

                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Translation Interface */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Source Text</label>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(sourceText, sourceLang)}
                        disabled={!sourceText}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sourceText)}
                        disabled={!sourceText}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Enter text to translate..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>

                {/* Translated Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Translation</label>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(translatedText, targetLang)}
                        disabled={!translatedText}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(translatedText)}
                        disabled={!translatedText}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Translation will appear here..."
                    value={translatedText}
                    readOnly
                    className="min-h-[200px] resize-none bg-muted"
                  />
                </div>
              </div>

              {/* Translate Button */}
              <div className="flex justify-center">
                <Button onClick={translateText} disabled={!sourceText.trim() || isTranslating} size="lg">
                  {isTranslating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Translating with API...
                    </div>
                  ) : (
                    "Translate"
                  )}
                </Button>
              </div>

              {/* API Info */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>🌐 Powered by MyMemory Translation API</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
