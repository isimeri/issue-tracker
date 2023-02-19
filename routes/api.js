'use strict';
const express = require('express');
const router = express.Router();
const issueModel = require('../db/issueModel.js');
const {Types: {ObjectId}} = require('mongoose');

router.get('/:project', async (req, res) => {
  const proj = req.params.project;
  const options = {project: proj, ...req.query};
  const issuesArr = await issueModel.find(options).select({project: 0}).sort({created_at: 'desc'});

  res.json(issuesArr);
});

router.post('/:project', (req, res) => {
  const proj = req.params.project;

  if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
    return res.json({ error: 'required field(s) missing' });
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
    return res.json({msg: "missing _id"})
  }

  if(Object.keys(reqbody).length === 0){
    return res.json({ error: 'no update field(s) sent', '_id': _id });
  }
  
  if(ObjectId.isValid(issueId)){

    try{
      doc = await issueModel.findByIdAndUpdate(issueId, reqbody, {new: true});
    } catch(e){
      console.error(e);
    }
    if(!doc){
      return res.json({msg: "issue not found"});
    }
  } else {
    res.json({ error: 'could not update', '_id': _id });
  }

  res.json({ result: 'successfully updated', '_id': _id });
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

    if(!doc){
      return res.json({error: "could not delete", "_id": issueId});
    }
  } else {
    return res.json({error: "could not delete", "_id": issueId});
  }
  await doc.delete();
  
  res.json({result: `successfully deleted`, "_id": issueId});
  
});

module.exports = router;