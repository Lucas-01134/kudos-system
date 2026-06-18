import express from 'express';
import {
  sendKudos,
  getReceivedKudos,
  getSentKudos,
  getKudosFeed,
  likeKudos,
  deleteKudos,
  getKudosStats,
  setKudosVisibility
} from '../controllers/kudosController.js';
import { auth, optional, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', auth, sendKudos);
router.get('/received', auth, getReceivedKudos);
router.get('/sent', auth, getSentKudos);
router.get('/feed', optional, getKudosFeed);
router.post('/:id/like', auth, likeKudos);
router.patch('/:id/visibility', auth, admin, setKudosVisibility);
router.delete('/:id', auth, deleteKudos);
router.get('/stats/:id', getKudosStats);

export default router;
