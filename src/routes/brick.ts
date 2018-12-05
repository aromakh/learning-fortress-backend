var brickFirebase = require('../firebase/brick'),
  questionFirebase = require('../firebase/question'),
  db = require('../firebase/firestore'),
  router = new (require('restify-router')).Router();

import { ResponseBody } from '../models/bricks';
import { response } from 'spdy';

function sendSuccess(res, message, data = null) {
  res.send({message: message, success: true, data: data} as ResponseBody);
}

function sendException(res, message) {
   res.send({message: message, success: false} as ResponseBody);
}

// router functions
router.get('', function(req, res) {
  brickFirebase.getBricks()
  .then(bricks => sendSuccess(res, '', bricks))
  .catch((message: string) => sendException(res, message));
});

router.post('', function(req, res) {
  brickFirebase.createBrick(req.body)
  .then(id => sendSuccess(res, 'brick created ' + id))
  .catch((message: string) => sendException(res, message));
});

router.get('/:brickId', function(req, res) {
  brickFirebase.getFullBrick(req.params.brickId)
  .then((brick) => res.send(brick))
  .catch((message) => res.send(message));
});

router.put('/:brickId', function(req, res) {
  brickFirebase.updateBrick(req.params.brickId, req.body)
  .then(() => sendSuccess(res, 'Brick ' + req.params.brickId + ' updated' ))
  .catch((message: string) => sendException(res, message));
});

router.del('/:brickId', function(req, res) {
  brickFirebase.deleteBrick(req.params.brickId)
  .then(id => sendSuccess(res, 'Brick deleted'))
  .catch((message: string) => sendException(res, message));
});

/* Questions */
router.get('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.getQuestion(req.params.brickId, req.params.questionId)
  .then(question => sendSuccess(res, '', question))
  .catch((message: string) => sendException(res, message));
});

router.post('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.createQuestion(req.params.brickId, req.params.questionId, req.body)
  .then(id => sendSuccess(res, 'Question created'))
  .catch((message: string) => sendException(res, message));
});

router.put('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.updateQuestion(req.params.brickId, req.params.questionId, req.body)
  .then(() => sendSuccess(res, 'Question updated'))
  .catch((message: string) => sendException(res, message));
});

router.del('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.deleteQuestion(req.params.brickId, req.params.questionId)
  .then(() => sendSuccess(res, 'Question deleted by in Id = ' + req.params.questionId))
  .catch((message: string) => sendException(res, message));
});

module.exports = router
