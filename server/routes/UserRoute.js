const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product=require('../models/Product')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer=require('multer')
const path =require('path')

const jwtSecret = process.env.JWT_SECRET;
const cookieParser = require('cookie-parser');
router.use(cookieParser());

/**
 * 
 * Check Login
*/
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Please Login first'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}

//for store image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload=multer({storage:storage});

router.get('/marketPlaceProductAdd',authMiddleware, (req, res) => {
    res.render("marketPlaceProductAdd", {});
})


router.post(
  '/marketPlaceProductAdd',
  authMiddleware,
  upload.single('img'), 
  async (req, res) => {
    try {
      const {
        name,
        type,
        location,
        price,
        unit,
        sellerName, 
        phone,
        description,
      } = req.body;
    
        
      const imagePath = req.file ? `./uploads/${req.file.filename}` : null;

      console.log(imagePath);
      const product = new Product({
        name,
        type,
        location,
        price,
        unit,
        seller: sellerName,
        phone,
        description,
        image: imagePath,
      });
      console.log(product);
      await product.save();

      res.redirect('/marketPlace');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to add product');
    }
  }
);

router.get('/marketPlace', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.render("marketPlace", { products }); 
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});

router.get('/tutorialsAdd',authMiddleware, (req, res) => {
    res.render("tutorialsAdd", {});
})

router.get('/blogAdd',authMiddleware, (req, res) => {
    res.render("blogAdd", {});
})



router.get('/logIn', (req, res) => {
    res.render("logIn", {});
})
router.post('/logIn', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    //  Check if user exists
    const user = await  User.findOne({ email });;
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    console.log(user);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }

    //  Generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

 
    res.cookie('token', token, {
      httpOnly: true, // Prevents JS access
      maxAge: 3600000, 
      sameSite: 'lax', 
    });

  
    res.redirect('/home'); 

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/signUp', (req, res) => {
    res.render("signUp", {});
})
router.post('/signUp', async(req, res) => {
     console.log(req.body);
    try {
    const {email, password,name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists,login please');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save to DB
    await newUser.save();

    console.log('User saved:', newUser);
    res.redirect('/logIn');

  } catch (err) {
    console.error('Error saving user:', err.message);
    res.status(500).send('Server Error');
  }
})

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});



module.exports=router;