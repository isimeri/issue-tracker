'use strict';
const express = require('express');
const router = express.Router();
const issueModel = require('../db/issueModel.js');
const {Types: {ObjectId}} = require('mongoose');

router.get('/:project', async (req, res) => {
  const proj = req.params.project;
  const options = {project: proj, ...req.query};
  let issueId = null;
 
  if(req.query._id){
    issueId = req.query._id;
  }

  
  if(issueId && !ObjectId.isValid(issueId)){
    return res.json({ msg: 'invalid issue id', '_id': issueId });
  }
    
  const issuesArr = await issueModel.find(options).select({project: 0}).sort({created_at: 'desc'});

  if(issuesArr.length === 0){
    return res.json({msg: "query matched nothing"});
  }

  res.json(issuesArr);
});
//===================================================post-route=====================================================
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
//======================================================put-route=====================================================
router.put('/:project', async (req, res) => {
  let issueId, doc;
  let openProp;

  if(req.body.open === "true" || req.body.open === true){
    openProp = true;
  } else if(req.body.open === "false" || req.body.open === false){
    openProp = false;
  } else {
    openProp = null;
  }

  const reqbody = {
    issue_title: req.body.issue_title || null,
    issue_text: req.body.issue_text || null,
    created_by: req.body.created_by || null,
    assigned_to: req.body.assigned_to || null,
    open: openProp,
    status_text: req.body.status_text || null
  };
  
  Object.keys(reqbody).forEach(key => {
    if(reqbody[key] === null){
      delete reqbody[key];
    }
  });
  
  if(req.body._id){
    issueId = req.body._id;
  } else if(req.query._id){
    issueId = req.query._id;
  } else {
    return res.json({msg: "missing _id"});
  }
  
  if(Object.keys(reqbody).length === 0){
    return res.json({ msg: 'no update field(s) sent', '_id': issueId });
  }
  
  if(ObjectId.isValid(issueId)){

    try{
      doc = await issueModel.findOneAndUpdate({_id: issueId}, {$set: reqbody}, {new: true});
    } catch(e){
      console.error(e);
    }
    if(!doc){
      return res.json({msg: "issue not found"});
    }
  } else {
    return res.json({ msg: 'invalid issue id', '_id': issueId });
  }

  res.json({ msg: 'successfully updated', '_id': issueId });
});
//======================================================delete-route=================================================
router.delete('/:project', async (req, res) => {

  let issueId, doc;

  if(req.query._id){
    issueId = req.query._id;
  } else if(req.body._id){
    issueId = req.body._id;
  } else {
    return res.json({msg: "missing _id"});
  }

  if(ObjectId.isValid(issueId)){

    doc = await issueModel.findOne({_id: issueId});

    if(!doc){
      return res.json({msg: "issue not found", "_id": issueId});
    }
  } else {
    return res.json({msg: "invalid issue id", "_id": issueId});
  }
  await doc.delete();
  
  res.json({msg: `successfully deleted`, "_id": issueId});
  
});

module.exports = router;