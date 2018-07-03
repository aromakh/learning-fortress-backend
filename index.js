const restify = require('restify');
const admin = require('firebase-admin');

const servicePath = require('./key/learning-fortress-firebase-adminsdk-1qpqj-4f47ca143b.json')

admin.initializeApp({
    credential: admin.credential.cert(servicePath),
    databaseURL: 'https://learning-fortress.firebaseio.com'
});
var db = admin.firestore();

var server = restify.createServer({
    name: 'learning-fortress-backend',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/hello', function(req, res, next) {
    res.send({ message: 'Hello World!' });
    return next();
})

server.get('/brick/:id', (req, res, next) => {
    db.collection('bricks').doc(req.params.id).get()
        .then((b) => {
            brick = b.data();
            Promise.all(brick.questions.map(async (question, i) => {
                await question.component.get().then((component) => {
                    brick.questions[i].component = component.data();
                })
            })).then(() => {
                res.send(brick);
            });
        });
});

server.listen(8080, function() {
    console.log("%s listening at %s", server.name, server.url);
});