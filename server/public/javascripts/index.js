$(document).ready(function () {
    'use strict';

    var availableTags;

    availableTags = [];

    $('.tabs').tabs();

    $('[rel="twipsy"]').each(function () {
        $(this).twipsy({
            trigger : 'manual'
        });
    });

    $('input[name="webinal"]')
        .focus()
        .autocomplete({
            source : function (request, response) {
                // response(availableTags);
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.grep( availableTags, function( value ) {
                    value = value.label || value.value || value;
                    return matcher.test( value );
                }) );
            }
        });

    $('button').click(function (e) {
        var $this;

        e.preventDefault();

        $this = $(this);

        $this.button('loading');
        socket.emit($this.attr('name'), $this.val());
    });

    $('#webinal-form').submit(function (e) {
        var form, value;

        e.preventDefault();

        form  = $(this).find('input[name="webinal"]');
        value = form.val();

        if (0 > availableTags.indexOf(value)) {
            availableTags.push(value);
        }

        $('#webinal').prepend('<div class="alert-message block-message">' + value + '</div>');

        socket.emit('webinal', value);

        form.val('');
    });

    $(document).bind('keypress', function (event) {
        var tabNum, link;

        if (true === event.ctrlKey) {
            switch (event.keyCode) {
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                // Switch between tabs
                tabNum = event.keyCode - 48;
                $('.tabs li:nth-child(' + tabNum + ')').find('a').click();
                break;
            case 20:
                // Open link
                link = $('.pill-content div.active a.open').attr('href');

                if (link) {
                    window.open(link, '_blank');
                }
                break;
            case 8:
                $('[rel="twipsy"]').each(function () {
                    var $this;

                    $this = $(this);

                    $this.twipsy('show');

                    setTimeout(function () {
                        $this.twipsy('hide');
                    }, 1500);
                });
                break;
            case 19:
                // Start server
                if ('webinal-tab' === $('.pill-content div.active').attr('id')) {
                    $('input[name="webinal"]').focus();
                } else {
                    $('.pill-content div.active button[name="start"]').click();
                }
                break;
            case 18:
                // Restart server
                $('.pill-content div.active button[name="restart"]').click();
                break;
            case 3:
                // Stop server
                $('.pill-content div.active button[name="stop"]').click();
                break;
            }
        }
    });

    socket.on('webinal', function (output) {
        $('#webinal').prepend('<pre>' + output + '</pre>');
    });

    socket.on('start-callback', function (data) {
        $('button[name="start"][value="' + data + '"]')
            .button('reset')
            .addClass('disabled')
            .attr('disabled', 'disabled')
            .text('Started');

        $('button[name="stop"][value="' + data + '"]')
            .removeAttr('disabled')
            .removeClass('disabled')
            .text('Stop');
    });

    socket.on('restart-callback', function (data) {
        $('button[name="restart"][value="' + data + '"]')
            .removeAttr('disabled')
            .removeClass('disabled')
            .text('Restart');
    });

    socket.on('stop-callback', function (data) {
        $('button[name="stop"][value="' + data + '"]')
            .button('reset')
            .addClass('disabled')
            .attr('disabled', 'disabled')
            .text('Stoped');

        $('button[name="start"][value="' + data + '"]')
            .removeAttr('disabled')
            .removeClass('disabled')
            .text('Start');
    });
});