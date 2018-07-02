var restify = require('restify');

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

server.listen(8080, function() {
    console.log("%s listening at %s", server.name, server.url);
});