module.exports =
    constructor: (deps)->
        if !deps?
            throw new Error 'No dependencies in socket.js'

        os        = require 'os'
        fs        = require 'fs'
        command   = require __dirname + '/command'
        wbl       = require __dirname + '/webinal'
        convertor = new(require './convertor')

        io = deps.io

        models  = {}
        webinal = null

        io.configure ()->
            io.set 'log level', 1

        io.sockets.on 'connection', (socket)->
            sidebar =
                type     : os.type()
                platform : os.platform()
                arch     : os.arch()
                release  : os.release()
                host     : os.hostname()
                uptime   : convertor.second os.uptime()
                tmem     : convertor.bytes os.totalmem()
                mem      : convertor.bytes os.freemem()

            # Not showing ip if no network connection
            if os.networkInterfaces().en1?
                sidebar.ip = os.networkInterfaces().en1[1].address

            socket.emit 'sidebar', sidebar

            setInterval ->
                socket.emit 'uptime', convertor.second os.uptime()
                socket.emit 'mem',    convertor.bytes os.freemem()
            , 1000

            socket.on 'config', ()->
                ns     = []
                config = JSON.parse fs.readFileSync __dirname + '/../config.json', 'utf8'

                for namespace of config
                    if !models.hasOwnProperty(namespace)
                        models[namespace] = command.constructor(
                            socket : socket
                            config :
                                namespace : namespace
                                command   : config[namespace].command
                        )

                for key of config
                    ns.push key

                socket.emit 'config', JSON.stringify ns

            # Webminal
            if !webinal
                webinal = wbl.constructor(
                    socket : socket
                )

            socket.on 'start', (data)->
                if data?
                    if 'all' == data
                        for namespace of models
                            models[namespace].start()

                        socket.emit           'start-callback', data
                        socket.broadcast.emit 'start-callback', data
                    else
                        if models[data]?
                            models[data].start()

            socket.on 'restart', (data)->
                if data?
                    if 'all' == data
                        for namespace of models
                            models[namespace].restart()

                        socket.emit           'restart-callback', data
                        socket.broadcast.emit 'restart-callback', data
                    else
                        if models[data]?
                            models[data].restart()

            socket.on 'stop', (data)->
                if data?
                    if 'all' == data
                        for namespace of models
                            models[namespace].stop()

                        socket.emit           'stop-callback', data
                        socket.broadcast.emit 'stop-callback', data
                    else
                        if models[data]?
                            models[data].stop()

            socket.on 'webinal', (data)->
                webinal.run(data)

            socket.on 'setting-save', (data)->
                setting = {}

                if data
                    data = JSON.parse data

                    for field, i in data
                        if field.name
                            if 'name' == field.name
                                current = field.value
                                setting[current] = {}
                            else if field.value
                                setting[current][field.name] = field.value

                    setting = JSON.stringify setting

                    fs.writeFile __dirname + '/../config.json', setting, (err)->
                        if err
                            throw err

                        socket.emit 'setting-save-callback', 'success'

            return