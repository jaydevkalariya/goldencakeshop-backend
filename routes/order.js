import express from "express";
import  {payment,getAllOrders,confirmOrder} from "../controllers/order.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post('/process-payment',isAuthenticated,payment);
router.get('/allOrders',getAllOrders);
router.post('/confirmOrder',confirmOrder);

export default router;