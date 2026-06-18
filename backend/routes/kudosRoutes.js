import express from 'express';
import {
  sendKudos,
  getReceivedKudos,
  getSentKudos,
  getKudosFeed,
  likeKudos,
  deleteKudos,
  getKudosStats
} from '../controllers/kudosController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', auth, sendKudos);
router.get('/received', auth, getReceivedKudos);
router.get('/sent', auth, getSentKudos);
router.get('/feed', getKudosFeed);
router.post('/:id/like', auth, likeKudos);
router.delete('/:id', auth, deleteKudos);
router.get('/stats/:id', getKudosStats);

export default router;
