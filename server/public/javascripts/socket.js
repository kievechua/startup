var socket;

$(document).ready(function () {
    'use strict';

    socket = io.connect('http://localhost');

    socket.emit('config');

    socket.on('config', function (data) {
        var index, length, row;

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw e;
        }

        function _render(output) {
            $('#' + output.ns).prepend('<pre>' + output.data + '</pre>');
        }

        length = data.length;
        for (index = 0; index < length; index++) {
            row = data[index];
            socket.on(row, _render);
        }
    });

    socket.on('sidebar', function (data) {
        var key;

        if (data) {
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    $('#' + key).html(data[key]);
                }
            }
        }
    });

    socket.on('mem', function (data) {
        $('#mem').html(data);
    });

    socket.on('uptime', function (data) {
        $('#uptime').html(data);
    });
});