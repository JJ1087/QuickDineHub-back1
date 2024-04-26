import { Router } from "express";
import { getData } from "../controllers/pago.controller";
const router = Router();

router.post('/pago',getData)

export default router; 