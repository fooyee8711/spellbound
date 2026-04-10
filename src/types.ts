export interface PhonicsBlock {
  text: string;
  color: 'black' | 'red' | 'blue';
  description: string;
  sound: string;
}

export interface NeighborWord {
  word: string;
  translation: string;
  example: string;
}

export interface Word {
  id: string;
  target: string;
  translation: string;
  originalSentence: string;
  sceneDescription: string;
  phonicsBlocks?: PhonicsBlock[];
  question?: string;
  neighbors?: NeighborWord[]; // 3 neighbor words with details
}
