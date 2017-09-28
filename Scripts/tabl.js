function conditionInd() {
    var table = document.getElementById("TableCond");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    var v = Number(document.getElementById("Conditions").value);
    var u = Number(document.getElementById("Variables").value);
    var tbody = document.getElementById("TableCond").children[1];
    var thead = document.getElementById("TableCond").children[0];
    var htr = document.createElement("tr");
    for (var i = 0; i <= u + 1; i++) {
        var th = document.createElement("th");
        if (i == u + 1) {
            th.textContent = "c";
        }
        else if (i == u) {
            th.textContent = "";
        }
        else {
            th.textContent = "x" + (i + 1);
        }
        htr.appendChild(th);
    }
    thead.appendChild(htr);
    for (var i = 0; i < v; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j <= u + 1; j++) {
            var td = document.createElement("td");
            if (j == u) {
                var input = document.createElement("select");
                var option1 = document.createElement("option");
                var option2 = document.createElement("option");
                var option3 = document.createElement("option");
                option1.text = "<=";
                option2.text = ">="
                option3.text = "=";
                input.appendChild(option1);
                input.appendChild(option2);
                input.appendChild(option3);
                input.style.width = "40px";
                td.appendChild(input);
            }
            else {
                var input = document.createElement("input");
                input.style.width = "50px";
                input.placeholder = "0";
                input.type = "number";
                input.required = "on";
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}
function variablesInd() {
    var table = document.getElementById("TableVar");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    var thead = document.getElementById("TableVar").children[0];
    var tbody = document.getElementById("TableVar").children[1];
    var htr = document.createElement("tr");
    var v = Number(document.getElementById("Variables").value);
    for (var i = 0; i < 2; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < v; j++) {
            if (i) {
                var td = document.createElement("td");
                var input = document.createElement("input");
                input.style.width = "50px";
                input.placeholder = "0";
                input.type = "number";
                input.required = "on";
                td.appendChild(input);
                tr.appendChild(td);
            }
            else {
                var th = document.createElement("th");
                th.textContent = "x" + (j + 1);
                htr.appendChild(th);
            }
        }
        tbody.appendChild(tr);
    }
    thead.appendChild(htr);
    conditionInd();
}
conditionInd();
variablesInd();
