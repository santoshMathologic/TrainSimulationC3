var convertDateTimeObjToNumber = function(dateTimeObj, target) {
    if (dateTimeObj === null || typeof dateTimeObj !== 'object') {
        throw new Error("Not valid dateTimeObject passed to convertDateTimeObj()");
    }
    if (dateTimeObj.day === null || dateTimeObj.time === null) {
        throw new Error("Not valid dateTimeObject passed to convertDateTimeObj()");
    }
    if (target == null) {
        target = "";
    }
    target = target.toLowerCase();

    var timeParts = dateTimeObj.time.split(':');
    timeParts[0] = parseInt(timeParts[0]);
    timeParts[1] = parseInt(timeParts[1]);
    if((timeParts[0]>23 || timeParts[0]<0)&&(timeParts[1]>59 || timeParts[1]<0)){
        throw new Error("Not valid dateTimeObj.time passed to convertDateTimeObj()");
    }

    var mins = (dateTimeObj.day * 1440)
        + (timeParts[0] * 60)
        + (timeParts[1]);

    var result = null;
    switch (target) {
        case 'mins': case 'min': case 'minutes': case 'minute':
            result = mins;
            break;
        case 'hrs': case 'hr': case 'hours': case 'hour':
            result = (mins / 60);
            break;
        case 'days': case 'day':
            result = (mins / 1440);
            break;
        default:
            result = mins;
            break;
    }
    return result;
}

var convertNumberToDateTimeObj = function(number, type) {
    if (type == null) {
        type = "";
    }
    type = type.toLowerCase();

    if (number == null) {
        throw new Error("Number not sent to convertNumberToDateTimeObj()");
    }
    var day = -1;
    var hrs = -1;
    var mins = -1;
    switch (type) {
        case 'mins': case 'min': case 'minutes': case 'minute':
            day = Math.floor(number / 1440);
            number = number % 1440;
            hrs = Math.floor(number / 60);
            number = number % 60;
            mins = Math.floor(number);
            if (mins > 60) {
                throw new Error("Number not in correct type given");
            }
            break;
        case 'hrs': case 'hr': case 'hours': case 'hour':
            day = Math.floor(number / 1440);
            number = number % 1440;
            hrs = Math.floor(number / 60);
            if (hrs > 24) {
                throw new Error("Number not in correct type given");
            }
            break;
        case 'days': case 'day':
            day = Math.floor(number / 1440);
            if (day > 24) {
                throw new Error("Number not in correct type given");
            }
            break;
        default:
            day = Math.floor(number / 1440);
            number = number % 1440;
            hrs = Math.floor(number / 60);
            number = number % 60;
            mins = Math.floor(number);
            if (mins > 60) {
                throw new Error("Number not in correct type given");
            }
            break;
    }
    var result = {};
    if (day != -1) {
        result.days = day;
        result.day = day % 7;
    }
    if (hrs != -1 && mins == -1) {
        result.time = (hrs < 10) ? '0' : '' + hrs + ':00';
    }
    else if (hrs != -1 && mins != -1) {
        result.time = "";
        result.time += ((hrs < 10) ? '0' : '') + hrs.toString();
        result.time += ':' + ((mins < 10) ? '0' : '') + mins.toString();
    }
    return result;
}

var addDateTimeObj = function(dateTimeObj, number, operation, type) {
    if (type == null) {
        type = "";
    }
    if (operation == null) {
        operation = "+";
    }
    type = type.toLowerCase();
    operation = operation.toLowerCase();

    if (isNaN(number)) {
        throw new Error("Number is not proper in addDateTimeObj()");
    }
    var timeNo = null;
    var resultNo = null;
    var resultObj = null;
    timeNo = convertDateTimeObjToNumber(dateTimeObj, "min");
    switch (operation) {
        case '+': case 'plus': case 'add': case 'addition':
            resultNo = timeNo + number;
            // switch (type) {
            //     case 'mins': case 'min': case 'minutes': case 'minute':
            //         resultNo = (resultNo % 10080);
            //         break;
            //     case 'hrs': case 'hr': case 'hours': case 'hour':
            //         resultNo = (resultNo % 168);
            //         break;
            //     case 'days': case 'day':
            //         resultNo = (resultNo % 7);
            //         break;
            //     default:
            //         resultNo = (resultNo % 10080);
            //         break;
            // }
            break;
        case '-': case 'minus': case 'sub': case 'subtract': case 'subtraction':
            resultNo = timeNo - number;
            if (resultNo < 0) {
                switch (type) {
                    case 'mins': case 'min': case 'minutes': case 'minute':
                        var q = Math.floor(Math.abs(resultNo) / 10080);
                        q += 1;
                        resultNo = ((10080 * q) + resultNo);
                        break;
                    case 'hrs': case 'hr': case 'hours': case 'hour':
                        var q = Math.floor(Math.abs(resultNo) / 10080);
                        q += 1;
                        resultNo = ((168 * q) + resultNo);
                        break;
                    case 'days': case 'day':
                        var q = Math.floor(Math.abs(resultNo) / 10080);
                        q += 1;
                        resultNo = ((7 * q) + resultNo);
                        break;
                    default:
                        var q = Math.floor(Math.abs(resultNo) / 10080);
                        q += 1;
                        resultNo = ((10080 * q) + resultNo);
                        break;
                }
            }
            break;
        default:
            resultNo = timeNo + number;
            break;
    }
    resultObj = convertNumberToDateTimeObj(resultNo, "min");
    return resultObj;
}

var diffDateTimeObj = function(fromObj, toObj, unit) {
    if (fromObj === null || typeof fromObj !== 'object') {
        throw new Error("Not valid fromObj passed to diffDateTimeObj()");
    }
    if (fromObj.day === null || fromObj.time === null) {
        throw new Error("Not valid fromObj passed to diffDateTimeObj()");
    }
    if (toObj === null || typeof toObj !== 'object') {
        throw new Error("Not valid toObj passed to diffDateTimeObj()");
    }
    if (toObj.day === null || toObj.time === null) {
        throw new Error("Not valid toObj passed to diffDateTimeObj()");
    }

    if (!unit) {
        unit = "";
    }
    unit = unit.toLowerCase();

    var from = convertDateTimeObjToNumber(fromObj, unit);
    var to = convertDateTimeObjToNumber(toObj, unit);
    var diff = to - from;
    var positive = true;
    if (diff < 0) {
        positive = false;
        switch (unit) {
            case 'mins': case 'min': case 'minutes': case 'minute':
                var q = Math.floor(Math.abs(diff) / 10080);
                q += 1;
                diff = ((10080 * q) + diff);
                break;
            case 'hrs': case 'hr': case 'hours': case 'hour':
                var q = Math.floor(Math.abs(diff) / 10080);
                q += 1;
                diff = ((168 * q) + diff);
                break;
            case 'days': case 'day':
                var q = Math.floor(Math.abs(diff) / 10080);
                q += 1;
                diff = ((7 * q) + diff);
                break;
            default:
                var q = Math.floor(Math.abs(diff) / 10080);
                q += 1;
                diff = ((10080 * q) + diff);
                break;
        }
    }
    var result = convertNumberToDateTimeObj(diff,unit);
    result.positive = positive;
    return result;
}

var timeCal = {
    convertDateTimeObjToNumber: convertDateTimeObjToNumber,
    convertNumberToDateTimeObj: convertNumberToDateTimeObj,
    addDateTimeObj: addDateTimeObj,
    diffDateTimeObj: diffDateTimeObj
}

module.exports = timeCal;