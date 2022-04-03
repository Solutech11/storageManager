//importing express module
const express= require('express');
//turning it to something usefool
const app= express();


//session
const sesseion = require('express-session');
// initializing my session
app.use(sesseion({secret:"TheresaSoludoPrinceNsea", saveUninitialized:true, resave:true}))



// requiring our database
const mongoose = require('mongoose');
//connecting datbase
mongoose.connect("mongodb://localhost:27017/StoragMNg",{useNewUrlParser:true,useUnifiedTopology:true}).then((result)=>{
    if (result){
        console.log("Your database is connected");

        // when db is connected then load our server                
        // creating our server 
        app.listen(5500,()=>{
            console.log("http://localhost:5500/");
        });
    }
}).catch((error)=>{
    console.log(error);
})


//database models
const userLogin = require('./model/userlogin');//user login model

const additem =require('./model/addItem');//items model


//requiring bodyparser to read json easily
const bodyParser= require('body-parser');
const req = require('express/lib/request');
// setting body parser 
app.use(bodyParser.urlencoded({extended:true}));


// setting up our views engine
app.set("view engine","ejs");


//setting up static folder
app.use(express.static('static'))


// home page
app.get("/",(req, res)=>{
    var sess =req.session;

    if(sess.usernameStrg){
        additem.find({userName:sess.usernameStrg}, (err,data)=>{
            if (err){
                console.log(err);
            }else {
                
                additem.find({userName:sess.usernameStrg},(err, data)=>{
                    if (err){
                        console.log(err);
                    }else{
                        res.render('home',{name: sess.usernameStrg, items:data});
                    }
                })
                
            }
        })
        
    }else{
        res.redirect("/login");
    }
})


//login page
app.get("/login",(req,res)=>{
    res.render('login', {msg:""});
})

//login post route
app.post("/login", (req,res)=>{
    var collect=req.body;
    var sess =req.session;
    if(collect.UserName==""|| collect.address==""|| collect.password==""){
        res.render("login",{msg:"please fill the complete form"})
    }else{
        userLogin.findOne({username: collect.UserName, password:collect.password}, (err, data)=>{
            if (err){
                console.log(err);
            }else{
                if (data){
                    sess.usernameStrg=collect.UserName;
                    console.log("successfully logged in");
                    res.redirect("/");
                }else{
                    res.render("login",{msg:"incorrect details"})
                }
            }
        })
    }
})


//register page
app.get("/register",(req,res)=>{
    res.render('register',{msg:""});
})

// register post route 
app.post("/register",(req,res)=>{
    const collect = req.body
    var newuser= new userLogin,
    sess= req.session;
    userLogin.findOne({username:collect.username}, (err, data)=>{
        if (err) {
            console.log(err);
        }else{
            if(collect.username==""|| collect.address==""|| collect.password==""){
                res.render('register', {msg:"please fill the complete form"});
            }else{
                if(data){
                // console.log("data");
                    res.render('register', {msg:"user already exist"});                
                }else{
                    newuser.username= collect.username;
                    newuser.address= collect.address;
                    newuser.password=collect.password;
                    newuser.save(function (err) {
                        if (err) {
                            console.log(err);
                        }else{
                            console.log("new user added");
                            sess.usernameStrg=collect.username;
                            res.redirect("/")
                            
                        }
                    })
                }
            }
            
        }
    })
})


//logout of the session
app.get("/logout", (req,res)=>{
    var sess= req.session;
    if (sess.usernameStrg) {
        sess.destroy((err)=>{
            if (err) {
                console.log(err);
            }else{
                res.redirect("/");
            }
        })
    }else{
        res.redirect("/");
    }
})





//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items//items


//additem page
app.get('/addItem', (req, res)=>{
    var sess= req.session;
    if (sess.usernameStrg) {
        res.render('addItem',{message:''})
    }else{
        res.redirect('/')
    }
})

app.post('/addItem',(req,res)=>{
    const sess= req.session;
    const collect= req.body;
    const newItem = new additem()

    if (sess.usernameStrg) {
        if(collect.itemName==""|| collect.itemQuantity=="" || collect.dateTime==""){
            res.render('addItem', {message:"fill the form completely"})
        }else{
            newItem.itemName= collect.itemName
            newItem.userName= sess.usernameStrg
            newItem.quantity= collect.itemQuantity
            newItem.Date= collect.dateTime
            newItem.save((err)=>{
                if (err) {
                    console.log(err);
                }else{
                    res.redirect("/");
                }
            })
        }
    }else{
        res.redirect("/")
    }
})

//deleteitem route
app.get('/delete/:ids',(req,res)=>{
    const routing= req.params.ids;
    var sess =req.session;
    if(sess.usernameStrg){
        additem.find({_id:routing, userName:sess.usernameStrg},(err,data)=>{
            if (err){
                console.log(err);
            }else{
                if (data) {
                    additem.remove({_id:routing, userName:sess.usernameStrg},(err)=>{
                        if (err) {
                            console.log(err);
                        }else{
                            console.log("deleted");
                            res.redirect("/")
                        }
                    })
                }else{
                    res.redirect("/unkown")
                }
            }
        })
        
    }else{
        res.redirect("/")
    }
    // console.log(routing);
})

//add quantity
app.get('/add/:ids', (req,res)=>{
    var sess =req.session;
    var routing = req.params.ids
    if (sess.usernameStrg) {
        additem.findOne({_id:routing, userName:sess.usernameStrg}, (err, data) => {
            //i stopped here
            if (err) {
                console.log(err);
            }else{
                if (data) {
                    // console.log(data.quantity);
                    var quantityadd= data.quantity + 1;
                    additem.updateOne({_id:routing, userName:sess.usernameStrg},{quantity:quantityadd}, (err)=>{
                        if (err) {
                            console.log(err);
                        }else{
                            res.redirect("/");
                        }
                    })
                    
                }else{
                    res.redirect("/unkownuseredit");
                }
            }
        })
    } else {
        res.redirect("/")
    }
})

//subtract quantity
app.get('/minus/:ids',(req,res)=>{
    var idNem= req.params.ids;
    var sess= req.session;

    if (sess.usernameStrg){
        additem.findOne({_id:idNem, userName:sess.usernameStrg},(err, data)=>{
            if (err) {
                console.log(err);
            }else{
                if (data) {
                    if (data.quantity<1) {
                        res.redirect("/")
                        // window.alert("empty")
                    }else{
                        var minusdata= data.quantity - 1
                        
                        
                        additem.updateOne({_id:idNem, userName:sess.usernameStrg}, {quantity:minusdata},(err)=>{
                            if(err){
                                console.log(err);
                            }else{
                                // res.jsonp({success:true})
                                res.redirect("/")
                            }
                        })

                    }
                    // console.log();
                }else{
                    res.redirect('/unknowndata')
                }
            }
        })
    }else{
        res.redirect('/uknown')
    }
})



// app.get("/forget",(req,res)=>{
//     userLogin.find((err,data)=>{
//         if (err) {
//             console.log(err);
//         }else{
//             res.render('hi', {logins:data})
//         }
//     })
// })






// 404 page 
app.use((req,res)=>{
    res.status(404).render('404')
})