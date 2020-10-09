const express = require('express');
const projects = require('../data/helpers/projectModel');
const actions = require('../data/helpers/actionModel');
const router = express.Router();


// Project endpoints
router.get('/projects/:id', validateProjectId(), (req, res) => {
    return res.status(200).json(req.project)
})

router.post('/projects', validatePost(), (req, res, next) => {
    projects.insert(req.body)
    .then(project => {
        return res.status(201).json(project)
    })
    .catch(error => {
        next(error)
    })
})

router.put('/projects/:id', validateProjectId(), validatePost(), (req, res, next) => {
    projects.update(req.params.id, req.body)
    .then(project => {
        if(project) {
            return res.status(200).json(project)
        } else {
            return res.status(400).json({
                message: "The project could not be found"
            })
        }
    })
    .catch(error => {
        next(error)
    })
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
                errorMessage: "Invalid project id"
            })
        }
    })
    .catch(error => {
        next(error)
    })
    }
}

function validatePost() {
    return (req, res, next) => {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({
                errorMessage: "missing project data"
            })
        } else if(!req.body.name) {
            return res.status(400).json({
                errorMessage: "Missing name field"
            })
        } else if(!req.body.description) {
            return res.status(400).json({
                errorMessage: "Missing description field"
            })
        } else {
            next()
        }
    }
}

module.exports = router;