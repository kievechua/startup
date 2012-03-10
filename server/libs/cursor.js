var Cursor;

module.exports = Cursor = (function () {

    function Cursor() {}

    Cursor.prototype.up = function (line) {
        console.log('\033[' + line + 'A');
    };

    Cursor.prototype.clear = function (line) {
        console.log('\033[' + line + 'J');
    };

    Cursor.prototype.clearLine = function (line) {
        console.log('\033[' + line + 'K');
    };

    Cursor.prototype.move = function (x, y) {
        if (!x) {
            x = '';
        }

        if (!y) {
            y = '';
        }

        console.log('\033[' + x + '' + y + 'H');
    };

    Cursor.prototype.hide = function () {
        console.log('\033[?25l');
        console.log('\033[2F');
    };

    return Cursor;

})();