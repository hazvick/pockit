import axios from "axios"

export const getAIResponse = async (msg) => {
  const res = await axios.get("/.netlify/functions/chatbot", {
    params: { message: msg }
  })

  console.log("Riktigt API-svar:", res.data)
  return res.data.message
}
