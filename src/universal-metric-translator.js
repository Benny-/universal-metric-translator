
//  \b\d+(\.\d+)?\s+unit\b
// Flags: global, insensitive
var createTransformationRegEx = function(unit) {
    return new RegExp('\\b\\d+(\\.\\d+)?\\s*' + unit + '\\b', "gi");
};

// Sources:
// https://en.wikipedia.org/wiki/Imperial_units
// https://en.wikipedia.org/wiki/Metre
// https://en.wikipedia.org/wiki/Square_metre
// https://en.wikipedia.org/wiki/Litre
var tranformationTable = [
    
    // Temperature
    {
        from: '(F|fahrenheit|fahrenheits|degrees F|degrees fahrenheit)',
        to: '℃',
        conversation: function(fahrenheits){
            return ((fahrenheits - 32) / 1.8).toFixed(2);
        }
    },
    
    // Distance
    {
        from: 'thou',
        to: 'µm',
        conversation: 25.4,
    },
    {
        from: 'inch(es|e)?',
        to: 'mm',
        conversation: 25.4,
    },
    {
        from: '(feets?|foot)',
        to: 'm',
        conversation: 0.3048,
    },
    {
        from: '(yards?|yd)',
        to: 'm',
        conversation: 0.9144,
    },
    {
        from: 'chains?',
        to: 'm',
        conversation: 20.1168,
    },
    {
        from: '(furlongs?|fur)',
        to: 'm',
        conversation: 201.168,
    },
    {
        from: 'miles?',
        to: 'km',
        conversation: 1.609344,
    },
    {
        from: 'leagues?',
        to: 'km',
        conversation: 4.828032,
    },
    
    // Maritime distances
    {
        from: '(fathoms?|ftm)',
        to: 'm',
        conversation: 1.853184,
    },
    {
        from: 'cables?',
        to: 'm',
        conversation: 185.3184,
    },
    {
        from: 'nautical\\smiles?', // Note: two backslashes as we are escaping a javascript string
        to: 'km',
        conversation: 1.853184,
    },
    
    // Gunter's survey units (17th century onwards)
    {
        from: 'link',
        to: 'm',
        conversation: 0.201168,
    },
    {
        from: 'rod',
        to: 'm',
        conversation: 5.0292,
    },
    {
        from: 'chain',
        to: 'm',
        conversation: 20.1168,
    },
    
    // Area
    {
        from: 'acres?',
        to: 'km²',
        conversation: 4.0468564224,
    },
    
    // Volume
    {
        from: '(fluid ounces?|fl oz)',
        to: 'ml',
        conversation: 28.4130625,
    },
    {
        from: 'gill?',
        to: 'ml',
        conversation: 142.0653125,
    },
    {
        from: '(pints?|pt)',
        to: 'l',
        conversation: 0.56826125,
    },
    {
        from: 'quarts?',
        to: 'l',
        conversation: 1.1365225,
    },
    {
        from: 'gal(lons?)?',
        to: 'l',
        conversation: 4.54609,
    },
    
    //Weight
    {
        from: 'grains?',
        to: 'mg',
        conversation: 64.79891,
    },
    {
        from: 'drachm',
        to: 'g',
        conversation: 1.7718451953125,
    },
    {
        from: '(ounces?|oz)',
        to: 'g',
        conversation: 28.349523125,
    },
//    {
//        from: 'pounds?', // Pound is ambiguous. It can be a currency. Therefore we don't touch it.
//        to: 'g',
//        conversation: 453.59,
//    },
    {
        from: 'stones?',
        to: 'kg',
        conversation: 6.35029318,
    },
    {
        from: 'quarters?',
        to: 'kg',
        conversation: 12.70058636,
    },
    {
        from: 'hundredweights?',
        to: 'kg',
        conversation: 50.80234544,
    },
    //  A 'ton' might belong here, but there exist a metric ton and a imperial ton.
    
    // Currency
//    {
//        from: 'dollars?',
//        to: '€',
//        conversation: 0.75, // NOTE: This conversation depends on exchange rates. It will vary over time.
//    },
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
                var old_value = round_number(parseFloat(match[0]), 2)
                var new_value;
                
                if(typeof transformationRule.conversation == 'function')
                {
                    new_value = transformationRule.conversation(old_value);
                }
                else
                {
                    new_value = old_value * transformationRule.conversation;
                }
                
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

