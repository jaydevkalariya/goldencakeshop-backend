import { Stripe } from 'stripe';
import { Order } from '../models/order.js';
import { sendMail } from './mail.js';
import { log } from 'console';


export const payment = (async (req, res, next) => {
  const stripee = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { paymentMethodId, address, time, amount, order } = req.body;
    console.log(time, address)
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
    // console.log("jk" + req.body)
    await orderr.save();

    // console.log("backend");
    sendMail(req.user, time, order, 0, "");
    res.status(200).json({ success: "true", client_secret: paymentIntent.client_secret });


  } catch (error) {
    next(error);
  }

});

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getConfirmedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const confirmOrder = async (req, res, next) => {
  const { data, suborder, order, time, msg } = req.body;
  console.log(suborder, order);
  try {
    let user = {
      name: order.user.name,
      email: order.user.email
    }
    if (data !== "") //not for not customized cake as we already sended mail for it.
      sendMail(user, time, suborder, data, msg);

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, 'order._id': suborder._id },
      { $set: { 'order.$.isConfirmed': "confirm" } },
      { new: true }
    );

    if (data === 1 || data === "")
      res.json("order confirmed");
    else
      res.json("order cancelled");
  } catch (error) {
    next(error);
  }
};

//it returns orders for login entity.
export const getOrdersByUserEmail = async (req, res, next) => {
  try {
    const { email } = req.body; // Assuming email is a route parameter
    const orders = await Order.find({ 'user.email': email });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email.' });
    }
    const userOrders = orders.map(order => ({
      created_at: order.created_at,
      order: order.order,
    }));
    res.json(userOrders);
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email.' });
    }
    // const Orders = orders.map(order => ({
    //   created_at: order.created_at,
    //   order: order.order,
    //   user: order.user,
    //   time: order.time
    // }));
    res.json(orders);
  } catch (error) {
    next(error);
  }
}