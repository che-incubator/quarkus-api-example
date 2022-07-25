let foodEndpoint = window.location.origin + "/food"

function convertJsonToHtmlTable(response) {
    var json = JSON.parse(response);
    //Get the headers from JSON data
    var headers = Object.keys(json[0]);
     
    //Prepare html header
    var headerRowHTML='<tr>';
    for(var i=0;i<headers.length;i++){
        headerRowHTML+='<th>'+headers[i]+'</th>';
    }
    headerRowHTML+='</tr>'; 
     
    //Prepare all the employee records as HTML
    var allRecordsHTML='';
    for(var i=0;i<json.length;i++){
     
        //Prepare html row
        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+json[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }

    //Append the table header and all records
    var table = document.getElementById("display_json_data");
    table.innerHTML = headerRowHTML + allRecordsHTML;
}

function clearTable() {
    var tableHeaderRowCount = 1;
    var table = document.getElementById("display_json_data");
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function search() {
    clearTable();
    var input = document.getElementById("myInput").value;
    httpGetAsync(foodEndpoint + "/restaurant/" + input, convertJsonToHtmlTable);
}

httpGetAsync(foodEndpoint, convertJsonToHtmlTable);

