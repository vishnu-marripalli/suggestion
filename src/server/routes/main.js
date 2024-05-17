const express = require("express")
const router = express.Router()
const Data = require('../schema/data')
const User = require('../schema/user')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
router.use(express.static('public'));
const loginlayout = '../views/layouts/login';

jwtSecret = process.env.JWT_SECRECT2
/*
*MIDDLEWARE CHECKING LOGIN
 */
function authmiddleware(req,res,next){

    const token=req.cookies.token;
    if(!token){
       res.render("unauth",{
        layout:loginlayout
       });
    }
    try {
        const decoded= jwt.verify(token,jwtSecret);
        req.userId=decoded.userId
        req.user=decoded.user;
        req.Htno=decoded.Htno;
        next();
    } catch (error) {
        res.render("unauth",{
            layout:loginlayout
           });
    }
}

/*
*MIDDLEWARE fetch
 */
// function fetchmiddleware(req,res,next){

//     const token=req.cookies.token;
//     const decoded= jwt.verify(token,jwtSecret);
//     // req.userId=decoded.userId;
//     req.user=decoded.user;

//     // console.log(req.user);
//     next();

// }




/*
*GET
*loginpage
 */
router.get('/', (req, res) => {
    try {
        
        res.render("login",{
           layout: loginlayout,
            
        })
    } catch (error) {
        
    } 
})
/*
*Post
* checking login
 */

router.post('/', async (req, res) => {
    try {
    
        let username =req.body.user;
        let password = req.body.password;
        // console.log(username)
        const user= await User.findOne({user : username,type:"student"});
        // console.log(user)
        if(!user){
            res.render("invalidcedentials",{
                layout:loginlayout
            })
        }

        if(password!=user.password){
            res.render("invalidcedentials",{
                layout:loginlayout
            })
        }
        // const  ispassvaild =  await bcrypt.compare(password,user.password)
        // console.log(ispassvaild)
        // if(!ispassvaild){
        //     res.render("401",{
        //         layout:loginlayout
        //     })
        // }

        const token = jwt.sign({user:user.user,uesrId : user._id, Htno : user.password} ,jwtSecret );
         res.cookie('token', token, { httpOnly: true });

        res.redirect("home")

    } catch (error) {
        
    } 
})



/*
*GET
*Homepage
 */

router.get('/home',authmiddleware,async(req, res) => {
    const noofsuggestions =await Data.countDocuments({type:"suggestion"})   
    const noofsuggestionssolved =await Data.countDocuments({type:"suggestion",feedbackgiven:true})   
    const noofcomplaints =await Data.countDocuments({type:"complaint"})   
    const noofcomplaintssolved =await Data.countDocuments({type:"complaint",feedbackgiven:true})   
    const noofragging =await Data.countDocuments({type:"antiragging"})   
    const noofraggingssolved =await Data.countDocuments({type:"antiragging",feedbackgiven:true})   
    
    const local = {
        page: "KCEA Home",
        user: req.user,
        Htno: req.Htno,
    }
    res.render("index",{
        local:local,
        noofsuggestions:noofsuggestions,
        noofsuggestionssolved:noofsuggestionssolved,
        noofcomplaints:noofcomplaints,
        noofcomplaintssolved:noofcomplaintssolved,
        noofragging:noofragging,
        noofraggingssolved:noofraggingssolved
    })
})

/*
*GET
*suggestion page
 */


router.get('/suggestion', authmiddleware,async (req, res) => {

    const local = {
        page: "Suggestion page",
        title :"Suggestion",
        des: "Feedback on Suggestion",
        title2: "Suggestion Form",
        imgsrc:"Suggestion",
        formaction : "suggestion",
        user: req.user,
        Htno: req.Htno,
    }
    // console.log(req.userId)
    
    let  data = await Data.find({type:"suggestion",user:req.user})
    .sort({updatedAt : -1});
    res.render("pages", {
        local: local,
        data: data,
        
    })
})

/*
*post
*suggestion page
 */
router.post('/suggestion', authmiddleware,async (req, res) => {
    try {
        const newdata = new Data({
            type: "suggestion",
            title : req.body.title,
            subject:req.body.subject,
            description:req.body.description,
            user: req.user,
            feedback: "Waiting for the feedback"
        })

        await Data.create(newdata);
        res.redirect('/suggestion');
    } catch (error) {
        console.log(error)
    }
    
})

/*
*GET
*complaint page
 */


router.get('/complaint',authmiddleware, async (req, res) => {

    const local = {
        page: "Complaint page",
        title :"Complaint",
        des: "Feedback on Complaint",
        title2: "Complaint Form",
        imgsrc:"Complaint",
        formaction : "complaint",
        user: req.user,
        Htno: req.Htno,
    }
    let data = await Data.find({type:"complaint",user:req.user})
    .sort({updatedAt : -1});
    res.render("pages", {
        local: local,
        data:data
    })
})

/*
*post
*compalint page
 */
router.post('/complaint',authmiddleware, async (req, res) => {
    try {
    //    console.log(req.user)
        const newdata = new Data({
            type : "complaint",
            title : req.body.title,
            subject:req.body.subject,
            description:req.body.description,
            user: req.user,
            feedback: "Waiting for the feedback"
        })

        await Data.create(newdata);
        res.redirect('/complaint');
    } catch (error) {
        console.log(error)
    }
    
})

/*
*get
*antiragging page
 */
router.get('/antiragging',authmiddleware, async (req, res) => {

    const local = {
        page: "Antiragging page",
        title :"Ragging incident",
        des: "Action taken on incident",
        title2: "Describe about your Ragging Incident",
        imgsrc:"Antiragging",
        formaction : "antiragging",
        user: req.user,
        Htno: req.Htno,
    }
    let data = await Data.find({type:"antiragging",user:req.user})
    .sort({updatedAt : -1});
    // data= data.reverse();

    res.render("pages", {
        local: local,
        data:data
    })
})
/*
*post
*antiragging page
 */
router.post('/antiragging',authmiddleware, async (req, res) => {
    try {
        const newdata = new Data({
            type: "antiragging",
            title : req.body.title,
            subject:req.body.subject,
            description:req.body.description,
            user:req.user,
            feedback: "Waiting for the feedback"
        })

        await Data.create(newdata);
        res.redirect('/antiragging');
    } catch (error) {
        console.log(error)
    }
    
})


/*
*get
*logout
 */
router.get('/logout',authmiddleware, async (req, res) => {

    res.clearCookie('token')
    res.redirect("/")

})



module.exports = router



