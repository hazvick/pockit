import React, { useEffect, useRef, useState } from "react"
import { getAIResponse } from "../api/chat"
import { motion, AnimatePresence } from "framer-motion"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("pockit-chat")
    return stored ? JSON.parse(stored) : []
  })
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef()

  useEffect(() => {
    localStorage.setItem("pockit-chat", JSON.stringify(messages))
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { sender: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const reply = await getAIResponse(input)
      const botMsg = { sender: "bot", text: reply || "🤖 Oklart svar" }
      playDing()
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Kunde inte svara just nu." }])
    } finally {
      setIsTyping(false)
    }
  }

  const playDing = () => {
    const audio = new Audio("/ding.mp3")
    audio.play()
  }

  return (
    <>
      <div className="fixed bottom-20 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="chat-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="bg-[#1F96C1] hover:bg-[#1F96C1] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg relative"
            >
              💬
              {messages.some((m, i) => i === messages.length - 1 && m.sender === "bot") && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-400 rounded-full" />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-80 h-[450px] bg-white rounded-xl shadow-xl flex flex-col border"
            >
              <div className="bg-[#1F96C1] text-white p-3 rounded-t-xl flex justify-between items-center">
                <span className="font-semibold">Pockit 🤖</span>
                <button onClick={() => setIsOpen(false)} className="text-white text-sm">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <span
                      className={`px-3 py-2 rounded-xl max-w-[70%] ${
                        msg.sender === "user"
                          ? "bg-[#1F96C1] text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="text-gray-500 italic text-xs pl-1">Pockit skriver...</div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-2 border-t flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  className="flex-1 border rounded px-3 py-1 text-sm"
                  placeholder="Skriv nåt..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#1F96C1] text-white px-3 rounded text-sm"
                >
                  Skicka
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
