

// Not using jsx, would require babel in browser
class IframeController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '', // 2D Arr of values in table
            userInput: '', // Text input in textarea, handlePaste one way sets input
            newColsInput: '',
            newCols: [],
        };
        this.changeCell = this.changeCell.bind(this);
        this.changeUserInput = this.handlePaste.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.getTableJSON = this.getTableJSON.bind(this);
        this.handleNewColChange = this.handleNewColChange.bind(this);
        this.handleUpdateCol = this.handleUpdateCol.bind(this);
    }

    handleNewColChange(e) {
        const colInput = e.target.value;
        this.setState({
            newColsInput: colInput,
        })
    }
    handleUpdateCol() {
        const inputArr = this.state.newColsInput.split(',');
        const newTitleArr = [];

        // Get newCols from newColsInput
        for (let i=0; i<inputArr.length; i++) {
            const pair = inputArr[i].split(':');

            // Handle malformed input
            if (pair.length !== 2) {
                console.error('Malformed title pair: ', pair);
                continue;
            }

            newTitleArr.push(pair);
        }

        newTitleArr.reverse();


        // Map rows in input with new columns
        const numOriginalCol = this.state.userInput.split('\n')[0].split('\t').length;
        let newInput = []
        for (let i=0; i<this.state.input.length; i++) {
            let newRow = this.state.input[i];

            // Remove non-original cols
            newRow = newRow.slice(this.state.newCols.length - numOriginalCol);
            
            // Add new colls
            if (i === 0) {
                // Add titles
                newTitleArr.forEach( (pair) => {
                    newRow.unshift(pair[0]);
                });
            }
            else {
                // Add static value
                newTitleArr.forEach( (pair) => {
                    newRow.unshift(pair[1]);
                });
            }

            newInput.push(newRow);
        }
        
        // Update newCol and input
        this.setState({
            newCol: newTitleArr,
            input: newInput
        })
    }
    handlePaste(event) {
        const clipboard = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;
        const pastedInput = clipboard.getData('text/plain');

        const parsedInput = Papa.parse(pastedInput).data;

        const numTitles = parsedInput[0].length;
        const filteredInput = parsedInput.filter( (row) => {
            if (row.length !== numTitles) {
                console.error('Omitted improperly formatted row: ', row);
                
                return false;
            }
            return true;
        })
        
        this.setState({
            newCols: [], // reset newCols on paste
            userInput: pastedInput,
            input: filteredInput,
        })
    }
    handleUserInputChange(e) {
        e.preventDefault();
        // Do nothing, need paste for proper formatting
    }
    changeCell(row, index, e) {
        e.preventDefault();

        const newinput = this.state.input.slice(0);
        newinput[row][index] = e.target.value;

        this.setState({
            input: newinput
        })
    }
    getTableJSON() {
        const colTitles = this.state.input[0];
        const output = [];

        for (let i=1; i<this.state.input.length; i++) {
            const row = this.state.input[i];
            const obj = {};
            
            // loop through colTitles to add properties for each row
            for (let j=0; j<colTitles.length; j++) {
                let title = colTitles[j];
                obj[title] = row[j];
            }

            output.push(obj);
        }

        const jsonString = JSON.stringify(output);
        console.log(JSON.parse(jsonString))
        return jsonString;
    }
    
    render() {

        // Construct table, tbody, arr of tr, arr of td, input
        const trs = [];

        // Construct arr of tr
        for (let i=0; i < this.state.input.length; i++) {
            const row = this.state.input[i];
            const tds = [];
            
            // Construct arr of td
            for (let j=0; j < row.length; j++) {
                const cell = row[j];
                
                // Construct input for td
                const inputEl = React.createElement('input', {
                    type: 'text', 
                    value: cell,
                    onChange: (e) => {
                        this.changeCell(i, j, e);
                    }
                });

                tds.push( React.createElement('td', {key: j}, inputEl));
            }


            // Add row number to tr
            let rowNum = React.createElement('td', {key: 'rowNum'}, i !== 0 ? i : '');
            tds.unshift(rowNum);

            trs.push( React.createElement('tr', {key: i}, tds));
        }

        const tbody = React.createElement('tbody', null, trs);
        const table = React.createElement('table', {key: 'table'}, tbody);

        const newColInput = React.createElement('textarea', {
            key: 'newColInput',
            style: {width: '500px', resize: 'none'},
            placeholder: 'Enter new columns here format: "title:value", "title:value',
            value: this.state.newColsInput,
            onChange: (e) => {this.handleNewColChange(e)}
        })
        const newColInputButton = React.createElement('button', {
            key: 'newColInputButton',
            onClick: () => {this.handleUpdateCol()}
        }, 'Update Columns')
        const newColInputDiv = React.createElement('div', {
            key: 'newColInput',
            style: {display: 'flex'},
        }, [newColInput, newColInputButton])

        const userInput = React.createElement('textarea', {
            style: {width: '500px', resize: 'none'},
            key: 'userInput',
            value: this.state.userInput,
            placeholder: 'Paste tsv here',
            onChange: (e) => {this.handleUserInputChange(e)},
            onPaste: (e) => {this.handlePaste(e)},
        });

        const button = React.createElement('button', {
            key: 'testButton',
            onClick: () => {this.getTableJSON()}
        }, 'Get JSON');

        return React.createElement('div', {className: 'iframeController'}, [userInput, newColInputDiv, table, button]);
    }
}

ReactDOM.render(React.createElement(IframeController), document.querySelector('#csv'));