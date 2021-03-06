const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());




const auth = require('../validation/checkAccess')

const data = require("../models/data");
const units_and_conversions = require("../models/unitsAndConversions")

router.post("/", auth, async (req, res) => {
    try {

        console.log(req.body)
        if (req.body.dataType !== undefined &
            req.body.projectID !== undefined &
            req.body.formID !== undefined) {



            // Check that the project ID and formID are accessible to this user
            // and check that this user has the correct permissions to access the data
            // i.e data collector or project manager
            // Project manager can access all forms
            // Data analyst can only access certain forms within a project
            const projectManagerIDs = req.user.information.user.roles.projectManager
            const dataAnalystIDs = req.user.information.user.roles.analyst
            console.log(projectManagerIDs)
            console.log(dataAnalystIDs)

            if (projectManagerIDs.includes(req.body.projectID) ||
                dataAnalystIDs.includes(req.body.formID)) {
                console.log("Getting data")

                let result = []

                console.log(req.body.unit)
                if (req.body.unit === true) {


                    result = await units_and_conversions.find({
                        projectID: req.body.projectID,
                        formID: req.body.formID,
                        conversionType: req.body.dataType
                    })
                    console.log("")

                }

                if (req.body.data === true) {

                    result = await data.find({
                        projectID: req.body.projectID,
                        formID: req.body.formID,
                        dataType: req.body.dataType
                    })
                }


                console.log(result)
                if (result.length > 1) {
                    throw "More than one project with form and project ID. Duplicate projects in DB"
                }

                return res.send(result[0].data)

            }

            throw "Unauthorized";
        }


        //console.log(result)
    } catch (err) {
        res.json({ message: err });
    }
});



router.post("/update-units", auth, async (req, res) => {


})

module.exports = router;