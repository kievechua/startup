var fs;

fs = require('fs');

exports.index = function (req, res) {
    var conf, config, data, key;

    conf = {};

    try {
        config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf8'));
    } catch (e) {
        console.log(e);
    }

    for (key in config) {
        conf[key] = {};

        for (data in config[key]) {
            if (data !== 'command') {
                conf[key][data] = config[key][data];
            }
        }
    }

    res.render('index', {
        ns      : conf,
        home    : 'active',
        setting : '',
        links   : ['/javascripts/index.js']
    });
};

exports.setting = function (req, res) {
    var config;

    try {
        config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf8'));
    } catch (e) {
        console.log(e);
    }

    res.render('setting', {
        ns      : config,
        home    : '',
        setting : 'active',
        links   : ['/javascripts/libs/jquery.validate.min.js', '/javascripts/setting.js']
    });
};