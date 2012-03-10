var app, express, fs, io, routes, sio, socket;

express = require('express');
routes  = require('./routes');
sio     = require('socket.io');
fs      = require('fs');
socket  = require(__dirname + '/libs/socket');

app = module.exports = express.createServer();

io = sio.listen(app);

app.configure(function () {
    app.set('views',       __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions : true,
        showStack      : true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.listen(3001);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

app.get('/',        routes.index);
app.get('/setting', routes.setting);

socket.constructor({
    io: io
});