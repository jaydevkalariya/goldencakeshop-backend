import nodemailer from 'nodemailer';
import { User } from "../models/user.js";
import moment from 'moment';
import cron from 'node-cron';



// Function to send email
export const sendMail = (user,time,order,customize,message) => {

  // Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOLDEN_EMAIL,
    pass: process.env.GOLDEN_PASSWORD,
  }
});
 
  var emailBody;
 var count=1;
  if(!customize) //FOR NORMAL CAKE ORDERS
  {
   emailBody = `
  <html>
    <body>
      <h2>Order Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Your orders have been confirmed. Please find the order details below:</p>
      ${order.map((item, index) => `
       ${!item.customize?`

        <h3>Order ${count++}</h3>
        <ul>
          <li>Cake: ${item.name}</li>
          <li>Flavour: ${item.flavour}</li>
          <li>Weight: ${item.wt}</li>
          <li>Delivery Time: ${time}</li>
          
        </ul>
        `:"after Price are Decided by our agency for your customization cake,you got email for order conformation."}
      `).join('')}
      <p>Above cakes are confirmed, but if you order customized cakes,then you got a mail after conformation of Golden cakeshop.</p>
      <p>Thank you for your orders!</p> <br/>
      <p>If you have any queries, please feel free to contact us: <b>7990554541</b></p>
    </body>
  </html>
`;
  }
  else if(customize===1){ //FOR CUSTOMIZE WITH CONFIRMATION
    let price=parseInt(message)
    emailBody = `
    <html>
     <head>
     <style>
       .heading{
        color:green;
       }
       </style>
     </head>
      <body>
        <h2>Order Confirmation for Customize Cakes</h2>
        <p>Dear ${user.name},</p>
        <p class="heading">Your orders have been confirmed. Please find the order details below:</p>
  
          <ul>
            <li>Cake: ${order.name}</li>
            <li>Flavour: ${order.flavour}</li>
            <li>Weight: ${order.wt}</li>
            <li>Price: ${price} Rs.</li>
            <li>Quantity: ${order.amount} </li>
            <li>Delivery Time: ${time}</li>
            <li><b>Total Price: ${price} Rs.</b></li>
          </ul>
        <p>Thank you for your orders!</p> <br/>
        <p>If you have any queries, please feel free to contact us: <b>7990554541</b></p>
      </body>
    </html>
  `;
  }
  else if(customize===2){ //FOR CUSTOMIZATION WITH DENIED
    emailBody = `
    <html>
    <head>
    <style>
    .heading{
     color:red;
    }
    </style>
  </head>
      <body>
        <h2>Order Confirmation for Customize Cakes</h2>
        <p>Dear ${user.name},</p>
        <p class="heading">Sorry, but your design and customization is not able to made by our cakeshop.</p>
         <h4>Following is the problem with your customization:</h4>
          <p>${message}</p>
        <p>Above cakes are confirmed, but if you order customized cakes,then you got a mail after conformation of Golden cakeshop.</p>
        <p>Thank you for your time,please order once again with good customization.</p> <br/>
        <p>If you have any queries, please feel free to contact us: <b>7990554541</b></p>
      </body>
    </html>
  `;
  }
  else{
    emailBody = `
    <html>
     
      <body>
        <h2>Visit Us</h2>
        <p>Dear ${user.name},</p>
        <p class="heading">Wishing you a very happy birthday in Advance!</p>
         
          
        <p>Birthday without Cakes are nothing right? Hoping that on your previous Birthday,You enjoyed our cake!</p> <br/>
        <p>Book Your Cake now with some Delicious new Flavours & Design,to make your birthday more special. </p>
        <h4>Special Discount of 10% for You</h4>
        <p>Best regards,\nGolden Cakeshop</p>
      </body>
    </html>
  `;
  }
 




  const mailOptions = {
    from: process.env.GOLDEN_EMAIL,
    to: user.email,
    subject: "Golden Cakeshop",
    html: emailBody,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Send emails to users whose birthday is tomorrow
export const sendMails = async() => {

const tomorrow = moment().add(1, 'day').startOf('day');
const user=await User.find();
const tomorrowBirthdays = user.filter(userr => (moment(userr.date).format("MM-DD"))===(tomorrow.format("MM-DD")));

for (const user of tomorrowBirthdays) {
  await sendMail(user,"","",5,""); // Function to send birthday email
}
}

//to daily check at 8:00 AM,whose birthday at tommorow
cron.schedule('15 16 * * *', async () => {
  try {
    await sendMails();
    console.log('Birthday reminder emails sent successfully');
  } catch (error) {
    console.error('Failed to send birthday reminder emails:', error);
  }
});