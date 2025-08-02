// Utility function for translation using MyMemory API
export async function translateWithAPI(text: string, fromLang: string, toLang: string): Promise<string> {
  try {
    const langpair = `${fromLang}|${toLang}`
    const encodedText = encodeURIComponent(text.trim())
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langpair}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData) {
      let translation = data.responseData.translatedText

      // Clean up the translation
      translation = translation.trim()

      // Capitalize first letter if it's a sentence
      if (translation.length > 0) {
        translation = translation.charAt(0).toUpperCase() + translation.slice(1)
      }

      return translation
    } else {
      throw new Error("Translation failed: " + (data.responseDetails || "Unknown error"))
    }
  } catch (error) {
    console.error("Translation API error:", error)
    throw error
  }
}

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>()

// Basic fallback dictionary for common words
const basicDictionary: { [key: string]: string } = {
  // Common words
  hello: "olá",
  goodbye: "tchau",
  thank: "obrigado",
  please: "por favor",
  yes: "sim",
  no: "não",
  good: "bom",
  bad: "ruim",
  big: "grande",
  small: "pequeno",
  hot: "quente",
  cold: "frio",
  happy: "feliz",
  sad: "triste",
  beautiful: "bonito",
  ugly: "feio",
  easy: "fácil",
  difficult: "difícil",
  fast: "rápido",
  slow: "devagar",
  new: "novo",
  old: "velho",
  house: "casa",
  car: "carro",
  water: "água",
  food: "comida",
  book: "livro",
  time: "tempo",
  day: "dia",
  night: "noite",
  morning: "manhã",
  afternoon: "tarde",
  evening: "noite",
  today: "hoje",
  tomorrow: "amanhã",
  yesterday: "ontem",
  love: "amor",
  friend: "amigo",
  family: "família",
  work: "trabalho",
  school: "escola",
  learn: "aprender",
  study: "estudar",
  read: "ler",
  write: "escrever",
  speak: "falar",
  listen: "escutar",
  understand: "entender",
  know: "saber",
  think: "pensar",
  see: "ver",
  hear: "ouvir",
  eat: "comer",
  drink: "beber",
  sleep: "dormir",
  walk: "caminhar",
  run: "correr",
  go: "ir",
  come: "vir",
  have: "ter",
  want: "querer",
  need: "precisar",
  like: "gostar",
  red: "vermelho",
  blue: "azul",
  green: "verde",
  yellow: "amarelo",
  black: "preto",
  white: "branco",
  one: "um",
  two: "dois",
  three: "três",
  four: "quatro",
  five: "cinco",
  six: "seis",
  seven: "sete",
  eight: "oito",
  nine: "nove",
  ten: "dez",
}

// Enhanced cache function with fallback
export async function translateWithCache(text: string, fromLang: string, toLang: string): Promise<string> {
  const cacheKey = `${text}-${fromLang}-${toLang}`
  const cleanText = text.toLowerCase().trim()

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    const translation = await translateWithAPI(text, fromLang, toLang)
    // Cache the result
    translationCache.set(cacheKey, translation)
    return translation
  } catch (error) {
    console.error("Translation API failed:", error)

    // Try basic dictionary fallback for common words
    if (fromLang === "en" && toLang === "pt" && basicDictionary[cleanText]) {
      const fallbackTranslation = basicDictionary[cleanText]
      translationCache.set(cacheKey, fallbackTranslation)
      return fallbackTranslation
    }

    // If all fails, return a helpful message
    return `Translation unavailable for "${text}"`
  }
}
