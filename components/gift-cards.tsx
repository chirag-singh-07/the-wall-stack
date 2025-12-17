"use client"

import { useState, useEffect, useRef } from "react"
import { Gift, Sparkles, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const giftAmounts = [25, 50, 75, 100, 150, 200]

const giftDesigns = [
  { id: 1, name: "Classic Black", bg: "bg-foreground", text: "text-background" },
  { id: 2, name: "Pure White", bg: "bg-background border-2 border-foreground", text: "text-foreground" },
  { id: 3, name: "Gradient", bg: "bg-gradient-to-br from-foreground to-foreground/70", text: "text-background" },
]

export function GiftCards() {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedDesign, setSelectedDesign] = useState(giftDesigns[0])
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const finalAmount = customAmount ? Number.parseInt(customAmount) : selectedAmount

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full mb-6">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-medium">Perfect for Art Lovers</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Gift Cards</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Give the gift of choice. Let them pick their perfect poster.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Gift Card Preview */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative perspective-[1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div
                className={`relative transition-transform duration-700 preserve-3d ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front */}
                <div
                  className={`aspect-[1.6/1] rounded-2xl p-8 ${selectedDesign.bg} ${selectedDesign.text} shadow-2xl backface-hidden`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <Sparkles className="w-8 h-8 mb-2" />
                        <h3 className="text-xl font-bold">NOIR PRINTS</h3>
                        <p className="text-sm opacity-70">Gift Card</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold">${finalAmount}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs opacity-50">Click to flip</p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 border border-current/20 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border border-current/20 rounded-full" />
                </div>

                {/* Back */}
                <div
                  className={`absolute inset-0 aspect-[1.6/1] rounded-2xl p-8 ${selectedDesign.bg} ${selectedDesign.text} shadow-2xl [transform:rotateY(180deg)] backface-hidden`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <p className="text-sm opacity-70 mb-2">Personal Message</p>
                      <p className="italic">{message || "Your message will appear here..."}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-8 h-1 bg-current/30 rounded" />
                        ))}
                      </div>
                      <p className="text-xs opacity-50">Valid for 12 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">Click card to flip and see your message</p>
          </div>

          {/* Gift Card Options */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            {/* Amount Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Select Amount</label>
              <div className="grid grid-cols-3 gap-3">
                {giftAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount("")
                    }}
                    className={`py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedAmount === amount && !customAmount
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:border-foreground outline-none transition-colors"
                />
              </div>
            </div>

            {/* Design Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Card Design</label>
              <div className="flex gap-4">
                {giftDesigns.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design)}
                    className={`relative flex-1 aspect-[1.6/1] rounded-lg ${design.bg} transition-all ${
                      selectedDesign.id === design.id
                        ? "ring-2 ring-foreground ring-offset-2 scale-105"
                        : "hover:scale-105"
                    }`}
                  >
                    {selectedDesign.id === design.id && (
                      <div className="absolute top-2 right-2">
                        <Check className={`w-4 h-4 ${design.text}`} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Recipient Email</label>
              <input
                type="email"
                placeholder="friend@email.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-lg focus:border-foreground outline-none transition-colors"
              />
            </div>

            {/* Personal Message */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Personal Message (Optional)</label>
              <textarea
                placeholder="Add a personal touch..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 rounded-lg focus:border-foreground outline-none transition-colors resize-none"
              />
            </div>

            {/* Purchase Button */}
            <Button className="w-full py-6 text-lg group">
              <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Send Gift Card - ${finalAmount}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
