fs = require 'fs'

exports.index = (req, res)->
    conf   = {}

    try
        config = JSON.parse fs.readFileSync __dirname + '/../config.json', 'utf8'
    catch e
        console.log e

    for key of config
        conf[key] = {}
        for data of config[key]
            if data != 'command'
                conf[key][data] = config[key][data]

    res.render 'index',
        ns      : conf
        home    : 'active'
        setting : ''
        links   : ['/javascripts/index.js']

exports.setting = (req, res)->
    try
        config = JSON.parse fs.readFileSync __dirname + '/../config.json', 'utf8'
    catch e
        console.log e

    res.render 'setting',
        ns      : config
        home    : ''
        setting : 'active'
        links   : [
            '/javascripts/libs/jquery.validate.min.js'
            '/javascripts/setting.js'
        ]