
// ┌─┐┌─┐┌─┐  ┌─┐┌─┐┬─┐  ┬┌─┌─┐┌┬┐┌─┐┌┬┐┬┌─┐  ┌─┐┌┬┐┬┌┬┐┌─┐┬─┐
// │  └─┐└─┐  ├┤ │ │├┬┘  ├┴┐├─┤ │ │ ││││││    ├┤  │││ │ │ │├┬┘
// └─┘└─┘└─┘  └  └─┘┴└─  ┴ ┴┴ ┴ ┴ └─┘┴ ┴┴└─┘  └─┘─┴┘┴ ┴ └─┘┴└─
// css for Katomic editor

// Function to dynamically add CSS rules to the document
function addCSSRules(rules) {
    const styleSheet = document.createElement("style")
    document.head.appendChild(styleSheet)
    
    rules.forEach(rule => {
        styleSheet.sheet.insertRule(`.cm-${rule.className} { ${rule.css} }`, styleSheet.sheet.cssRules.length);
    })
}

CodeMirror.defineMode('modeKatomic', function() {
    //console.log("modeKatomic loaded.")
    
    // Define an array of regex-class pairs with corresponding CSS
    const rules = [
        { regex: /(\d+\.\d+\.\d+)/, className: 'hentity', css: 'color: purple;' },
        { regex: /\btestnet\b/, className: 'network-testnet', css: 'color: #ff00bf; font-weight: bold;' },
        { regex: /\bmainnet\b/, className: 'network-mainnet', css: 'color: #0000ff; font-weight: bold;' },
        { regex: /\bis\b/, className: 'verb', css: 'color: grey;' },
        { regex: /\bsends\b/, className: 'verb', css: 'color: grey;' },
        { regex: /\breceives\b/, className: 'verb', css: 'color: grey;' },
        { regex: /^(\/\/|#).*/, className: 'kcomment', css: 'color: green;' }, // Matches lines starting with "//" or "#"
        { regex: /^(display|constants|conditions|parameters|api)\b/, className: 'kkeyword', css: 'color: blue;' },         
        { regex: /\{[a-zA-Z_]+\}/, className: 'kvar', css: 'color: purple;' },
        
        
    ]

    // Add CSS rules to the document
    addCSSRules(rules)

    return {
        token: function(stream) {
            for (let i = 0; i < rules.length; i++) {
                if (stream.match(rules[i].regex)) {
                    return rules[i].className;
                }
            }
            stream.next()  // Move to the next character
            return null  // No styling if no pattern matches
        }
    }
})

CodeMirror.defineMIME('text/katomic', 'modeKatomic')



/*
ideas if looking to recycle regex from katomic.js

// Function to dynamically add CSS rules to the document
function addCSSRules(rules) {
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    
    rules.forEach(rule => {
        Object.keys(rule.css).forEach(key => {
            styleSheet.sheet.insertRule(`.cm-${key} { ${rule.css[key]} }`, styleSheet.sheet.cssRules.length);
        });
    });
}

CodeMirror.defineMode('modeKatomic', function() {
    console.log("Custom mode loaded.");
    
    // Define an array of regex with named captures and corresponding CSS classes
    const rules = [
        {
            regex: /(?<accountId>buyer|\d+\.\d+\.\d+|{[a-z0-9_-]+}) (?<verb>receives|sends) (?<value>[\w\-+/*.{}]+) (?<unit>hbar|h)/i,
            css: {
                accountId: 'color: blue;',
                verb: 'color: green; font-weight: bold;',
                value: 'color: purple;',
                unit: 'color: red;'
            }
        }
    ];

    // Add CSS rules to the document
    addCSSRules(rules);

    return {
        token: function(stream) {
            for (let i = 0; i < rules.length; i++) {
                const match = stream.match(rules[i].regex, false); // Use false to avoid consuming the match
                if (match) {
                    const captures = match.groups;
                    for (const capture in captures) {
                        if (captures[capture]) {
                            stream.match(captures[capture]);
                            return capture;
                        }
                    }
                }
            }
            stream.next();  // Move to the next character
            return null;  // No styling if no pattern matches
        }
    };
});

CodeMirror.defineMIME('text/katomic', 'modeKatomic');



*/