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
    // TODO: Change header to environment variable.
    res.header('Access-Control-Allow-Origin', '*');
    db.collection('bricks').doc(req.params.id).get()
        .then((b) => {
            brick = b.data();
            brick.pallet.get().then((pallet) => {
                brick.pallet = pallet.data();
                brick.pallet.bricks = [];
                res.send(brick);
            })
        });
});

server.get('/studentbrick/:id', (req, res, next) => {
    // TODO: Change header to environment variable.
    res.header('Access-Control-Allow-Origin', '*');
    db.collection('studentbricks').doc(req.params.id).get()
        .then((b) => {
            studentbrick = b.data();
            studentbrick.brick.get().then((brick) => {
                studentbrick.brick = brick.data();
                studentbrick.brick.pallet = null;
                res.send(studentbrick);
            })
        });
});

server.listen(port, function() {
    console.log("%s listening at %s", server.name, server.url);
});