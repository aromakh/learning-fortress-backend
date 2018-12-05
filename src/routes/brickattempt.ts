var db = require('../firebase/firestore'),
  router = new (require('restify-router')).Router();

router.get('/:id', (req, res, next) => {
    console.log(req.params.id);
    let attemptRef = db.collection('brickattempts').doc(req.params.id);
    let attempt;
    attemptRef.get()
    .then((attemptSnapshot) => {
        if (attemptSnapshot.exists) {
            attempt = attemptSnapshot.data();
            attempt._path = attemptSnapshot.ref.path;
            return attemptRef.collection('answers').orderBy("number", "asc").get();
        }
        else {
            res.send({ message: "Document not found" });
        }
    }).then((answersSnapshot) => {
        if (!answersSnapshot.empty) {
            attempt.answers = answersSnapshot.docs.map((answerSnapshot) => {
                var atmpt = answerSnapshot.data();
                atmpt._path = answerSnapshot.ref.path;
                return atmpt;
            });
            return Promise.all(answersSnapshot.docs.map((answerSnapshot, index) => {
                return answerSnapshot.data().question.get()
                    .then((questionSnapshot) => {
                    attempt.answers[index].question = questionSnapshot.data();
                    attempt.answers[index].question._path = questionSnapshot.ref.path;
                });
            }));
        }
        else {
            res.send({ message: "Collection has no items" });
        }
    }).then(() => {
        return attempt.student.get();
    }).then((studentSnapshot) => {
        if (studentSnapshot.exists) {
            attempt.student = studentSnapshot.data();
            attempt.student._path = studentSnapshot.ref.path;
            return attempt.brick.get();
        }
        else {
            res.send({ message: "Document not found" });
        }
    }).then((brickSnapshot) => {
        if (brickSnapshot.exists) {
            attempt.brick = brickSnapshot.data();
            attempt.brick.pallet = null;
            attempt.brick._path = brickSnapshot.ref.path;
            res.send(attempt);
        }
        else {
            res.send({ message: "Document not found" });
        }
    });
});
router.post('', (req, res, next) => {
    console.log(req.body);
    let data = req.body;
    let brick = Object.assign({}, data);
    delete brick.answers;
    brick.student = db.doc(data.student);
    brick.brick = db.doc(data.brick);
    db.collection('brickattempts').add(brick)
        .then((studentbrick) => {
        let answersRef = studentbrick.collection('answers');
        return Promise.all(data.answers.map((answerData, index) => {
            answersRef.add(answerData);
        }));
    }).then(() => {
        console.log("added thing");
        res.status(200);
        res.send({ message: "Operation successful" });
    }).catch((reason) => {
        res.send(reason);
    });
});

module.exports = router;
