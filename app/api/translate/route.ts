import { type NextRequest, NextResponse } from "next/server"

// Malayalam-specific word mappings and corrections
const malayalamCorrections = {
  // Common poetic words that often get mistranslated
  പ്രകാശം: "light",
  സ്വപ്നം: "dream",
  സ്വപ്നങ്ങൾ: "dreams",
  താരകം: "star",
  താരകങ്ങൾ: "stars",
  വാനം: "sky",
  വാനിലെ: "in the sky",
  രാത്രി: "night",
  രാത്രിയുടെ: "of the night",
  മൗനം: "silence",
  മൗനത്തിൽ: "in silence",
  പൂക്കുന്നു: "bloom",
  വിതറുന്നു: "scatter",
  സുന്ദരം: "beautiful",
  സുന്ദരി: "beauty",
  പ്രണയം: "love",
  ഹൃദയം: "heart",
  കാറ്റ്: "wind",
  മഴ: "rain",
  പുഷ്പം: "flower",
  പുഷ്പങ്ങൾ: "flowers",
  കടൽ: "sea",
  നദി: "river",
  പർവ്വതം: "mountain",
  ചന്ദ്രൻ: "moon",
  സൂര്യൻ: "sun",
  പ്രഭാതം: "dawn",
  സന്ധ്യ: "dusk",
}

// Enhanced translation function with Malayalam-specific optimizations
async function translateText(text: string, sourceLang: string, targetLang: string) {
  const isMalayalamToEnglish = sourceLang === "ml" && targetLang === "en"
  const isEnglishToMalayalam = sourceLang === "en" && targetLang === "ml"

  if (isMalayalamToEnglish) {
    return await enhancedMalayalamToEnglish(text)
  } else if (isEnglishToMalayalam) {
    return await enhancedEnglishToMalayalam(text)
  } else if (sourceLang === "ml" || targetLang === "ml") {
    return await translateWithMalayalamEnhancement(text, sourceLang, targetLang)
  }

  return await standardTranslation(text, sourceLang, targetLang)
}

async function enhancedMalayalamToEnglish(text: string) {
  try {
    // First, apply word-level corrections
    let preprocessedText = text
    for (const [malayalam, english] of Object.entries(malayalamCorrections)) {
      const regex = new RegExp(malayalam, "g")
      preprocessedText = preprocessedText.replace(regex, english)
    }

    // Split into lines for better structure preservation
    const lines = text.split("\n")
    const translatedLines = []

    for (const line of lines) {
      if (line.trim() === "") {
        translatedLines.push("")
        continue
      }

      // Try multiple translation approaches for better accuracy
      const translations = await Promise.allSettled([
        // Primary translation
        fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ml&tl=en&dt=t&dt=bd&dt=ex&q=${encodeURIComponent(line)}`,
        ),
        // Alternative translation with different parameters
        fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ml&tl=en&dt=t&dt=rm&q=${encodeURIComponent(line)}`,
        ),
      ])

      let bestTranslation = ""

      // Use the first successful translation
      for (const result of translations) {
        if (result.status === "fulfilled" && result.value.ok) {
          const data = await result.value.json()
          if (data && data[0]) {
            bestTranslation = data[0].map((item: any) => item[0]).join("")
            break
          }
        }
      }

      // Post-process the translation
      bestTranslation = postProcessMalayalamToEnglish(bestTranslation, line)
      translatedLines.push(bestTranslation)
    }

    return {
      translatedText: translatedLines.join("\n"),
      detectedLanguage: "ml",
      enhanced: true,
      quality: "high",
    }
  } catch (error) {
    return await standardTranslation(text, "ml", "en")
  }
}

function postProcessMalayalamToEnglish(translation: string, originalLine: string): string {
  // Fix common translation errors
  let fixed = translation

  // Fix capitalization
  fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1)

  // Fix common mistranslations
  const fixes = {
    "spreads light": "scatter light",
    "spread light": "scatter light",
    "blooming dreams": "dreams bloom",
    "dream blooming": "dreams bloom",
    "night silence": "silence of night",
    "sky stars": "stars in the sky",
    "star sky": "stars in the sky",
  }

  for (const [wrong, correct] of Object.entries(fixes)) {
    fixed = fixed.replace(new RegExp(wrong, "gi"), correct)
  }

  // Remove redundant words
  fixed = fixed.replace(/\b(the the|a a|in in|of of)\b/gi, (match) => match.split(" ")[0])

  return fixed.trim()
}

async function enhancedEnglishToMalayalam(text: string) {
  try {
    const lines = text.split("\n")
    const translatedLines = []

    for (const line of lines) {
      if (line.trim() === "") {
        translatedLines.push("")
        continue
      }

      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ml&dt=t&dt=bd&q=${encodeURIComponent(line)}`,
      )

      if (!response.ok) {
        throw new Error("Translation service unavailable")
      }

      const data = await response.json()
      let translatedLine = ""

      if (data && data[0]) {
        translatedLine = data[0].map((item: any) => item[0]).join("")
      }

      translatedLines.push(translatedLine)
    }

    return {
      translatedText: translatedLines.join("\n"),
      detectedLanguage: "en",
      enhanced: true,
      quality: "high",
    }
  } catch (error) {
    return await standardTranslation(text, "en", "ml")
  }
}

async function translateWithMalayalamEnhancement(text: string, sourceLang: string, targetLang: string) {
  try {
    const lines = text.split("\n")
    const translatedLines = []

    for (const line of lines) {
      if (line.trim() === "") {
        translatedLines.push("")
        continue
      }

      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=bd&q=${encodeURIComponent(line)}`,
      )

      if (!response.ok) {
        throw new Error("Translation service unavailable")
      }

      const data = await response.json()
      let translatedLine = ""

      if (data && data[0]) {
        translatedLine = data[0].map((item: any) => item[0]).join("")
      }

      translatedLines.push(translatedLine)
    }

    return {
      translatedText: translatedLines.join("\n"),
      detectedLanguage: sourceLang,
      enhanced: true,
      quality: "medium",
    }
  } catch (error) {
    return await standardTranslation(text, sourceLang, targetLang)
  }
}

async function standardTranslation(text: string, sourceLang: string, targetLang: string) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
  )

  if (!response.ok) {
    throw new Error("Translation service unavailable")
  }

  const data = await response.json()
  let translatedText = ""

  if (data && data[0]) {
    translatedText = data[0].map((item: any) => item[0]).join("")
  }

  return {
    translatedText,
    detectedLanguage: data[2] || sourceLang,
    enhanced: false,
    quality: "standard",
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const result = await translateText(text, sourceLang, targetLang)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed. Please try again." }, { status: 500 })
  }
}
