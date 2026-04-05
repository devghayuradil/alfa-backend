import openai from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatbotController = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful e-commerce assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.status(200).send({
      success: true,
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error chatbot:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the chatbot request.",
      error,
    });
  }
};

export { chatbotController };
