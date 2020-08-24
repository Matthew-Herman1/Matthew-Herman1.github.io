// Using csv input,

const fs = require('fs');

let main = async function() {

    let inputFileName = '/Users/matthewherman/Desktop/cn-csv/html5blank-zh-hans.csv';

    let str = fs.readFileSync(inputFileName, 'utf8');
    fs.writeFileSync('./sampleInput.csv', str, 'utf-8');

    // let rows = str.split('\n');
    // let tablerows = [];

    // // Add columns with static value
    // let newCols = [
    //     ['"Site"', '"cn"'],
    //     ['"Type"', '"html5blank"']
    // ];

    // for (let i=0; i<5; i++) {
    //     console.log(rows[i]);
    // }

    // for (let i=0; i<rows.length; i++) {
    //     let row = rows[i];
    //     row = row.split('\t');

    //     // Add newCols
    //     if (i === 0) {
    //         // Add titles
    //         newCols.forEach( (newCol) => {
    //             row.unshift(newCol[0])
    //         });
    //     }
    //     else {
    //         // Add static value
    //         newCols.forEach( (newCol) => {
    //             row.unshift(newCol[1])
    //         });
    //     }
    //     tablerows.push(row);
    // }
    let output = parseInput(str); 

    console.log(output);

}

function parseInput(userInput) {
    let rows = userInput.split('\n');
    let tablerows = [];

    // Add columns with static value
    let newCols = [
        ['"Site"', '"cn"'],
        ['"Type"', '"html5blank"']
    ];

    for (let i=0; i<5; i++) {
        console.log(rows[i]);
    }

    for (let i=0; i<rows.length; i++) {
        let row = rows[i];
        row = row.split('\t');

        // Add newCols
        if (i === 0) {
            // Add titles
            newCols.forEach( (newCol) => {
                row.unshift(newCol[0])
            });
        }
        else {
            // Add static value
            newCols.forEach( (newCol) => {
                row.unshift(newCol[1])
            });
        }
        tablerows.push(row);
    }

    return tablerows;
}

main();