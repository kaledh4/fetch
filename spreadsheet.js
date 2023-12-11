const sheetId = '1rMecmF5SjQScr3Glq28WoNVphKH8fIyFtjoyzy2YIyw';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'DASHBOARD';
const query = encodeURIComponent('Select B, C, D, E') // Changed from 'Select *'
const url = `${base}&sheet=${sheetName}&tq=${query}`
const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')

function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(rep)
            const colz = ["Symbol", "Risk", "Price", "Multiple"]; // Specific column names
            const tr = document.createElement('tr');
            //Create table headers
            colz.forEach((column) => {
                const th = document.createElement('th');
                th.innerText = column;
                tr.appendChild(th);
            })
            output.appendChild(tr);
            //extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                })
                data.push(row);
            })
            processRows(data);
        })
}

function getColor(value) {
    let hue;
    if (value < 0) {
        hue = 120; // Green for negative values
    } else if (value <= 100) {
        hue = 120 - value * 1.2; // Hue goes from 120 (green) to 0 (red) through 60 (white)
    } else {
        hue = 0; // Red for values above 100
    }
    return `hsl(${hue}, 100%, 90%)`; // Saturation is 100%, lightness is 90%
}

function processRows(json) {
    json.forEach((row, rowIndex) => {
        if (rowIndex < 8) { // Only process the first 8 rows
            const tr = document.createElement('tr');
            const keys = Object.keys(row);

            keys.forEach((key, columnIndex) => {
                const td = document.createElement('td');
                let value = row[key];
                if (columnIndex === 1) { // Column 2 (0-indexed)
                    value = parseFloat(value).toFixed(3); // Format as 0.000
                    td.style.backgroundColor = getColor(value);
                    td.textContent = value;
                } else if (columnIndex === 3) { // Column 4 (0-indexed)
                    value = parseFloat(value) * 100; // Convert to percentage
                    let formattedValue = value.toFixed(2) + '%'; // Format as percentage with two decimal places
                    td.style.backgroundColor = getColor(value);
                    td.textContent = formattedValue;
                } else {
                    td.textContent = value;
                }
                tr.appendChild(td);
            })
            output.appendChild(tr);
        }
    })
}

