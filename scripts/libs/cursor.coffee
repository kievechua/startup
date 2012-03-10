module.exports = class Cursor
    up: (line)->
        console.log '\033[' + line + 'A'

    clear: (line)->
        console.log '\033[' + line + 'J'

    clearLine: (line)->
        console.log '\033[' + line + 'K'

    move: (x, y)->
        if !x
            x = ''
        if !y
            y = ''
        console.log '\033[' + x + '' + y + 'H'

    hide: ->
        console.log '\033[?25l'
        console.log '\033[2F'