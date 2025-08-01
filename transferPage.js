require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./server/config/db');
const port = process.env.PORT || 3000;

const path =require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
//db connection
connectDB();
app.get('/', (req, res) => {
    res.render("home", {});
})

app.get('/home', (req, res) => {
    res.render("home", {});
}) 

app.get('/tutorial', (req, res) => {
    res.render("tutorial", {});
})

app.get('/weather', (req, res) => {
    res.render("weather", {});
})

app.get('/blog', (req, res) => {
    res.render("blog", {});
})

app.get('/agridoc', (req, res) => {
    res.render("agridoc", {});
})

app.use('/', require('./server/routes/UserRoute'));

app.listen(port, () => {
    console.log(`app listening on port http://localhost:${port}`);
})
