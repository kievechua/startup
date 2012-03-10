childProcess = require 'child_process'

module.exports =
    constructor: (deps)->
        if !deps?
            throw new Error 'No dependencies in command.js'

        childProcess = require 'child_process'

        socket = deps.socket

        fork = childProcess.spawn 'bash'

        fork.stdout.on 'data', (data)->
            if data
                socket.emit           'webinal', data.toString()
                socket.broadcast.emit 'webinal', data.toString()

        fork.stderr.on 'data', (data)->
            if data
                socket.emit           'webinal', data.toString()
                socket.broadcast.emit 'webinal', data.toString()

        fork.on 'exit', (data)->
            if data
                socket.emit           'webinal', data.toString()
                socket.broadcast.emit 'webinal', data.toString()

        run: (command)->
            fork.stdin.write command + '\n'
            return