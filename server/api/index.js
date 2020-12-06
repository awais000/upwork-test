import express from 'express';
import authentication from './authentication';
import tryangle from './tryangle';

const router = express.Router();

router.use('/check-health',(req, res) => res.send("OK"))
router.use('/users', authentication);
router.use('/tryangle', tryangle);

export default router;
