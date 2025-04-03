import React, { useState } from 'react'
import { getAIResponse } from '../api/chat'

export default function ChatBot() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    if (!input) return
    const userMsg = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
  
    try {
      const botReply = await getAIResponse(input)
      const botMsg = botReply || "Jag förstod inte riktigt 😅"
      setMessages((prev) => [...prev, { sender: "bot", text: botMsg }])
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Fel uppstod 😢" }])
    }
  }  

  return (
    <div className="p-4 border rounded shadow bg-white max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Chatta med Pockit 🤖</h2>
      <div className="space-y-2 h-64 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-1 rounded ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Säg något..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">
          Skicka
        </button>
      </div>
    </div>
  )
}
