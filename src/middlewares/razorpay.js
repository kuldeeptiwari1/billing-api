const Razorpay = require('razorpay')
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_uGoq5ADrFTgYRAhk',
    key_secret: 'FySe2f58UYtg6Hjkj1a5s6clk9B'
});
module.exports = async (req, res, next) => {
   const {amount,currency,receipt, notes}  = req.body;       
   razorpayInstance.orders.create({amount, currency, receipt, notes},  
       (err, order)=>{  
         if(!err) 
           res.json(order) 
         else
           res.send(err); 
       } 
   ) 
    next();
};
