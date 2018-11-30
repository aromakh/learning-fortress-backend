import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import * as admin from 'firebase-admin';

import * as servicePath from './key/learning-fortress-keys';
import { Pallet, Brick, BrickAttempt } from './bricks';
import { DocumentSnapshot, DocumentReference, QuerySnapshot } from '@google-cloud/firestore';

var port = process.env.PORT || 3000;

var server = restify.createServer({
    name: 'learning-fortress-backend',
    version: '1.0.0'
});

const cors = corsMiddleware({
    preflightMaxAge: 6000,
    origins: JSON.parse(process.env.accept_origin),
    allowHeaders: ['Content-Type'],
    exposeHeaders: [],
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);

/*
server.get('/hello', function(req, res, next) {
    res.send({ message: 'Hello World!' });
    return next();
})

server.get('/brick/:id', (req, res, next) => {
    let brickRef = db.collection('bricks').doc(req.params.id);
    let brick: any;
    brickRef.get()
        .then((brickSnapshot: DocumentSnapshot) => {
            if(brickSnapshot.exists) {
                brick = brickSnapshot.data();
                brick._path = brickSnapshot.ref.path;
                return brickRef.collection("questions").orderBy("number", "asc").get();
            } else {
                res.send({ message: "Document not found" });
            }
        })
        .then((questionsSnapshot: QuerySnapshot) => {
            if(!questionsSnapshot.empty) {
                brick.questions = questionsSnapshot.docs.map((questionSnapshot : DocumentSnapshot) => {
                    var qstn = questionSnapshot.data()
                    qstn._path = questionSnapshot.ref.path;
                    return qstn;
                });
                return brick.pallet.get()
            } else {
                res.send({ message: "Collection has no items" });
            }
        })
        .then((palletSnapshot: DocumentSnapshot) => {
            if(palletSnapshot.exists) {
                brick.pallet = palletSnapshot.data();
                brick.pallet.bricks = [];
                brick.pallet._path = palletSnapshot.ref.path;
                res.send(brick);
            } else {
                res.send({ message: "Document not found" });
            }
        });
});

server.get('/brickattempt/:id', (req, res, next) => {
    // TODO: Change header to environment variable.
    let attemptRef = db.collection('brickattempts').doc(req.params.id);
    let attempt: any;
    attemptRef.get()
        .then((attemptSnapshot: DocumentSnapshot) => {
            if(attemptSnapshot.exists) {
                attempt = attemptSnapshot.data();
                attempt._path = attemptSnapshot.ref.path;
                return attemptRef.collection('answers').orderBy("number", "asc").get();
            } else {
                res.send({ message: "Document not found" });
            }
        })
        .then((answersSnapshot: QuerySnapshot) => {
            if(!answersSnapshot.empty) {
                attempt.answers = answersSnapshot.docs.map((answerSnapshot: DocumentSnapshot) => {
                    var atmpt = answerSnapshot.data()
                    atmpt._path = answerSnapshot.ref.path;
                    return atmpt;
                });
                return Promise.all(answersSnapshot.docs.map((answerSnapshot: DocumentSnapshot, index: number) => {
                    return answerSnapshot.data().question.get()
                        .then((questionSnapshot: DocumentSnapshot) => {
                            attempt.answers[index].question = questionSnapshot.data();
                            attempt.answers[index].question._path = questionSnapshot.ref.path;
                        })
                }));
            } else {
                res.send({ message: "Collection has no items" });
            }
        })
        .then(() => {
            return attempt.student.get()
        })
        .then((studentSnapshot: DocumentSnapshot) => {
            if(studentSnapshot.exists) {
                attempt.student = studentSnapshot.data();
                attempt.student._path = studentSnapshot.ref.path;
                return attempt.brick.get();
            } else {
                res.send({ message: "Document not found" })
            }
        })
        .then((brickSnapshot: DocumentSnapshot) => {
            if(brickSnapshot.exists) {
                attempt.brick = brickSnapshot.data();
                attempt.brick.pallet = null;
                attempt.brick._path = brickSnapshot.ref.path;
                res.send(attempt);
            } else {
                res.send({ message: "Document not found" });
            }
        });
});

server.post('/brickattempt', (req, res, next) => {
    // TODO: Change header to environment variable.
    console.log(req.body);
    let data = req.body;

    // TODO: Marking Process

    let brick = Object.assign({}, data);
    delete brick.answers;

    brick.student = db.doc(data.student);
    brick.brick = db.doc(data.brick);

    db.collection('brickattempts').add(brick)
        .then((studentbrick: DocumentReference) => {
            let answersRef = studentbrick.collection('answers');
            return Promise.all(data.answers.map((answerData: any, index: number) => {
                answersRef.add(answerData);
            }));
        })
        .then(() => {
            console.log("added thing")
            res.status(200);
            res.send({ message: "Operation successful" });
        })
        .catch((reason: any) => {
            res.send(reason);
        })
})
*/

server.listen(port, function() {
    console.log("%s listening at %s", server.name, server.url);
});