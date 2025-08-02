"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Languages, Sparkles, BookOpen, Wand2, CheckCircle, ArrowRight, Zap, Heart, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { malayalamSamples } from "@/components/malayalam-samples"

const languages = [
  { code: "auto", name: "Auto-detect" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ml", name: "Malayalam", enhanced: true },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ur", name: "Urdu" },
  { code: "fa", name: "Persian" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
]

export default function PoetryTranslator() {
  const [originalPoem, setOriginalPoem] = useState("")
  const [translatedPoem, setTranslatedPoem] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("auto")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationQuality, setTranslationQuality] = useState<string>("")
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!originalPoem.trim()) {
      toast({
        title: "Please enter a poem",
        description: "Add some text to translate",
        variant: "destructive",
      })
      return
    }

    if (sourceLanguage === targetLanguage && sourceLanguage !== "auto") {
      toast({
        title: "Same language selected",
        description: "Please select different source and target languages",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: originalPoem,
          sourceLang: sourceLanguage === "auto" ? "auto" : sourceLanguage,
          targetLang: targetLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setTranslatedPoem(data.translatedText)
      setTranslationQuality(data.quality || "standard")

      const qualityMessage =
        data.quality === "high"
          ? " with high-quality processing"
          : data.quality === "medium"
            ? " with enhanced processing"
            : ""

      toast({
        title: "Translation complete!",
        description: `Your poem has been translated to ${languages.find((l) => l.code === targetLanguage)?.name}${qualityMessage}`,
      })
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const clearAll = () => {
    setOriginalPoem("")
    setTranslatedPoem("")
    setTranslationQuality("")
  }

  const loadSample = (sampleKey: keyof typeof malayalamSamples) => {
    setOriginalPoem(malayalamSamples[sampleKey])
    if (sampleKey === "malayalam") {
      setSourceLanguage("ml")
      setTargetLanguage("en")
    } else if (sampleKey === "english") {
      setSourceLanguage("en")
      setTargetLanguage("ml")
    } else if (sampleKey === "hindi") {
      setSourceLanguage("hi")
      setTargetLanguage("ml")
    }
  }

  const isMalayalamToEnglish = sourceLanguage === "ml" && targetLanguage === "en"
  const isEnglishToMalayalam = sourceLanguage === "en" && targetLanguage === "ml"

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Languages className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Poetry Translator
            </h1>
            <div className="flex gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your poems across languages with AI-powered precision. Experience the magic of poetry in any
            language with our enhanced Malayalam processing.
          </p>
        </div>

        {/* Enhanced Status Cards */}
        {isMalayalamToEnglish && (
          <div className="mb-8">
            <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-blue-900">Malayalam → English Enhanced</span>
                      <Badge className="bg-blue-500 text-white border-0 shadow-lg">
                        <Zap className="h-3 w-3 mr-1" />
                        High Quality
                      </Badge>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Advanced word mapping, context correction, and multiple translation approaches for superior
                      accuracy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isEnglishToMalayalam && (
          <div className="mb-8">
            <Card className="border-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-xl">
                    <Wand2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-green-900">English → Malayalam Enhanced</span>
                      <Badge className="bg-green-500 text-white border-0 shadow-lg">
                        <Heart className="h-3 w-3 mr-1" />
                        Enhanced
                      </Badge>
                    </div>
                    <p className="text-green-700 text-sm">
                      Optimized for cultural context preservation and natural Malayalam expression.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modern Sample Poems */}
        <Card className="mb-8 border-0 bg-white/60 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              Sample Poems
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-0">
                Try Now
              </Badge>
            </CardTitle>
            <CardDescription className="text-lg">
              Experience the magic with these carefully curated sample poems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button
                variant="outline"
                className="h-auto p-6 text-left justify-start bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                onClick={() => loadSample("malayalam")}
              >
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-semibold text-blue-900">Malayalam Sample</div>
                    <Badge className="bg-blue-500 text-white text-xs border-0">ML→EN</Badge>
                  </div>
                  <div className="text-sm text-blue-700 line-clamp-2 group-hover:text-blue-800 transition-colors">
                    വാനിലെ താരകങ്ങൾ പ്രകാശം വിതറുന്നു...
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 text-left justify-start bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                onClick={() => loadSample("english")}
              >
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-semibold text-green-900">English Sample</div>
                    <Badge className="bg-green-500 text-white text-xs border-0">EN→ML</Badge>
                  </div>
                  <div className="text-sm text-green-700 line-clamp-2 group-hover:text-green-800 transition-colors">
                    Stars in the sky scatter their light...
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-500 mt-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 text-left justify-start bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                onClick={() => loadSample("hindi")}
              >
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-semibold text-purple-900">Hindi Sample</div>
                    <Badge className="bg-purple-500 text-white text-xs border-0">HI→ML</Badge>
                  </div>
                  <div className="text-sm text-purple-700 line-clamp-2 group-hover:text-purple-800 transition-colors">
                    आकाश में तारे बिखेरते हैं प्रकाश...
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-500 mt-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modern Language Selection */}
        <Card className="mb-8 border-0 bg-white/60 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              Language Settings
            </CardTitle>
            <CardDescription className="text-lg">
              Choose your source and target languages for magical translation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="source-lang" className="text-lg font-medium">
                  From
                </Label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger
                    id="source-lang"
                    className="h-14 text-lg border-0 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg"
                  >
                    <SelectValue placeholder="Select source language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="text-lg py-3">
                        <div className="flex items-center gap-3">
                          {lang.name}
                          {lang.enhanced && (
                            <Badge className="bg-purple-500 text-white text-xs border-0">Enhanced</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="target-lang" className="text-lg font-medium">
                  To
                </Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger
                    id="target-lang"
                    className="h-14 text-lg border-0 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg"
                  >
                    <SelectValue placeholder="Select target language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages
                      .filter((lang) => lang.code !== "auto")
                      .map((lang) => (
                        <SelectItem key={lang.code} value={lang.code} className="text-lg py-3">
                          <div className="flex items-center gap-3">
                            {lang.name}
                            {lang.enhanced && (
                              <Badge className="bg-purple-500 text-white text-xs border-0">Enhanced</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modern Translation Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Original Poem
              </CardTitle>
              <CardDescription className="text-lg">
                Enter your poem in{" "}
                {sourceLanguage === "auto" ? "any language" : languages.find((l) => l.code === sourceLanguage)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="✨ Enter your poem here...

Malayalam example:
വാനിലെ താരകങ്ങൾ
പ്രകാശം വിതറുന്നു
രാത്രിയുടെ മൗനത്തിൽ
സ്വപ്നങ്ങൾ പൂക്കുന്നു

English example:
Stars in the sky
Scatter their light
In the silence of night
Dreams bloom bright"
                value={originalPoem}
                onChange={(e) => setOriginalPoem(e.target.value)}
                className="min-h-[350px] resize-none text-lg border-0 bg-gradient-to-br from-gray-50 to-white shadow-inner rounded-2xl p-6"
                style={{ fontFamily: sourceLanguage === "ml" ? "Malayalam, monospace" : "monospace" }}
              />
              <div className="flex gap-4">
                <Button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                >
                  {isTranslating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Translating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Translate Poem
                    </div>
                  )}
                </Button>
                {originalPoem && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(originalPoem)}
                    className="h-14 w-14 border-0 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                Translated Poem
                {translationQuality === "high" && (
                  <Badge className="bg-blue-500 text-white border-0 shadow-lg">
                    <Zap className="h-3 w-3 mr-1" />
                    High Quality
                  </Badge>
                )}
                {translationQuality === "medium" && (
                  <Badge className="bg-green-500 text-white border-0 shadow-lg">
                    <Heart className="h-3 w-3 mr-1" />
                    Enhanced
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-lg">
                Your poem in {languages.find((l) => l.code === targetLanguage)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="🌟 Your translated poem will appear here..."
                value={translatedPoem}
                readOnly
                className="min-h-[350px] resize-none text-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner rounded-2xl p-6"
                style={{ fontFamily: targetLanguage === "ml" ? "Malayalam, monospace" : "monospace" }}
              />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="flex-1 h-14 text-lg border-0 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                >
                  Clear All
                </Button>
                {translatedPoem && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(translatedPoem)}
                    className="h-14 w-14 border-0 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Features Grid */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">Why Choose Our Translator?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-blue-500 rounded-2xl w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-blue-900">ML→EN Improved</h3>
                <p className="text-blue-700">Enhanced Malayalam to English accuracy with context awareness</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-green-500 rounded-2xl w-fit mx-auto mb-4">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-green-900">Smart Processing</h3>
                <p className="text-green-700">AI-powered word mapping and cultural context preservation</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-purple-500 rounded-2xl w-fit mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-purple-900">Multiple Approaches</h3>
                <p className="text-purple-700">Uses best available translation from multiple sources</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-orange-500 rounded-2xl w-fit mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-orange-900">Quality Indicators</h3>
                <p className="text-orange-700">Real-time quality assessment and enhancement badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
