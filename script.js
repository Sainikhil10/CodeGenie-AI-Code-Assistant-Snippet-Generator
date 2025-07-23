const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const languageSelect = document.getElementById('language-select');
const resultSection = document.getElementById('result-section');
const codeOutput = document.getElementById('code-output');
const errorSection = document.getElementById('error-section');
const copyBtn = document.getElementById('copy-btn');

// Replace 'YOUR_OPENAI_API_KEY' with your real OpenAI API key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  const language = languageSelect.value;

  if (!prompt) {
    alert('Please enter a description for the code snippet.');
    return;
  }

  resultSection.style.display = 'none';
  errorSection.style.display = 'none';
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates code snippets.' },
          { role: 'user', content: `Write a ${language} code snippet for: ${prompt}` }
        ],
        max_tokens: 300,
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (response.ok && data.choices && data.choices.length > 0) {
      const generatedCode = data.choices[0].message.content.trim();
      codeOutput.textContent = generatedCode;
      resultSection.style.display = 'block';
    } else {
      throw new Error(data.error?.message || 'Failed to generate code.');
    }
  } catch (error) {
    errorSection.textContent = error.message;
    errorSection.style.display = 'block';
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Code';
  }
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(codeOutput.textContent)
    .then(() => alert('Copied to clipboard!'))
    .catch(() => alert('Failed to copy.'));
});
