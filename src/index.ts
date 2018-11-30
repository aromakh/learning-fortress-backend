import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';

import { Pallet, Brick, BrickAttempt } from './bricks';
import { DocumentSnapshot, DocumentReference, QuerySnapshot } from '@google-cloud/firestore';

var port = process.env.PORT || 3000;

var server = restify.createServer({
    name: 'learning-fortress-backend',
    version: '1.0.0'
});

const cors = corsMiddleware({
    preflightMaxAge: 6000,
    origins: [new RegExp('.*')],
    allowHeaders: ['Content-Type'],
    exposeHeaders: [],
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);

var brickRouter = require('./routes/brick');
var brickattemptRouter = require('./routes/brickattempt');
brickRouter.applyRoutes(server, '/brick');
brickattemptRouter.applyRoutes(server, '/brickattempt');

server.listen(port, function() {
    console.log("%s listening at %s", server.name, server.url);
});