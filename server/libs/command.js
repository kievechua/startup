module.exports = {
    constructor: function (deps) {
        var childProcess, command, namespace, process, socket;

        if (!(deps != null)) {
            throw new Error('No dependencies in command.js');
        }

        childProcess = require('child_process');

        namespace = deps.config.namespace;
        command   = deps.config.command;
        socket    = deps.socket;

        process = null;

        return {
            start: function () {
                process = childProcess.exec(command);

                process.stdout.setEncoding('utf8');
                process.stderr.setEncoding('utf8');

                this.show();

                socket.emit(          'start-callback', namespace);
                socket.broadcast.emit('start-callback', namespace);
            },

            restart: function () {
                var self;

                self = this;
                self.stop();

                setTimeout(function () {
                    self.start();

                    socket.emit(          'restart-callback', namespace);
                    socket.broadcast.emit('restart-callback', namespace);
                }, 1000);
            },

            stop: function () {
                try {
                    process.kill();
                } catch (error) {
                    console.log(error);
                }

                socket.emit(          'stop-callback', namespace);
                socket.broadcast.emit('stop-callback', namespace);
            },

            show: function () {
                if (process != null) {
                    process.stdout.on('data', function (data) {
                        data = {
                            ns   : namespace,
                            data : data
                        };

                        socket.emit(          namespace, data);
                        socket.broadcast.emit(namespace, data);
                    });

                    process.stderr.on('data', function (data) {
                        data = {
                            ns   : namespace,
                            data : data
                        };

                        socket.emit(          namespace, data);
                        socket.broadcast.emit(namespace, data);
                    });
                }

                socket.emit(          'start-callback', namespace);
                socket.broadcast.emit('start-callback', namespace);
            }
        };
    }
};