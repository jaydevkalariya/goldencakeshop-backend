import express from "express";
import  {payment,getAllOrders,confirmOrder,getOrdersByUserEmail} from "../controllers/order.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { generateOrderPDFs } from "../controllers/orderPdfGenerator.js";
const router = express.Router();

router.post('/process-payment',isAuthenticated,payment);
router.get('/allOrders',getAllOrders);
router.post('/viewOrders',getOrdersByUserEmail);
router.post('/confirmOrder',confirmOrder);
router.get('/generatepdf',generateOrderPDFs);


export default router;