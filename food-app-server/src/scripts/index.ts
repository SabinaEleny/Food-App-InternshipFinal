import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { pipeline } from '@xenova/transformers';

const KNOWLEDGE_DIR = path.resolve(process.cwd(), 'knowledge');
const FAISS_DIR = path.resolve(process.cwd(), 'aichat_db');
const EMB_MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

const embeddings = (() => {
  let extractor: any;
  return {
    embedDocuments: async (texts: string[]): Promise<number[][]> => {
      if (!extractor) extractor = await pipeline('feature-extraction', EMB_MODEL);
      const out: number[][] = [];
      for (const t of texts) {
        const r = await extractor(t, { pooling: 'mean', normalize: true });
        out.push(Array.from(r.data as Float32Array));
      }
      return out;
    },
    embedQuery: async (t: string): Promise<number[]> => (await embeddings.embedDocuments([t]))[0],
  };
})();

async function run() {
  console.log(`Searching for PDFs in: ${KNOWLEDGE_DIR}`);
  const pdfs = (await fs.readdir(KNOWLEDGE_DIR).catch(() => [])).filter((f) =>
    f.toLowerCase().endsWith('.pdf'),
  );

  if (!pdfs.length) {
    console.log(`Warning: No PDF files found. Nothing to index.`);
    process.exit(1);
  }
  console.log('Found PDFs:', pdfs.join(', '));

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });
  const allDocs = [];

  for (const pdfFile of pdfs) {
    const pdfPath = path.join(KNOWLEDGE_DIR, pdfFile);
    const docs = await new PDFLoader(pdfPath).load();
    const split = await splitter.splitDocuments(
      docs.map((d) => ({ ...d, metadata: { ...d.metadata, source: pdfFile } })),
    );
    allDocs.push(...split);
  }
  console.log(`Total chunks to be indexed: ${allDocs.length}`);

  console.log(`Creating FAISS index...`);
  const store = await FaissStore.fromDocuments(allDocs, embeddings);
  await store.save(FAISS_DIR);
  console.log(`FAISS index saved successfully to ${FAISS_DIR}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
