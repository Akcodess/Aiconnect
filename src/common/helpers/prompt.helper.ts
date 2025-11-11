export class PromptHelper {
  static BuildAutoDispositionPrompt(conversation: string, listDisposition: string[]): string {
    return `
You are an AI assistant. Classify the conversation below into one of the following categories: ${listDisposition}.

Conversation:
${conversation}

Respond with only one category name from the list above, without explanation.`;
  }

  static BuildSentimentPrompt(message?: string): string {
    return `You are a sentiment analysis assistant.

Evaluate the sentiment of the following message and return **only** a sentiment score between -1.0 and 1.0

Do not include any explanation, label, or additional text. Only return the numeric score.

Message:
${message}`;
  }

  static BuildSentanceSentimentPrompt(message?: string): string {
    return `You are a sentiment analysis assistant.

Split the following message into individual sentences. For each sentence, evaluate its sentiment and return a JSON object where:

- The key is the sentence number (starting from 1).
- The value is an object containing:
  - "Category": the sentiment category as one of "Strongly Negative", "Slightly Negative", "Neutral", "Slightly Positive", or "Strongly Positive"
  - "Score": a numeric value between -1.0 and 1.0 indicating the sentiment score

Strict formatting requirements:
- Return ONLY a valid JSON object that can be parsed by a strict JSON parser.
- Do NOT include any explanation, commentary, labels, or additional text such as markdown code fences (e.g., \`\`\`json) or backticks.
- Do NOT wrap the output in markdown.
- Do NOT include trailing commas or comments.
- If the message is empty or contains no valid sentences, return {}.

Message:
${message}`;
  }

  static BuildSentimentTextChatPrompt(message?: string): string {
    return `You are a sentiment analysis assistant.

You will be given a JSON object. Each key dynamically represents a user or speaker identifier (e.g., "user1", "customer", "agent", etc.). The value for each key is a string containing that user's message(s), which may include multiple sentences.

Your task is to:
1. Analyze the entire message for each speaker and return an overall sentiment category and score.
2. Split the message into individual sentences and return sentiment for each.
3. Return a JSON object where each key corresponds to the speaker and contains:
   - "OverallCategory": one of ["Strongly Negative", "Slightly Negative", "Neutral", "Slightly Positive", "Strongly Positive"]
   - "OverallScore": a number between -1.0 and 1.0
   - "SentenceScore": an object where:
     - Each key is the sentence number (starting from 1)
     - Each value includes:
       - "Category": one of the categories listed above
       - "Score": a number between -1.0 and 1.0

Important: Return **only** the valid JSON object. Do not include any explanation, commentary, or notes such as markdown code fences (e.g., \`\`\`json) or backticks.

Input:${JSON.stringify(message)}`;
  }

  static BuildTranslationPrompt(message: string, to: string, from?: string): string {
    if (!from || from.trim() === '') {
      return `Detect the language of the following text, then translate it into ${to}. Only return the translated text:\n\n${message}`;
    }

    return `Translate the following text from ${from} to ${to}. Only return the translated text:\n\n${message}`;
  }

  static BuildInsightPrompt(message: any, AllowedInsights: string[], DispositionList: string[], QuestionAnswer: { question: string; answers: string[] }[] = []): string {

    const buildRatingInsight = () => {
      if (!QuestionAnswer?.length) {
        return `"Rating": "Number between 1 and 5 representing the overall tone or experience."`;
      }

      const qaFormatted = QuestionAnswer?.map(
        (qa, i) => `    "${qa.question}": "Answer based on conversation context. Choose one best answer from not more than one: ${qa.answers.join(' | ')}"`
      ).join(',\n');

      return `"Rating": {
      "Customer": [
        // For every Message item where role = "customer":
        //   - Preserve the exact dynamic key (e.g., customer, customer1, customerA)
        //   - Output one object per speakerKey: {"<speakerKey>": { "<QA question>": "<one choice>", ... } }
        //   - Do NOT skip, merge, or rename keys
        { "<customerSpeakerKey>": {
${qaFormatted}
        } }
      ],
      "Agent": [
        // For every Message item where role = "agent":
        //   - Preserve the exact dynamic key (e.g., agent, agent1, support1, fieldTech1)
        //   - Output one object per speakerKey: {"<speakerKey>": { "<QA question>": "<one choice>", ... } }
        //   - Do NOT skip, merge, or rename keys
        { "<agentSpeakerKey>": {
${qaFormatted}
        } }
      ]
    }`;
    };

    const insightsMap: Record<string, string> = {
      Summary: `"Summary": "A short paragraph summarizing the overall message."`,
      KeywordCount: `"KeywordCount": {
      "<keyword1>": <count>,
      "<keyword2>": <count>,
      ...
    }`,
      Takeaway: `"Takeaway": {
      "Customer": [
        // For every entry in Message where role = "customer":
        //   Extract the dynamic key (e.g., customer, customer1, customer2...)
        //   Output one object: {"<speakerKey>": "takeaway for this speaker"}
        //   Do not skip, merge, or rename any keys
      ],
      "Agent": [
        // For every entry in Message where role = "agent":
        //   Extract the dynamic key (e.g., agent, agent1, support1, supervisor1...)
        //   Output one object: {"<speakerKey>": "takeaway for this speaker"}
        //   Do not skip, merge, or rename any keys
      ]
    }`,
      NextAction: `"NextAction": "A recommended action or response that should follow this message."`,
      Rating: `${buildRatingInsight()}`,
      Sentiment: `"Sentiment": {
      "OverallCategory": "one of:Strongly Negative | Slightly Negative | Neutral | Slightly Positive | Strongly Positive,
      "OverallScore": "number between -1.0 and 1.0"
    }`,
      Disposition: `"Disposition": "One of: ${DispositionList.join(' | ')}"`,
    };

    const selectedInsights = (AllowedInsights?.length ? AllowedInsights : Object.keys(insightsMap))
      .map(key => insightsMap[key])
      .filter(Boolean);

    return `You are an AI assistant specialized in conversation analysis and insight extraction.

Analyze the following message or conversation carefully. Extract high-level insights that would help a business better understand customer intent, mood, and next steps.

Respond strictly in the following JSON format:
{
  ${selectedInsights.join(",\n  ")}
}

IMPORTANT: Return ONLY the JSON. Do not add commentary or explanation outside the JSON or notes such as markdown code fences (e.g., \`\`\`json) or backticks. Output must parse correctly in strict JSON parsers.

Message:
${message}`;
  }

  static BuildNumaricToWords(message: string): string {
    return `Convert the following text into natural spoken form for voice synthesis. Replace dates, times, numbers with their word equivalents:\n\n"${message}"\n\nReturn only the converted text.`;
  }

  static BuildTextToLanguageTranslate(message: string, languageCode: string): string {
    return `Translate the following text to the language represented by the code '${languageCode}'. 
Return only the translated sentence, no additional explanation or formatting.
Note: If the language code represents a regional variant like 'en-IN', keep the text as same.
Text: "${message}"`;
  }
}
