"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const text_splitter_1 = require("langchain/text_splitter");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const transformers_1 = require("@xenova/transformers");
const KNOWLEDGE_DIR = node_path_1.default.resolve(process.cwd(), 'knowledge');
const FAISS_DIR = node_path_1.default.resolve(process.cwd(), 'aichat_db');
const EMB_MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
const embeddings = (() => {
    let extractor;
    return {
        embedDocuments: async (texts) => {
            if (!extractor)
                extractor = await (0, transformers_1.pipeline)('feature-extraction', EMB_MODEL);
            const out = [];
            for (const t of texts) {
                const r = await extractor(t, { pooling: 'mean', normalize: true });
                out.push(Array.from(r.data));
            }
            return out;
        },
        embedQuery: async (t) => (await embeddings.embedDocuments([t]))[0],
    };
})();
async function run() {
    console.log(`Searching for PDFs in: ${KNOWLEDGE_DIR}`);
    const pdfs = (await promises_1.default.readdir(KNOWLEDGE_DIR).catch(() => [])).filter((f) => f.toLowerCase().endsWith('.pdf'));
    if (!pdfs.length) {
        console.log(`Warning: No PDF files found. Nothing to index.`);
        process.exit(1);
    }
    console.log('Found PDFs:', pdfs.join(', '));
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });
    const allDocs = [];
    for (const pdfFile of pdfs) {
        const pdfPath = node_path_1.default.join(KNOWLEDGE_DIR, pdfFile);
        const docs = await new pdf_1.PDFLoader(pdfPath).load();
        const split = await splitter.splitDocuments(docs.map((d) => ({ ...d, metadata: { ...d.metadata, source: pdfFile } })));
        allDocs.push(...split);
    }
    console.log(`Total chunks to be indexed: ${allDocs.length}`);
    console.log(`Creating FAISS index...`);
    const store = await faiss_1.FaissStore.fromDocuments(allDocs, embeddings);
    await store.save(FAISS_DIR);
    console.log(`FAISS index saved successfully to ${FAISS_DIR}`);
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
