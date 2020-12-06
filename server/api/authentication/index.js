import express from 'express';
import { signup, signin, refreshUser } from './controller';
import { authentication } from '../../middlewares';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/refresh', authentication, refreshUser);

export default router;
