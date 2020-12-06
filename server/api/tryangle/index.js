import express from 'express';
import { authentication } from '../../middlewares';
import {
	acceptInvite,
	checkoutTryangle,
	createTryangle,
	getTryangle,
	getTryangleBalance,
	getTryangles,
	sendInvite,
} from './controller';

const router = express.Router();

router.get('/', authentication, getTryangles);
router.get('/:id', authentication, getTryangle);
router.post('/', authentication, createTryangle);
router.get('/balance/:id', authentication, getTryangleBalance);
router.post('/checkout', authentication, checkoutTryangle);
router.post('/invite/send', authentication, sendInvite);
router.post('/invite/accept', authentication, acceptInvite);

export default router;
