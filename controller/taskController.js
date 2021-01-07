const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Task = mongoose.model('Task');

router.get('/', (req, res) => {
    res.render("task/addOrUpdate", {
        viewTitle: "Create Tasks"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var task = new Task();
    task.taskName = req.body.taskName;
    task.deadline = req.body.deadline;
    task.timeRequired = req.body.timeRequired;

    task.save((err, doc) => {
        if (!err)
            res.redirect('task/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("task/addOrUpdate", {
                    viewTitle: "Create Tasks",
                    task: req.body
                });
            }
            else
                console.log('Error during record creation : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Task.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('task/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("task/addOrUpdate", {
                    viewTitle: 'Update task',
                    task: req.body
                });
            }
            else
                console.log('Error during task update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Task.find((err, docs) => {
        if (!err) {
            res.render("task/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving task list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'taskName':
                body['taskNameError'] = err.errors[field].message;
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Task.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("task/addOrUpdate", {
                viewTitle: "Update task",
                task: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Task.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/task/list');
        }
        else { console.log('Error in task delete :' + err); }
    });
});

module.exports = router;