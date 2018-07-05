const restify = require('restify');
const admin = require('firebase-admin');

const servicePath = require('./key/learning-fortress-keys.js')


console.log(process.env.private_key);
var port = process.env.PORT || 3000;

console.log(servicePath.keys);
admin.initializeApp({
    credential: admin.credential.cert(servicePath.keys),
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
    res.header('Access-Control-Allow-Origin', '*');
    db.collection('bricks').doc(req.params.id).get()
        .then((b) => {
            brick = b.data();
            Promise.all(brick.questions.map(async (question, i) => {
                await question.component.get().then((component) => {
                    brick.questions[i].component = component.data();
                })
            })).then(() => {
                brick.pallet.get().then((pallet) => {
                    brick.pallet = pallet.data();
                    res.send(brick);
                })
            });
        });
});

server.listen(port, function() {
    console.log("%s listening at %s", server.name, server.url);
});