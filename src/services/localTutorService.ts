/**
 * Local implementation of the tutor service without using any external APIs.
 */

export async function getFeedback(word: string, question: string, answer: string) {
  // Simulate a slight delay for a more natural feel
  await new Promise(resolve => setTimeout(resolve, 600));

  const lowerAnswer = answer.toLowerCase();
  const lowerWord = word.toLowerCase();

  if (answer.trim() === '') {
    return `Don't be shy! Try writing a sentence using the word "${word}".`;
  }

  if (lowerAnswer.includes(lowerWord)) {
    return `✨ Excellent! You used the word "${word}" beautifully. 10 points to your house!`;
  } else {
    return `Good try! But I didn't see the word "${word}" in your spell. Can you try casting it again using the exact word?`;
  }
}

/**
 * Uses the Web Speech API for reliable, instant text-to-speech.
 * This is a built-in browser feature and works completely offline without API calls.
 */
export function speakText(text: string) {
  if (!('speechSynthesis' in window)) {
    console.error("Speech synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech to prevent overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  
  // Adjust rate for better clarity in learning
  // Syllables/short sounds should be slower
  utterance.rate = text.length <= 3 ? 0.6 : 0.85;
  utterance.pitch = 1.1; // Slightly higher pitch for a "magical" feel

  // Try to find a high-quality English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || 
                        voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) ||
                        voices.find(v => v.lang.startsWith('en'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Pre-load voices (some browsers need this)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}
