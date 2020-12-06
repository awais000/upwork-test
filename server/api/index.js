import express from 'express';
import authentication from './authentication';
import tryangle from './tryangle';

const router = express.Router();

router.use('/users', authentication);
router.use('/tryangle', tryangle);

export default router;
