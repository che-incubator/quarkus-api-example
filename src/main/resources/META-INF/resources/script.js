const foodEndpoint = window.location.origin + '/food';
const inputId = 'input_id';
const inputName = 'input_name';
const inputRestaurant = 'input_restaurant';
const inputPrice = 'input_price';

function convertJsonToHtmlTable(response) {
    const json = JSON.parse(response);
    //Get the headers from JSON data
    const headers = Object.keys(json[0]);

    //Prepare all the employee records as HTML
    let allRecordsHTML = '';
    for (let i = 0; i < json.length; i++) {

        //Prepare html row
        allRecordsHTML += '<tr class="record">';
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            allRecordsHTML += '<td>' + json[i][header] + '</td>';
        }
        allRecordsHTML += '</tr>';
    }

    //Append the table header and all records
    const table = document.getElementById('display_header');
    table.insertAdjacentHTML('afterend', allRecordsHTML);
}

function httpGetAsync(url, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
}

function search() {
    clearTableRecords();
    const input = document.getElementById('myInput').value;
    httpGetAsync(foodEndpoint + '/restaurant/' + input, convertJsonToHtmlTable);
}

function addItem() {
    const body = getTableInputs();
    httpPostAsync(foodEndpoint, body, () => {
        clearTableInputs();
        clearTableRecords();

        // repopulate populate table
        httpGetAsync(foodEndpoint, convertJsonToHtmlTable);
    });
}

function clearTableRecords() {
    const table = document.getElementById('display_json_data');
    let i = 0;
    while (i < table.rows.length) {
        if (table.rows[i].className && table.rows[i].className === 'record') {
            table.rows[i].remove();
        } else {
            i++;
        }
    }
}

function getTableInputs() {
    const name = document.getElementById(inputName).value;
    const restaurantName = document.getElementById(inputRestaurant).value;
    const price = document.getElementById(inputPrice).value;
    return { name, restaurantName, price };
}

function clearTableInputs() {
    document.getElementById(inputId).value = '';
    document.getElementById(inputName).value = '';
    document.getElementById(inputRestaurant).value = '';
    document.getElementById(inputPrice).value = '';
}

function httpPostAsync(url, body, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 201) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.send(JSON.stringify(body));
}

httpGetAsync(foodEndpoint, convertJsonToHtmlTable);
