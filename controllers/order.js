import { Stripe } from 'stripe';
import { Order } from '../models/order.js';
import {sendMail} from './mail.js';

export const payment=(async (req, res, next) => {
  console.log("hi")
  const stripee = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { paymentMethodId, address,time, amount,order } = req.body;
    
      const paymentIntent = await stripee.paymentIntents.create({
        payment_method: paymentMethodId,
        description: "for cakeshop project",
        amount,
        currency: 'USD',
        shipping: {
            name: "jk",
            address: {
              line1: address,
              postal_code: "363641",
              city: "morbi",
              state: "gujarat",
              country: "US",
            },
          },
        confirm: true,
      });
      
      // Store the order in the database
      const orderr = new Order({
        user: req.user, 
        paymentMethodId,
        address,
        time,
        amount,
        order, 
      });
      
      await orderr.save();

       sendMail(req.user,time,order,0,"");
      res.status(200).json({ success:"true", client_secret: paymentIntent.client_secret  });
      
     
    } catch (error) {
      next(error);
    }
 
});

export const getAllOrders=async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  }  catch (error) {
      next(error);
    }
};

export const confirmOrder=async (req, res, next) => {
  const {data,suborder,order,time,msg}=req.body;
  
  try {
     let user={
      name:order.user.name,
      email:order.user.email
     }
     if(data!=="") //not for not customized cake as we already sended mail for it.
     sendMail(user,time,suborder,data,msg);
    
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, 'order._id': suborder._id },
      { $set: { 'order.$.isConfirmed': true } },
      { new: true }
    );
  
    if(data===1 || data==="")
    res.json("order confirmed");
    else
    res.json("order cancelled");
  }  catch (error) {
      next(error);
    }
};
