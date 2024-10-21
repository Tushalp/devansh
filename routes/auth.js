const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;

 
    if (!name || !email || !password || !confirm_password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false
        });
    }

    
    if (password !== confirm_password) {
        return res.status(400).json({
            message: "Passwords do not match",
            success: false
        });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: "User with this email already exists",
            success: false
        });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    
    await newUser.save();

    return res.status(201).json({
        message: "User registered successfully",
        success: true
    });

} catch (error) {
    console.log(error)
    return res.status(500).json({
        message: "Error in signUp",
        success: false,
        error: error.message
      
    });
}
});

router.post('/login', async (req, res) => {
    try {
        const  { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({
         message: "User not found",
          success: false
            });
        }
           const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
           return res.status(400).json({
           message: "Invalid password",
           success: false
            });
                      }
          const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY,{expiresIn: '1h' } );
              res.json({ message: "User logged in successfully",
                          success: true,
                          token
                        });
       }catch(error){
          console.log(error)
          return res.status(500).json({
              message: "Error in login",
              success: false
              });
              
       }

});

module.exports = router;
