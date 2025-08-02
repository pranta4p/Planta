const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product=require('../models/Product');
const Tutorial=require('../models/Tutorial')
const Blog=require('../models/Blog');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer=require('multer')
const path =require('path')

const jwtSecret = process.env.JWT_SECRET;
const cookieParser = require('cookie-parser');
router.use(cookieParser());

console.log("HHH");
/**
 * 
 * Check Login
*/
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    // return res.status(401).json( { message: 'Please Login first'} );
    return res.status(401).render("messagePage", {
       message: "Please login first",
     redirectUrl: "/login"
     });

  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // req.userId = decoded.userId;
    req.user = { userId: decoded.userId };
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}
const alreadyLogedInMiddleware=(req,res,next)=>{
    const token = req.cookies.token;

  if(token) {
    return res.status(401).render("messagePage", {
       message: 'you are already loged in',
     redirectUrl: "/"
     });
    
  }

  try {
    next();
  } catch(error) {
    res.status(401).json( { message: 'authorization failed'} );
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


router.get('/', (req, res) => {
  const token = req.cookies.token;
  let f=0;
  if(token){f=1;}
    res.render("home", {f});
})

router.get('/home', (req, res) => {
   const token = req.cookies.token;
  let f=0;
  if(token){f=1;}
    res.render("home", {f});
})

router.get('/marketPlaceProductAdd',authMiddleware, (req, res) => {
    res.render("marketPlaceProductAdd", {});
})

router.get('/tutorial', async(req, res) => {
  const token = req.cookies.token;
  let f=0;
  if(token){f=1;}
    const tutorials=await Tutorial.find();
    res.render("tutorial", {tutorials,f});
})

router.get('/tutorialsAdd',authMiddleware, async(req, res) => {
  try {
    res.render("tutorialsAdd", {});
  } catch (error) {
    res.status(500).send("Server Error");
  }
})

router.get('/weather', (req, res) => {
  const token = req.cookies.token;
  let f=0;
  if(token){f=1;}
    res.render("weather", {f});
})

router.get('/blog', async(req, res) => {
    const token = req.cookies.token;
    let f=0;

    if(token){f=1;}
       const blogs=await Blog.find();
    res.render("blog", {blogs,f});

})

router.get('/blogDetail/:id', async(req, res) => {
    const token = req.cookies.token;
    let f=0;
    if(token){f=1;}
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    console.log(blog.title);
    console.log(blog);
    res.render("blogDetail", {blog, f});
})

router.get('/agridoc', (req, res) => {
    const token = req.cookies.token;
    let f=0;
    if(token){f=1;}
    res.render("agridoc", {f});
})

router.get('/logIn', (req, res) => {
    res.render("logIn", {});
})

router.get('/signUp', (req, res) => {
    res.render("signUp", {});
})

router.get('/logOut', (req, res) => {
  res.clearCookie('token');
  res.redirect('/home');
});

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
    
        
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

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
    const token = req.cookies.token;
    let f=0;
    if(token){f=1;}

    const products = await Product.find(); 
    res.render("marketPlace", { products, f }); 
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});

router.get('/tutorialsAdd',authMiddleware, (req, res) => {
    res.render("tutorialsAdd", {});
})
router.post('/tutorialsAdd',authMiddleware,
  upload.single('img'), async(req, res) => {
     try {
      const {
        name,
        title,
        description,
        duration,
        attribute1,
        attribute2, 
        attribute3,
        videoLink,
      } = req.body;
    
        
       const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const user = await User.findById(req.user.userId);
      // console.log(imagePath);
      const tutorial = new Tutorial({
       name,
        title,
        description,
        duration,
        attribute1,
        attribute2, 
        attribute3,
        author_name:user.name,
        videoLink,
        image: imagePath,
      });
      // console.log(tutorial);
      const p=await tutorial.save();
      res.redirect('/tutorial');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to add tutorial');
    }
  
})

router.get('/blogAdd',authMiddleware, (req, res) => {
    res.render("blogAdd", {});
})
router.post('/blogAdd',authMiddleware,
  upload.single('img'), async(req, res) => {
     try {
      const {
        title,
        summary,
        description,
        attribute1,
        attribute2, 
        attribute3,
      } = req.body;
    
        
       const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const user = await User.findById(req.user.userId);
      // console.log(imagePath);
      const blog = new Blog({
        title,
        summary,
        author_name:user.name,
        attribute1,
        attribute2, 
        attribute3,
        description,
        image: imagePath,
      });
      // console.log(blog);
      const p=await blog.save();
      if(p)console.log("bolg added successfully");
      res.redirect('/blog');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to add Blog');
    }
  
})



router.get('/logIn',alreadyLogedInMiddleware, (req, res) => {
    res.render("logIn", {});
})
router.post('/logIn',  async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    //  Check if user exists
    const user = await  User.findOne({ email });;
    if (!user) {
      return res.status(401).render("messagePage", {
       message: 'Invalid email or password',
     redirectUrl: "/login"
     });
    }
    console.log(user);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       return res.status(401).render("messagePage", {
       message: 'Invalid password',
       redirectUrl: "/login"
       });
    }

    //  Generate JWT token
    const token = jwt.sign({ userId: user._id, name: user.name }, jwtSecret, { expiresIn: '1h' });

 
    res.cookie('token', token, {
      httpOnly: true, // Prevents JS access
      maxAge: 3600000, 
      sameSite: 'lax', 
    });

    f=1;
    res.redirect('/home'); 

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/signUp', alreadyLogedInMiddleware,(req, res) => {
    res.render("signUp", {});
})
router.post('/signUp', async(req, res) => {
    //  console.log(req.body);
    try {
    const {email, password,name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       return res.status(401).render("messagePage", {
       message: 'User already exists,login please',
       redirectUrl: "/login"
       }); 
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



module.exports=router;