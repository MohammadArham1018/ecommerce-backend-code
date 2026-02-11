export async function getAIRecommendation(req, res, userPrompt, products) {
  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) {
    return { success: false, message: "Groq API key missing" };
  }

  try {
    const prompt = `
Here is a list of available products:
${JSON.stringify(products, null, 2)}
Based on the following user request, filter and suggest the best matching products:
"${userPrompt}"
Return ONLY a JSON array.
The response MUST start with '[' and end with ']'.
Do not include any text before or after the JSON.

`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        }),
      }
    );

    const data = await response.json();
    

    // ✅ GROQ-COMPATIBLE EXTRACTION
    const aiResponseText =
      data?.choices?.[0]?.message?.content?.trim() || "";

    const cleanedText = aiResponseText
      .replace(/```json|```/gi, "")
      .trim();

    if (!cleanedText) {
    //   return { success: false, message: "AI response empty or invalid" };
       return res
        .status(500)
        .json({ success: false, message: "AI response is empty or invalid." });
    }

    let parsedProducts;
    try {
      parsedProducts = JSON.parse(cleanedText);
    } catch (err) {
    //   return { success: false, message: "Failed to parse AI response" };
    return res
        .status(500)
        .json({ success: false, message: "Failed to parse AI response" });
    }

    return { success: true, products: parsedProducts };

  } catch (error) {
    // return { success: false, message: "Internal server error." };

     res.status(500).json({ success: false, message: "Internal server error." });
  }
}





