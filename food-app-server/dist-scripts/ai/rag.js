"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = getContext;
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const transformers_1 = require("@xenova/transformers");
const path_1 = __importDefault(require("path"));
const FAISS_DIR = path_1.default.resolve(process.cwd(), 'aichat_db');
const EMB_MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
const CANDIDATE_K = 10;
const TOP_K = 5;
const MAX_DISTANCE = 1.2;
let store = null;
let extractor;
const embeddings = {
    embedDocuments: async (texts) => {
        if (!extractor) {
            extractor = await (0, transformers_1.pipeline)('feature-extraction', EMB_MODEL);
        }
        const out = [];
        for (const text of texts) {
            const result = await extractor(text, { pooling: 'mean', normalize: true });
            out.push(Array.from(result.data));
        }
        return out;
    },
    embedQuery: async (text) => {
        const result = await embeddings.embedDocuments([text]);
        return result[0];
    },
};
async function getContext(question) {
    if (!store) {
        try {
            store = await faiss_1.FaissStore.load(FAISS_DIR, embeddings);
        }
        catch (e) {
            console.error(`[AI-RAG] Could not load FAISS store from ${FAISS_DIR}. Run the indexing script first.`);
            return { context: '', used: [] };
        }
    }
    const queryVector = await embeddings.embedQuery(question);
    const results = await store.similaritySearchVectorWithScore(queryVector, CANDIDATE_K);
    if (!results.length) {
        return { context: '', used: [] };
    }
    const confidentCandidates = results.filter(([, score]) => score <= MAX_DISTANCE);
    if (confidentCandidates.length === 0) {
        return { context: '', used: [] };
    }
    const picked = confidentCandidates.slice(0, TOP_K);
    const bullets = picked
        .map(([doc, score]) => `[INFO] (relevance: ${score.toFixed(3)}): ${doc.pageContent}`)
        .join('\n\n');
    return {
        context: `--- CONTEXT FROM DOCUMENTS ---\n${bullets}\n--- END CONTEXT ---`,
        used: picked.map(([doc]) => doc.pageContent),
    };
}
