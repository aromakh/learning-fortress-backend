var brickFirebase = require('../firebase/brick'),
  questionFirebase = require('../firebase/question'),
  db = require('../firebase/firestore'),
  router = new (require('restify-router')).Router();


router.get('', function(req, res) {
  brickFirebase.getBricks().then(bricks => res.send(bricks));
});

router.post('/', function(req, res) {
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
        }
        else {
            res.send({ message: "Document not found" });
        }
    })
      .then((questionsSnapshot) => {
      if (!questionsSnapshot.empty) {
          brick.questions = questionsSnapshot.docs.map((questionSnapshot) => {
              var qstn = questionSnapshot.data();
              qstn._path = questionSnapshot.ref.path;
              return qstn;
          });
          return brick.pallet.get();
      }
      else {
          res.send({ message: "Collection has no items" });
      }
  }).then((palletSnapshot) => {
      if (palletSnapshot.exists) {
          brick.pallet = palletSnapshot.data();
          brick.pallet.bricks = [];
          brick.pallet._path = palletSnapshot.ref.path;
          res.send(brick);
      }
      else {
          res.send({ message: "Document not found" });
      }
  });
});

router.put('/:brickId', function(req, res) {
  brickFirebase.updateBrick(req.params.brickId, req.body).then(id => {
    res.send('Brick updated')
  });
});

router.del('/:brickId', function(req, res) {
  brickFirebase.deleteBrick(req.params.brickId).then(id => res.send('Brick deleted'));
});

/* Questions */
router.get('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.getQuestion(req.params.brickId, req.params.questionId)
  .then(question => res.send(question))
  .catch(reason => res.send(reason));
});

router.post('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.createQuestion(req.params.brickId, req.params.questionId, req.body)
  .then(id => res.send('Question created'))
  .catch(reason => res.send(reason));
});

router.put('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.updateQuestion(req.params.brickId, req.params.questionId, req.body).then(questionId => {
    res.send('Question updated');
  }).catch(reason => res.send(reason));
});

router.del('/:brickId/question/:questionId', function (req, res) {
  questionFirebase.deleteQuestion(req.params.brickId, req.params.questionId)
  .then(() => res.send('Question deleted by in Id = ', req.params.questionId))
  .catch(reason => res.send(reason));
});

module.exports = router
