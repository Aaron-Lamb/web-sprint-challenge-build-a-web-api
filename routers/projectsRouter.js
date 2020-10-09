const express = require('express');
const projects = require('../data/helpers/projectModel');
const router = express.Router();

router.get('/projects/:id', validateProjectId(), (req, res) => {
    return res.status(200).json(req.project)
})

// Custom Middleware
function validateProjectId() {
    return (req, res, next) => {
    projects.get(req.params.id)
    .then(project => {
        if(project) {
            req.project = project
            next()
        } else {
            return res.status(404).json({
                errorMessage: "Some helpful error message"
            })
        }
    })
    .catch(error => {
        console.log(error)
        return res.status(400).json({
            message: 'invalid project id'
        })
    })
    }
}

module.exports = router;