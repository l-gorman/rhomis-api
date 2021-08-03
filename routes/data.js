const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const processedData = require("../models/processedData");
const indicatorData = require("../models/indicatorData");

router.post("/", async (req, res) => {
    try {

        if (req.body.dataType !== undefined &
            req.body.projectID !== undefined &
            req.body.formID !== undefined) {

            // Sending back data for processed data
            if (req.body.dataType === "processedData") {
                const result = await processedData.find({
                    projectID: req.body.projectID,
                    formID: req.body.formID
                })

                if (result.length > 1) {
                    throw "More than one project with form and project ID. Duplicate projects in DB"
                }
                res.send(result[0].data)
            }

            if (req.body.dataType === "indicatorData") {
                const result = await indicatorData.find({
                    projectID: req.body.projectID,
                    formID: req.body.formID
                })

                if (result.length > 1) {
                    throw "More than one project with form and project ID. Duplicate projects in DB"
                }
                res.send(result[0].data)
            }

            console.log("Data type included")

        } else {
            throw 'Need to specify the data to request, the projectID, and the formID in request body. E.g. {"dataType":"processedData", "projectID":"xyz", "formID":"abc"}.';
        }

        //console.log(result)
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;