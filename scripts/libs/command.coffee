module.exports =
    constructor: (deps)->
        if !deps?
            throw new Error 'No dependencies in command.js'

        childProcess = require 'child_process'

        namespace = deps.config.namespace
        command   = deps.config.command
        socket    = deps.socket

        process = null

        start: ()->
            process = childProcess.exec command
            process.stdout.setEncoding 'utf8'
            process.stderr.setEncoding 'utf8'

            this.show()

            socket.emit           'start-callback', namespace
            socket.broadcast.emit 'start-callback', namespace
            return

        restart: ()->
            self = this

            self.stop()

            setTimeout ()->
                self.start()

                socket.emit           'restart-callback', namespace
                socket.broadcast.emit 'restart-callback', namespace
            , 1000
            return

        stop: ()->
            try
                process.kill()
            catch error
                console.log error

            socket.emit           'stop-callback', namespace
            socket.broadcast.emit 'stop-callback', namespace
            return

        show: ()->
            if process?
                # Display log
                process.stdout.on 'data', (data)->
                    data =
                        ns   : namespace
                        data : data

                    socket.emit           namespace, data
                    socket.broadcast.emit namespace, data
                    return

                # Display error
                process.stderr.on 'data', (data)->
                    data =
                        ns   : namespace
                        data : data

                    socket.emit           namespace, data
                    socket.broadcast.emit namespace, data
                    return

            socket.emit           'start-callback', namespace
            socket.broadcast.emit 'start-callback', namespace
            return