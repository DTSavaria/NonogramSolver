/*
 * Daniel Savaria
 * Released under the MIT license
 */

var Solver = function (rows, columns) {
    this.rows = rows;
    this.columns = columns;
};

Solver.prototype.solve = function () {
};

Solver.prototype.puzzleToGridString = function (
        startGrid, endGrid, startRow, endRow, startElement, endElement) {
    var rowMatrix = this.rowsToMatrix();
    var rowLength = rowMatrix[0].length;
    var columnMatrix = this.columnsToMatrix();

    var toReturn = startGrid;

    for (var i = 0; i < columnMatrix[0].length; i++) {
        toReturn += startRow;
        for (var j = 0; j < rowLength; j++) {
            toReturn += startElement + endElement;
        }
        columnMatrix.forEach(function (column) {
            toReturn += startElement + column[i] + endElement;
        });
        toReturn += endRow;
    }

    rowMatrix.forEach(function (row) {
        toReturn += startRow;
        row.forEach(function (element) {
            toReturn += startElement + element + endElement;
        });
        for (var i = 0; i < columnMatrix.length; i++) {
            toReturn += startElement + endElement;
        }
        toReturn += endRow;
    });

    toReturn += endGrid;

    return toReturn;
};

Solver.prototype.rowsToMatrix = function () {
    return vectorToMatrix(this.rows);
};

Solver.prototype.columnsToMatrix = function () {
    return vectorToMatrix(this.columns);
};

Solver.prototype.rowsToString = function () {
    return vectorToString(this.rows, 2);
};

Solver.prototype.columnsToString = function () {
    return vectorToString(this.columns, 2);
};

function vectorToString(vector, depth) {
    var toReturn = "[";
    vector.forEach(function (entry) {
        if (entry instanceof Array && depth > 1) {
            toReturn += this.vectorToString(entry, depth - 1);
        } else {
            toReturn += entry;
        }
        toReturn += ", ";
    }.bind(this));
    toReturn = toReturn.slice(0, -2);
    toReturn += "]";
    return toReturn;
}

function vectorToMatrix(vector) {
    var max = 0;
    vector.forEach(function (entry) {
        max = Math.max(max, entry.length);
    });
    var matrix = [];
    vector.forEach(function (entry) {
        var vector = [];
        for (var i = 0; i < max - entry.length; i++) {
            vector.push(0);
        }
        entry.forEach(function (element) {
            vector.push(element);
        });
        matrix.push(vector);
    });
    return matrix;
}