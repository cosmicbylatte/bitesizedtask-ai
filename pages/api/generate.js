import Replicate from "replicate";

export default async function handler(req, res) {
  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Initialize the Replicate client with the API token from environment variables
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { task, output, framework, technique } = req.body;

    // Construct the detailed prompt for the AI model
    const prompt = `
      You are an expert project manager AI. Create a detailed, actionable plan.
      
      Task: ${task}
      Final Output: ${output}
      Framework: ${framework}
      Technique: ${technique}

      Break down the task into small, manageable steps, then organize them into a plan using the chosen framework and technique. The output must be in clear Markdown format.
    `;

    // Run the AI model on Replicate
    const modelOutput = await replicate.run(
      "ibm/granite-13b-instruct-v2",
      {
        input: {
          prompt: prompt,
          prompt_template: "<|user|>\n{prompt}\n<|assistant|>\n",
          max_new_tokens: 2048,
        }
      }
    );
    
    // Join the array of strings from the model output into a single text block
    const resultText = modelOutput.join("");

    // Send the successful response back to the frontend
    res.status(200).json({ result: resultText });

  } catch (error) {
    // Handle any errors during the API call
    console.error("Error calling Replicate API:", error);
    res.status(500).json({ error: 'Failed to generate plan. Please check the server logs.' });
  }
}

