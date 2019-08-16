/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
var mongodb = require('mongodb');

module.exports = function (app) {

mongoose.connect(process.env.DB, { useNewUrlParser: true })
  
    const SchemaP7 = new mongoose.Schema({
      issue_title: String,
      issue_text: String,
      created_by: String,
      assigned_to: String,
      status_text: String,
      created_on: String,
      updated_on: String,
      open: Boolean
    });
    const ModelP7 = mongoose.model('ModelP7', SchemaP7);

    /*ModelP7.remove({}, (err) => {
      if (err) console.log('Error reading database!')
    });*/

    app.route('/api/issues/:project')

      .post(function (req, res){
        var assigned_to = '';
        var status_text = '';
        if (req.body.assigned_to) var assigned_to = req.body.assigned_to;
        if (req.body.status_text) var status_text = req.body.status_text;
        if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
          const issue = new ModelP7({
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: assigned_to,
            status_text: status_text,
            created_on: new Date().toLocaleDateString(),
            updated_on: new Date().toLocaleDateString(),
            open: true
          });
          issue.save((err, data) => {
            if (err) console.log('Error saving to database!');
            res.json(issue);
          })
        } else res.send('missing inputs');
      })

      .put(function (req, res){
        var query = req.body;
        Object.getOwnPropertyNames(query).forEach((item) => {
          if (query[item] == "") {
            delete query[item];
          }
        });
        ModelP7.findOneAndUpdate(
          {_id: req.body._id},
          {
            issue_title: query.issue_title,
            issue_text: query.issue_text,
            created_by: query.created_by,
            assigned_to: query.assigned_to,
            status_text: query.status_text,
            updated_on: new Date().toLocaleDateString(),
            open: query.open
          },
          {new: true},
          (err, data) => {
            if (err) {
              console.log('Error reading database!');
              res.send('could not update ' + req.body._id);
            } else if (data && (req.body.issue_title || req.body.issue_text || req.body.created_by || req.body.assigned_to || req.body.status_text || req.body.open == 'false')) res.send('successfully updated')
            else if (data) res.send('no updated field sent'); 
        });
      })

      .get(function (req, res){
        var query = req.query;
        Object.getOwnPropertyNames(query).forEach((item) => {
          if (query[item] == "") {
            delete query[item];
          }
        });
        ModelP7.find(query, (err, data) => {
          if (err) console.log('Error reading database!')
          else res.json(data);
        });
      })

      .delete(function (req, res){
        if (req.body._id) {  
          ModelP7.remove(req.body, (err, data) => {
            if (err) console.log('Error reading database!')
            else if (data['deletedCount'] == 0) res.send('could not delete ' + req.body._id)
            else res.send('deleted ' + req.body._id);
          });
        } else res.send('_id error');
      });
    };