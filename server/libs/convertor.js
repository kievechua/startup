var Convertor;

module.exports = Convertor = (function () {

    function Convertor() {}

    Convertor.prototype.bytes = function (data) {
        if (data > 1000000000) {
            return (data / 1000000000) + ' GB';
        } else if (data > 1000000) {
            return (data / 1000000) + ' MB';
        }
    };

    Convertor.prototype.second = function (data) {
        var day, dayDiff, hour, hourDiff, min, minDiff, result;

        result = '';
        min    = 60;
        hour   = 3600;
        day    = 86400;

        if (data > day) {
            dayDiff = Math.floor(data / day);
            data    = data - (dayDiff * day);
            result  += dayDiff;
            result  += ' day ';
        }

        if (data > hour) {
            hourDiff = Math.floor(data / hour);
            data     = data - (hourDiff * hour);
            result   += hourDiff;
            result   += ' hour ';
        }

        if (data > min) {
            minDiff = Math.floor(data / min);
            data    = data - (minDiff * min);
            result  += minDiff;
            result  += ' min ';
        }

        result += Math.ceil(data) + ' sec ';

        return result;
    };

    return Convertor;

})();