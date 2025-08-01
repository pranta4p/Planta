const express = require('express');
const app = express();
const port = 2000;

app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("home", {});
})

app.get('/home', (req, res) => {
    res.render("home", {});
})

app.get('/marketPlace', (req, res) => {
    res.render("marketPlace", {});
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

app.get('/logIn', (req, res) => {
    res.render("logIn", {});
})

app.get('/signUp', (req, res) => {
    res.render("signUp", {});
})

app.get('/marketPlaceProductAdd', (req, res) => {
    res.render("marketPlaceProductAdd", {});
})

app.get('/tutorialsAdd', (req, res) => {
    res.render("tutorialsAdd", {});
})

app.get('/blogAdd', (req, res) => {
    res.render("blogAdd", {});
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
})
