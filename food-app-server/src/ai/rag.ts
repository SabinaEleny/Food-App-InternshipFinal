import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { pipeline } from '@xenova/transformers';
import path from 'path';
import { Document } from 'langchain/document';

const FAISS_DIR = path.resolve(process.cwd(), 'aichat_db');
const EMB_MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

const CANDIDATE_K = 10;
const TOP_K = 5;
const MAX_DISTANCE = 1.2;

let store: FaissStore | null = null;
let extractor: any;

const embeddings = {
  embedDocuments: async (texts: string[]): Promise<number[][]> => {
    if (!extractor) {
      extractor = await pipeline('feature-extraction', EMB_MODEL);
    }
    const out: number[][] = [];
    for (const text of texts) {
      const result = await extractor(text, { pooling: 'mean', normalize: true });
      out.push(Array.from(result.data as Float32Array));
    }
    return out;
  },
  embedQuery: async (text: string): Promise<number[]> => {
    const result = await embeddings.embedDocuments([text]);
    return result[0];
  },
};

export async function getContext(question: string): Promise<{ context: string; used: string[] }> {
  if (!store) {
    try {
      store = await FaissStore.load(FAISS_DIR, embeddings);
    } catch (e) {
      console.error(
        `[AI-RAG] Could not load FAISS store from ${FAISS_DIR}. Run the indexing script first.`,
      );
      return { context: '', used: [] };
    }
  }

  const queryVector = await embeddings.embedQuery(question);

  const results = await store.similaritySearchVectorWithScore(queryVector, CANDIDATE_K);

  if (!results.length) {
    return { context: '', used: [] };
  }

  const confidentCandidates = results.filter(
    ([, score]: [Document, number]) => score <= MAX_DISTANCE,
  );

  if (confidentCandidates.length === 0) {
    return { context: '', used: [] };
  }

  const picked: [Document, number][] = confidentCandidates.slice(0, TOP_K);

  const bullets = picked
    .map(
      ([doc, score]: [Document, number]) =>
        `[INFO] (relevance: ${score.toFixed(3)}): ${doc.pageContent}`,
    )
    .join('\n\n');

  return {
    context: `--- CONTEXT FROM DOCUMENTS ---\n${bullets}\n--- END CONTEXT ---`,
    used: picked.map(([doc]: [Document, number]) => doc.pageContent),
  };
}
