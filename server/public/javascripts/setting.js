$(document).ready(function () {
    'use strict';

    $('#setting-form').submit(function (e) {
        var data, $fields, $form, formLength, unique, sumError;

        e.preventDefault();

        data     = JSON.stringify($(this).serializeArray());
        $form    = $(this);
        $fields  = $form.find('input:text');
        unique   = [];
        sumError = false;

        // Simple form Validation
        formLength = $fields.length;
        $fields.each(function (index, element) {
            var $field, $wraper, value, error;

            $field  = $(element);
            $wraper = $field.parent().parent();
            value   = $field.val();
            error   = false;

            if ($field.hasClass('required') && !value) {
                error    = true;
                sumError = true;
                $wraper.addClass('error');
                $field.addClass('error').after('<span class="help-inline">Required</span>');
            } else if ($field.hasClass('unique') && unique.indexOf(value) > -1) {
                error    = true;
                sumError = true;
                $wraper.addClass('error');
                $field.addClass('error').after('<span class="help-inline">Not unique</span>');
            }

            unique.push(value);

            if (!error) {
                $wraper
                    .removeClass('error')
                    .find('span').remove();
            }

            if (index === (formLength - 1) && !sumError) {
                $form.find('input[type="submit"]').button('loading');
                socket.emit('setting-save', data);
            }
        });

        return false;
    });

    $('button#delete-setting').live('click', function () {
        $(this).parent().parent().remove();
    });

    $('button[name="add-setting"]').click(function (e) {
        var template;

        e.preventDefault();

        template = '<div><div class="clearfix"><label>Name</label><div class="input"><input type="text" name="name" class="xxlarge required unique"></div></div>';
        template += '<div class="clearfix"><label>Label</label><div class="input"><input type="text" name="label" class="xxlarge required"></div></div>';
        template += '<div class="clearfix"><label>Command</label><div class="input"><input type="text" name="command" class="xxlarge required" placeholder="cd /Users/me/github/myProject; node app.js;"></div></div>';
        template += '<div class="clearfix"><label>(Optional)&nbsp;Link</label><div class="input"><input type="text" name="link" class="xxlarge"></div></div>';
        template += '<div class="clearfix input"><button id="delete-setting" class="btn danger">Delete</button></div><br></div>';

        $(template).insertBefore($(this).parent());
    });

    socket.on('setting-save-callback', function (data) {
        $('#setting-form input[type="submit"]').button('reset');
    });
});