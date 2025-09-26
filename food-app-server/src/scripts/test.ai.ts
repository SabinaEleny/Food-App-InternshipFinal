import 'dotenv/config';
import mongoose from 'mongoose';
import { ChatService } from '../services/chat.service';
import { UserDocument } from '../models/user.model';

async function runTest() {
  console.log('--- STARTING BACKEND AI TEST ---');
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env file');
  }
  console.log('⏳ Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Database connected successfully.');

  try {
    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test User',
      email: 'test@example.com',
    } as UserDocument;

    const chatService = new ChatService();

    const questions = [
      'what should I do if an item is missing from my order?',
      'what is the best pizza topping?',
      "I'm very angry, I received a pizza instead of the sushi I ordered! This is completely wrong.",
    ];

    for (const question of questions) {
      console.log(`\n==================================================`);
      console.log(`> USER ASKS: "${question}"`);
      console.log(`==================================================`);
      console.log(`⏳ Getting AI response...`);

      const result = await chatService.processMessage(mockUser, question);

      console.log(`\n💬 AI RESPONSE:`);
      console.log(result.reply);
      console.log(`--------------------------------------------------`);
    }
  } catch (error) {
    console.error('An error occurred during the test execution:', error);
  } finally {
    console.log('\n⏳ Disconnecting from database...');
    await mongoose.disconnect();
    console.log('✅ Database disconnected.');
  }

  console.log('\n--- AI TEST FINISHED ---');
  process.exit(0);
}

runTest().catch((error) => {
  console.error('A critical error occurred:', error);
  process.exit(1);
});
