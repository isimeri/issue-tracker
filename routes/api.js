'use strict';
const express = require('express');
const router = express.Router();

const issueModel = require('../db/issueModel.js');

const {Types: {ObjectId}} = require('mongoose');

// router.get('/:project', async (req, res) => {
//   const proj = req.params.project;
//   let options = {project: proj};
//   if(req.query.created_by){
//     options["created_by"] = req.query.created_by;
//   }
//   if(req.query.assigned_to){
//     options["assigned_to"] = req.query.assigned_to;
//   }
//   if(req.query.open){
//     options["open"] = req.query.open;
//   }
//   if(req.query.status_text){
//     options["status_text"] = req.query.status_text;
//   }
//   const issuesArr = await issueModel.find(options).sort({created_at: 'desc'});
//   res.render("issue", {project: proj, issues: issuesArr});
// });
router.get('/:project', async (req, res) => {
  const proj = req.params.project;
  const options = {project: proj, ...req.query};
  const issuesArr = await issueModel.find(options).select({project: 0}).sort({created_at: 'desc'});
  // console.log(options);
  // console.log(issuesArr[0]);
  res.json(issuesArr);
});

router.post('/:project', (req, res) => {
  const proj = req.params.project;

  if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
    return res.json({ err: "mandatory fields are mandatory"});
  }

  const newIssue = new issueModel({
    project: proj,
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
    created_by: req.body.created_by,
    created_on: Date.now().toString(),
    updated_on: Date.now().toString(),
    assigned_to: req.body.assigned_to,
    open: true,
    status_text: req.body.status_text
  });

  newIssue.save((err, data) => {
    if(err){
      return res.json({msg: "something went wrong while creating a new issue"});
    } 
    res.json(data);
  });
});

router.put('/:project', async (req, res) => {
  let project = req.params.project;
  let issueId, doc;
  const reqbody = {...req.body};

  if(reqbody._id){
    delete reqbody["_id"]
  }

  if(req.body._id){
    issueId = req.body._id;
  } else if(req.query._id){
    issueId = req.query._id;
  } else {
    return res.json({msg: "missing issue id"})
  }

  if(Object.keys(reqbody).length === 0){
    return res.json({msg: 'there was nothing to update'});
  }
  
  try{
    doc = await issueModel.findByIdAndUpdate(issueId, reqbody, {new: true});
  } catch(e){
    console.error(e);
  }

  if(!doc){
    return res.json({msg: "issue not found"});
  }
  res.json({ msg: `issue ${issueId} updated successfully`, doc});
});

router.delete('/:project', async (req, res) => {

  let issueId, doc;

  if(req.query._id){
    issueId = req.query._id;
  } else if(req.body._id){
    issueId = req.body._id;
  } else {
    res.json({error: "missing _id"});
  }

  if(ObjectId.isValid(issueId)){

    doc = await issueModel.findOne({_id: issueId});
    // console.log("findone in del ", doc);
    if(!doc){
      console.log("if 1");
      return res.json({error: "could not delete", "_id": issueId});
    }
  } else {
    console.log("if 2");
    return res.json({error: "could not delete", "_id": issueId});
  }
  await doc.delete();
  
  res.json({result: `successfully deleted`, "_id": issueId});
  
});

module.exports = router;