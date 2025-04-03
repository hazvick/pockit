import dotenv from "dotenv"
dotenv.config()

export async function handler(event) {
  const { message } = event.queryStringParameters;
  const apiKey = process.env.OPENROUTER_API_KEY;
  const referer = process.env.SITE_URL || "https://dindoman.se";
  const title = process.env.SITE_TITLE || "Pockit";

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ingen API-nyckel hittades." }),
    }
  }

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing message" }),
    }
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": referer,
        "X-Title": title,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-exp-03-25:free",
        messages: [
          {
            role: "system",
            content: `
            Du är en digital vän som heter Pockit. Du pratar svenska med lite slang/ghetto och svarar som en kompis – avslappnat, vänskapligt och ibland med lite cool slang. Inget stelt, inget barnsligt. 
            Du gillar att hålla svaren korta, tydliga och konkreta – inga onödiga utläggningar.
            Använd emoji på ett naturligt sätt (ibland, inte överdrivet).
            Om användaren ber dig göra något du inte kan, säg vänligt att du inte kan utföra tasks, exempelvis: "kan tyvärr inte fixa det där just nu 🫤, men fråga mig nåt annat istället?".
            Du ska vara som en "pocket mate" som alltid finns där – chill, hjälpsam och pålitlig.
            `
          },          
          {
            role: "user",
            content: message
          }
        ]
      })
    })

    const data = await response.json()
    console.log("📦 API-svar:", JSON.stringify(data, null, 2))

    const botMessage = data?.choices?.[0]?.message?.content || "Oj, jag kunde inte svara på det där 🤔"

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: botMessage })
    }

  } catch (err) {
    console.error("Fel i OpenRouter:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "OpenRouter-svar misslyckades",
        details: err.message
      }),
    }
  }
}
