import { Response, Router } from 'express';
import { ChatService } from '../services/chat.service';
import { AuthRequest, protect } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { postMessageSchema } from '../schemas/chat.schema';

export class ChatRouter {
  private service: ChatService;

  constructor(apiRouter: Router) {
    this.service = new ChatService();
    this.initializeRoutes(apiRouter);
  }

  private initializeRoutes(apiRouter: Router): void {
    const chatRouter = Router();
    chatRouter.use(protect());

    chatRouter.get('/conversations', this.getConversations.bind(this));
    chatRouter.get('/conversations/:id', this.getMessages.bind(this));
    chatRouter.post('/', validate(postMessageSchema), this.postMessage.bind(this));

    apiRouter.use('/chat', chatRouter);
  }

  public async getConversations(req: AuthRequest, res: Response): Promise<void> {
    const conversations = await this.service.getConversations(req.user!._id);
    res.status(200).json(conversations);
  }

  public async getMessages(req: AuthRequest, res: Response): Promise<void> {
    const result = await this.service.getMessages(req.user!._id, req.params.id);
    if ('error' in result) {
      res.status(404).json({ message: result.error });
      return;
    }
    res.status(200).json(result);
  }

  public async postMessage(req: AuthRequest, res: Response): Promise<void> {
    const { message, conversationId } = req.body;
    const result = await this.service.processMessage(req.user!, message, conversationId);
    res.status(200).json(result);
  }
}
