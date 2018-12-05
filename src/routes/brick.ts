var brickFirebase = require('../firebase/brick'),
  questionFirebase = require('../firebase/question'),
  db = require('../firebase/firestore'),
  router = new (require('restify-router')).Router();

import { ResponseBody } from '../bricks';

function sendSuccess(res, message, data = null) {
  res.send({message: message, success: true, data: data} as ResponseBody);
}

function sendException(res, message) {
   res.send({message: message, success: false} as ResponseBody);
}

// router functions
router.get('', function(req, res) {
  brickFirebase.getBricks().then(bricks => res.send(bricks));
});

router.post('', function(req, res) {
  brickFirebase.createBrick(req.body).then(id => res.send('brick created ' + id));
});

router.get('/:brickId', function(req, res) {
  let brickRef = db.collection('bricks').doc(req.params.brickId);
  let brick;
  brickRef.get()
  .then((brickSnapshot) => {
    if (brickSnapshot.exists) {
      brick = brickSnapshot.data();
      brick._path = brickSnapshot.ref.path;
      return brickRef.collection("questions").orderBy("number", "asc").get();
    } else {
      res.send({ message: "Document not found" });
    }
  }).then((questionsSnapshot) => {
    if (!questionsSnapshot.empty) {
      brick.questions = questionsSnapshot.docs.map((questionSnapshot) => {
        var qstn = questionSnapshot.data();
        qstn._path = questionSnapshot.ref.path;
        return qstn;
      });
      return brick.pallet.get();
    } else {
      res.send({ message: "Collection has no items" });
    }
  }).then((palletSnapshot) => {
    if (palletSnapshot.exists) {
      brick.pallet = palletSnapshot.data();
      brick.pallet.bricks = [];
      brick.pallet._path = palletSnapshot.ref.path;
      res.send(brick);
    } else {
      res.send({ message: "Document not found" });
    }
  });
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
  .then(() => sendSuccess(res, 'Question deleted by in Id = '))
  .catch((message: string) => sendException(res, message));
});

module.exports = router
