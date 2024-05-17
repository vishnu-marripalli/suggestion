const express = require("express")
const router = express.Router()
const Data = require('../schema/data')
const User = require('../schema/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require("../schema/user")

const loginlayout = '../views/layouts/login';

jwtSecret = process.env.JWT_SECRECT1
router.use(express.static('public'));

/*
*MIDDLEWARE CHECKING LOGIN
 */
function authmiddleware(req, res, next) {

    const admintoken = req.cookies.admintoken;
    if (!admintoken) {
        res.render("unauth", {
            layout: loginlayout
        });
    }
    try {
        const decoded = jwt.verify(admintoken, jwtSecret);
        req.userId = decoded.userId
        req.user = decoded.user;
        req.Htno = decoded.Htno;
        next();
    } catch (error) {
        res.render("unauth", {
            layout: loginlayout
        });
    }
}


/*
*GET
*loginpage
 */
router.get('/', (req, res) => {
    try {

        res.render("facultylogin", {
            layout: loginlayout,

        })
    } catch (error) {

    }
})


/*
*post
*loginpage
 */
router.post('/', async (req, res) => {
    try {
        let username = req.body.user
        let password = req.body.password
        console.log(req.body)
        const user = await User.findOne({ user: username, type: "faculty" })

        if (!user) {
            res.render("invalidcedentials", {
                layout: loginlayout
            })
        }

        if (password != user.password) {
            res.render("invalidcedentials", {
                layout: loginlayout
            })
        }

        const admintoken = jwt.sign({ user: user.user, uesrId: user._id, Htno: user.password }, jwtSecret);
        res.cookie('admintoken', admintoken, { httpOnly: true });

        res.redirect("faculty/home")

    } catch (error) {
        res.render("401", {
            layout: loginlayout
        })
    }
})
/*
*GET
*HOME
 */
router.get('/home', authmiddleware, async (req, res) => {
    try {
        const noofsuggestions = await Data.countDocuments({ type: "suggestion" })
        const noofsuggestionssolved = await Data.countDocuments({ type: "suggestion", feedbackgiven: true })
        const noofcomplaints = await Data.countDocuments({ type: "complaint" })
        const noofcomplaintssolved = await Data.countDocuments({ type: "complaint", feedbackgiven: true })
        const noofragging = await Data.countDocuments({ type: "antiragging" })
        const noofraggingssolved = await Data.countDocuments({ type: "antiragging", feedbackgiven: true })

        let local = {
            page: "Faculty Home",
            user: req.user,
            Htno: req.Htno,
        }

        res.render("faculty-index", {
            local: local,
            noofsuggestions: noofsuggestions,
            noofsuggestionssolved: noofsuggestionssolved,
            noofcomplaints: noofcomplaints,
            noofcomplaintssolved: noofcomplaintssolved,
            noofragging: noofragging,
            noofraggingssolved: noofraggingssolved,
            
        })
    } catch (error) {

    }
})

/*
*GET
*Suggestion
 */
router.get('/suggestion', authmiddleware, async (req, res) => {
    try {
        let dataforupdate = await Data.find({ type: "suggestion", feedbackgiven: false })
        let dataupdated = await Data.find({ type: "suggestion", feedbackgiven: true })
            .sort({ updatedAt: -1 });
        const local = {
            page: "Faculty suggestion",
            title: "Suggestions to Review",
            des: "Reviewd Suggestion",
            title2: "New Suggestions",
            title3: "Reviewed Suggestion",
            imgsrc: "Suggestion",
            formaction: "faculty/suggestion",
            user: req.user,
            Htno: req.Htno,
        }

        res.render("faculty-pages", {
            local: local,
            dataforupdate: dataforupdate,
            dataupdated: dataupdated
        })
    } catch (error) {

    }
})

/*
*PUT
*Suggestion
 */
router.put('/suggestion/:id', authmiddleware, async (req, res) => {
    try {
        await Data.findByIdAndUpdate(req.params.id, {
            feedbackgiven: true,
            feedback: req.body.description,
            updatedAt: Date.now()
        })
        res.redirect('/faculty/suggestion')
    } catch (error) {
        console.log(error)
    }
})
/*
*GET
*Complaint
 */
router.get('/complaint', authmiddleware, async (req, res) => {
    try {
        let dataforupdate = await Data.find({ type: "complaint", feedbackgiven: false })
        let dataupdated = await Data.find({ type: "complaint", feedbackgiven: true })
            .sort({ updatedAt: -1 });
        const local = {
            page: "Faculty complaint",
            title: "Complaint to Review",
            des: "Reviewd Complaints",
            title2: "New Complaints",
            title3: "Reviewed Complaints",
            imgsrc: "Complaint",
            formaction: "faculty/complaint",
            user: req.user,
            Htno: req.Htno,
        }

        res.render("faculty-pages", {
            local: local,
            dataforupdate: dataforupdate,
            dataupdated: dataupdated
        })
    } catch (error) {

    }
})

/*
*PUT
*complaint
 */
router.put('/complaint/:id', authmiddleware, async (req, res) => {
    try {
        await Data.findByIdAndUpdate(req.params.id, {
            feedbackgiven: true,
            feedback: req.body.description,
            updatedAt: Date.now()
        })
        res.redirect('/faculty/complaint')
    } catch (error) {
        console.log(error)
    }
})
/*
*GET
*Antiragging
 */
router.get('/antiragging', authmiddleware, async (req, res) => {
    try {
        let dataforupdate = await Data.find({ type: "antiragging", feedbackgiven: false })
        let dataupdated = await Data.find({ type: "antiragging", feedbackgiven: true })
            .sort({ updatedAt: -1 });
        const local = {
            page: "Faculty Antiragging",
            title: "Ragging Incidents to Review",
            des: "Action taken on the incident",
            title2: "New Ragging Incidents",
            title3: "Reviewed Incidents",
            imgsrc: "Antiragging",
            formaction: "faculty/antiragging",
            user: req.user,
            Htno: req.Htno,
        }

        res.render("faculty-pages", {
            local: local,
            dataforupdate: dataforupdate,
            dataupdated: dataupdated
        })
    } catch (error) {

    }
})

/*
*PUT
*complaint
 */
router.put('/antiragging/:id', authmiddleware, async (req, res) => {
    try {
        await Data.findByIdAndUpdate(req.params.id, {
            feedbackgiven: true,
            feedback: req.body.description,
            updatedAt: Date.now()
        })
        res.redirect('/faculty/antiragging')
    } catch (error) {
        console.log(error)
    }
})


/*
*get
*logout
 */
router.get('/logout', authmiddleware, async (req, res) => {

    res.clearCookie('admintoken')
    res.redirect("/faculty")

})








module.exports = router