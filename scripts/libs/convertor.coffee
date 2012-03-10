module.exports = class Convertor
    bytes: (data)->
        if data > 1000000000
            result = (data / 1000000000) + ' GB'
        else if data > 1000000
            result = (data / 1000000) + ' MB'

    second: (data)->
        result = ''
        min    = 60
        hour   = 3600  # 60 * 60
        day    = 86400 # 24 * 3600

        if data > day
            dayDiff = Math.floor(data / day)
            data    = data - (dayDiff * day)
            result  += dayDiff
            result  += ' day '

        if data > hour
            hourDiff = Math.floor(data / hour)
            data     = data - (hourDiff * hour)
            result   += hourDiff
            result   += ' hour '

        if data > min
            minDiff = Math.floor(data / min)
            data    = data - (minDiff * min)
            result  += minDiff
            result  += ' min '

        result += Math.ceil(data) + ' sec '

        return result