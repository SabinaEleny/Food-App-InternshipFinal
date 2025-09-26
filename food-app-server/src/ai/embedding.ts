import { pipeline } from '@xenova/transformers';

const EMB_MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

let extractor: any;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', EMB_MODEL);
  }
  return extractor;
}

export const embeddings = {
  embedDocuments: async (texts: string[]): Promise<number[][]> => {
    const extractorInstance = await getExtractor();
    const out: number[][] = [];
    for (const text of texts) {
      const result = await extractorInstance(text, { pooling: 'mean', normalize: true });
      out.push(Array.from(result.data as Float32Array));
    }
    return out;
  },
  embedQuery: async (text: string): Promise<number[]> => {
    const result = await await embeddings.embedDocuments([text]);
    return result[0];
  },
};