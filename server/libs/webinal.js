var childProcess;

childProcess = require('child_process');

module.exports = {
    constructor: function (deps) {
        var fork, socket;

        if (!(deps != null)) {
            throw new Error('No dependencies in command.js');
        }

        childProcess = require('child_process');

        socket = deps.socket;

        fork = childProcess.spawn('bash');

        fork.stdout.on('data', function (data) {
            if (data) {
                socket.emit(          'webinal', data.toString());
                socket.broadcast.emit('webinal', data.toString());
            }
        });

        fork.stderr.on('data', function (data) {
            if (data) {
                socket.emit(          'webinal', data.toString());
                socket.broadcast.emit('webinal', data.toString());
            }
        });

        fork.on('exit', function (data) {
            if (data) {
                socket.emit(          'webinal', data.toString());
                socket.broadcast.emit('webinal', data.toString());
            }
        });

        return {
            run: function (command) {
                fork.stdin.write(command + '\n');
            }
        };
    }
};