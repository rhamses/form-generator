/**
* Hat tip to PumBaa80 http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript 
* for the syntax highlighting function.
* 
* View this code running on http://jsfiddle.net/faffyman/KRb8W/ 
* 
**/

jsonDisplay = {

    jsonstring : '' ,
    outputDivID : 'shpretty',
    
    outputPretty: function (jsonstring) {
        jsonstring = jsonstring=='' ? jsonDisplay.jsonstring : jsonstring;
        // prettify spacing
        var pretty  = JSON.stringify(JSON.parse(jsonstring),null,2);
        // syntaxhighlight the pretty print version
        shpretty = jsonDisplay.syntaxHighlight(pretty);
        //output to a div
        // This could be a one liner with jQuery 
        // - but not making assumptions about jQuery or other library being available.
        newDiv = document.createElement("pre");
        newDiv.innerHTML = shpretty;
        return newDiv.outerHTML;
        // document.getElementById(jsonDisplay.outputDivID).appendChild(newDiv);
    },
    
    syntaxHighlight : function (json) {
        
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                  cls = 'key';
                } else {
                  cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
}



/**
 * Example Usage
 * // could be returned from an API or ajax call using library of choice
 * var myjson = '{"a": "First letter of the alphabet","0": "is it the first number?","object": {"B": "2nd letter","1": "maybe this is the first number"},"array": ["A", "b", "C", "d", "E", "f", "can you guess the rest?"],"numericarray":[0,2,4,6,8]}';
 *
 * // set json text
 * jsonDisplay.jsonstring = myjson;
 * 
 * // set output destination 
 * jsonDisplay.outputDivID = "myoutputdiv" ;
 * 
 * //prettify,highlight and output with set jsonstring
 * jsonDisplay.outputPretty();
 * 
 * // Output opretty highlighted by passing jsonstring into function.
 * jsonDisplay.outputPretty(myjson);
 *
 **/