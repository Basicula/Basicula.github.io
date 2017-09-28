var n = Number(document.getElementById("Variables").value);
var m = Number(document.getElementById("Conditions").value);
var mm = 0;
var ns = n;
var ny = 0;
var bs;
var M = -1000000000;
var div = document.createElement("div");
div.id = "ForTable";

var what = Number(document.getElementById("minmax").value);

var variables = [];
var conditions = [];
var signs = [];
var freeIndex = [];
var delta = [];
var teta = [];

var base = [];


function refresh() {
    n = Number(document.getElementById("Variables").value);
    m = Number(document.getElementById("Conditions").value);
    mm = 0;
    ns = n;
    ny = 0;

    div = document.createElement("div");
    div.id = "ForTable";

    what = Number(document.getElementById("minmax").value);

    variables = [];
    conditions = [];
    signs = [];
    freeIndex = [];

    base = []
}


function getvar() {
    refresh();
    var table = document.getElementById("TableVar");
    var tr = table.children[1].children[1];
    for (var i = 0; i < n; i++) {
        variables[i] = tr.children[i].children[0].valueAsNumber;
        if (what == 2) variables[i] *= -1;
    }


    var table = document.getElementById("TableCond");
    for (var i = 0; i < m; i++) {
        var tr = table.children[1].children[i];
        conditions[i] = [];
        for (var j = 0; j <= n + 1; j++) {
            if (j == n) signs[i] = tr.children[j].children[0].value;
            else if (j == n + 1) freeIndex[i] = tr.children[j].children[0].valueAsNumber
            else conditions[i][j] = tr.children[j].children[0].valueAsNumber;
        }
    }
    for (var i = 0; i < m; i++) {
        if (freeIndex[i] < 0) {
            freeIndex[i] *= -1;
            if (signs[i] == ">=") signs[i] = "<=";
            else if (signs[i] == "<=") signs[i] = ">=";
            for (var j = 0; j < n; j++) {
                conditions[i][j] *= -1;
            }
        }
    }
    convertToCanon();
}


function convertToCanon() {
    var k = 0;
    for (var i = 0; i < m; i++) {
        if (signs[i] != "=") {
            for (var j = 0; j < m; j++)
                conditions[j][n] = 0;
            variables[ns + k++] = 0;
        }
        else mm++;
        if (signs[i] == "<=") {
            conditions[i][n++] = 1;
        }
        else if (signs[i] == ">=") {
            conditions[i][n++] = -1;
        }
    }
    Mmethod();
}


function Mmethod() {
    var j = 0;
    for (var i = 0; i < m; i++) {
        if (signs[i] == ">=")
            if (conditions[i][ns + i - mm] == -1) {
                for (var k = 0; k < m; k++)
                    if (k == j) conditions[k][n] = 1;
                    else conditions[k][n] = 0;
                variables[n] = M;
                n++;
                ny++;
            }
        j++;
    }
    for (var i = 0; i < n; i++) {
        var k = 0;
        var x = -1;
        var y = -1;
        for (var j = 0; j < m; j++) {
            if (conditions[j][i] == 1) {
                k++;
                if (k > 1) {
                    k = -1;
                    break;
                }
                x = j;
                y = i;
            }
            else if (conditions[j][i] == 0) continue;
            else {
                k = -1;
                break;
            }
        }
        if (k > 0) base[x] = y;
    }


    bs = base.length;
    buildTable();
    while (1) {
        var stop = 0;
        for (var i = 3; i < n + 3; i++)
            if (delta[i] < 0) stop++;
        if (stop) {
            symplexMethod();
            buildTable();
        }
        else break;
    }
    var dv = document.getElementById("ForTable");
    if (dv != null)
        document.body.replaceChild(div, dv);
    else document.body.appendChild(div);
}


function symplexMethod() {
    var min = 0;
    var minj = 2;
    var mini = -1;
    for (var i = 3; i < n + 3; i++) {
        if (delta[i] < 0 && min > delta[i]) {
            min = delta[i];
            minj = i - 3;
        }
    }
    if (min < 0) {
        var mintet = Infinity;
        for (var j = 0; j < bs; j++) {
            if (conditions[j][minj] > 0) {
                teta[j] = freeIndex[j] / conditions[j][minj];
                if (mintet > teta[j]) {
                    mintet = teta[j];
                    mini = j;
                }
            }
            else teta[j] = -1;
        }
        base[mini] = minj;
        var copycond = [];
        for (var k = 0; k < m; k++) {
            copycond[k] = [];
            for (var j = 0; j < n; j++)
                copycond[k][j] = conditions[k][j];
        }
        var elem = conditions[mini][minj];
        for (var k = 0; k < m; k++) {
            for (var j = 0; j <= n; j++) {
                if (k == mini) break;
                if (j == n) freeIndex[k] = (elem * freeIndex[k] - freeIndex[mini] * copycond[k][minj]) / elem;
                else conditions[k][j] = (elem * copycond[k][j] - copycond[mini][j] * copycond[k][minj]) / elem;
            }
        }

        for (var j = 0; j < n; j++) {
            conditions[mini][j] /= elem;
        }
        freeIndex[mini] /= elem;
    }
}

function buildTable() {
    var x = n + 3;
    var y = bs + 2;
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    var thead = document.createElement("thead")
    for (var j = 0; j < 2; j++) {
        var htr = document.createElement("tr");
        for (var i = 0; i < x; i++) {
            var th = document.createElement("th");
            var lbl = document.createElement("lable");
            if (j && i < n) lbl.textContent = "A" + (i + 1);
            else if (j && i >= n) break;
            else if (!j) {
                if (!i) lbl.textContent = "C";
                else if (i == 1) lbl.textContent = "x";
                else if (i == 2) lbl.textContent = "A0";
                else lbl.textContent = variables[i - 3];
            }
            lbl.width = "200px";
            if (!j && i < 3) th.rowSpan = "2";
            th.appendChild(lbl);
            htr.appendChild(th);
        }
        thead.appendChild(htr);
    }
    table.appendChild(thead);

    delta = [];
    var deltaNumber = [];
    for (var i = 0; i <= bs; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < x; j++) {
            var td = document.createElement("td");
            var lbl = document.createElement("lable");
            if (i == bs) {
                if (!j) lbl.textContent = "Delta";
                else if (j == 1) lbl.textContent = "L=";
                else if (j == 2) {
                    var sum = 0;
                    for (var k = 0; k < bs; k++) {
                        sum += variables[base[k]] * freeIndex[k];
                    }
                    lbl.textContent = sum;
                }
                else {
                    var delt = 0;
                    for (var k = 0; k < bs; k++) {
                        delt += variables[base[k]] * conditions[k][j - 3];
                    }
                    delt -= variables[j - 3];
                    lbl.textContent = delt;
                    delta[j] = delt;
                }
            }
            else if (!j) lbl.textContent = variables[base[i]];
            else if (j == 1) {
                if (base[i] >= n - ny) lbl.textContent = "y" + (base[i] + ny - n);
                else lbl.textContent = "x" + (base[i] + 1);
            }
            else if (j == 2) lbl.textContent = freeIndex[i];
            else lbl.textContent = conditions[i][j - 3];
            td.appendChild(lbl);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table.align = "center";
    table.width = "50%";
    table.border = "1px";
    div.appendChild(table);
    //document.body.appendChild(table);
}



function out() {
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    for (var i = 0; i < m; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < n; j++) {
            var th = document.createElement("th");
            var lbl = document.createElement("lable");
            lbl.value = conditions[i][j];
            lbl.textContent = String(conditions[i][j]);
            th.appendChild(lbl);
            tr.appendChild(th);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    document.body.appendChild(table);
}
