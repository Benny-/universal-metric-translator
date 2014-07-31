
//  \d+(\.\d+)?\s+word
// Flags: global, insensitive
var createTransformationRegEx = function(unit) {
    return new RegExp("\\d+(\\.\\d+)?\\s*" + unit, "gi");
};

var tranformationTable = [
    // Distance
    {
        from: 'inche',
        to: 'meter',
        conversation: 0.3048,
    },
    {
        from: 'feet',
        to: 'meter',
        conversation: 0.9144,
    },
    {
        from: 'yard',
        to: 'meter',
        conversation: 20.1168,
    },
    {
        from: 'mile',
        to: 'meter',
        conversation: 1.6093,
    },
    {
        from: 'thou',
        to: 'mm',
        conversation: 25.4,
    },
    //Weight
    {
        from: 'pound',
        to: 'gram',
        conversation: 453.59,
    },
    {
        from: 'ounce',
        to: 'gram',
        conversation: 28.350,
    },
    // Currency
    {
        from: 'dollar',
        to: 'euro',
        conversation: 0.75, // NOTE: This conversation depends on exchange rates. It will vary over time.
    },
];

tranformationTable.forEach(function (transformationRule) {
    transformationRule.regex = createTransformationRegEx(transformationRule.from);
});

var replaceSubstring = function(originalText, index, length, replacement) {
    var before_substring = originalText.substring(0, index);
    var after_substring = originalText.substring(index+length);
    return before_substring + replacement + after_substring;
};

function round_number(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

// The transformText function is idempotent.
// Repeated calls on the output will do nothing. Only the first invocation has any effect.
// The input will be returned on repeated calls.
var transformText = function(text) {
    tranformationTable.forEach(function (transformationRule) {
       var match = null;
       transformationRule.regex.lastIndex = 0;
        do
        {
            match = transformationRule.regex.exec(text);
            if(match)
            {
               var new_value = round_number(parseFloat(match[0]) * transformationRule.conversation, 2);
               var new_unit = transformationRule.to;
               var new_substring = "" + new_value + " " + new_unit;
               
               text = replaceSubstring(text, match.index, match[0].length, new_substring );
               
               // Move the matching index past whatever we have replaced.
               // Note: The replacement can be shorter or longer.
               transformationRule.regex.lastIndex = transformationRule.regex.lastIndex + (new_substring.length - match[0].length);
            }
        } while(match);
    });
    return text;
};

