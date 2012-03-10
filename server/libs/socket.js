module.exports = {
    constructor: function (deps) {
        var command, convertor, fs, io, models, os, wbl, webinal;

        if (!(deps != null)) {
            throw new Error('No dependencies in socket.js');
        }

        os = require('os');
        fs = require('fs');

        command   = require(__dirname + '/command');
        wbl       = require(__dirname + '/webinal');
        convertor = new(require('./convertor'));

        io = deps.io;

        models  = {};
        webinal = null;

        io.configure(function () {
            io.set('log level', 1);
        });

        io.sockets.on('connection', function (socket) {
            var sidebar;

            sidebar = {
                type     : os.type(),
                platform : os.platform(),
                arch     : os.arch(),
                release  : os.release(),
                host     : os.hostname(),
                uptime   : convertor.second(os.uptime()),
                tmem     : convertor.bytes(os.totalmem()),
                mem      : convertor.bytes(os.freemem())
            };

            if (os.networkInterfaces().en1 != null) {
                sidebar.ip = os.networkInterfaces().en1[1].address;
            }

            socket.emit('sidebar', sidebar);

            setInterval(function () {
                socket.emit('uptime', convertor.second(os.uptime()));
                socket.emit('mem',    convertor.bytes(os.freemem()));
            }, 1000);

            socket.on('config', function () {
                var config, key, namespace, ns;

                ns     = [];
                config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf8'));

                for (namespace in config) {
                    if (!models.hasOwnProperty(namespace)) {
                        models[namespace] = command.constructor({
                            socket : socket,
                            config : {
                                namespace : namespace,
                                command   : config[namespace].command
                            }
                        });
                    }
                }

                for (key in config) {
                    ns.push(key);
                }

                socket.emit('config', JSON.stringify(ns));
            });

            if (!webinal) {
                webinal = wbl.constructor({
                    socket: socket
                });
            }

            socket.on('start', function (data) {
                var namespace;

                if (data != null) {
                    if ('all' === data) {
                        for (namespace in models) {
                            models[namespace].start();
                        }

                        socket.emit(          'start-callback', data);
                        socket.broadcast.emit('start-callback', data);
                    } else {
                        if (models[data] != null) {
                            return models[data].start();
                        }
                    }
                }
            });

            socket.on('restart', function (data) {
                var namespace;

                if (data != null) {
                    if ('all' === data) {
                        for (namespace in models) {
                            models[namespace].restart();
                        }

                        socket.emit(          'restart-callback', data);
                        socket.broadcast.emit('restart-callback', data);
                    } else {
                        if (models[data] != null) {
                            return models[data].restart();
                        }
                    }
                }
            });

            socket.on('stop', function (data) {
                var namespace;

                if (data != null) {
                    if ('all' === data) {
                        for (namespace in models) {
                            models[namespace].stop();
                        }

                        socket.emit(          'stop-callback', data);
                        socket.broadcast.emit('stop-callback', data);
                    } else {
                        if (models[data] != null) {
                            return models[data].stop();
                        }
                    }
                }
            });

            socket.on('webinal', function (data) {
                webinal.run(data);
            });

            socket.on('setting-save', function (data) {
                var current, field, i, setting, _len;

                setting = {};

                if (data) {
                    data = JSON.parse(data);

                    for (i = 0, _len = data.length; i < _len; i++) {
                        field = data[i];

                        if (field.name) {
                            if ('name' === field.name) {
                                current = field.value;
                                setting[current] = {};
                            } else if (field.value) {
                                setting[current][field.name] = field.value;
                            }
                        }
                    }

                    setting = JSON.stringify(setting);

                    return fs.writeFile(__dirname + '/../config.json', setting, function (err) {
                        if (err) {
                            throw err;
                        }

                        socket.emit('setting-save-callback', 'success');
                    });
                }
            });
        });
    }
};