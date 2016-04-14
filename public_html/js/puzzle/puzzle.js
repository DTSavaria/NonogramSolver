/*
 * (c) 2016 Daniel Savaria
 * Released under the MIT license
 */

/**
 * Rows and columns are each an array of arrays. Each element of the outer array
 * is a row or column. Each element of an inner array contains the clues for
 * that row or column.
 *
 * @param {type} rows
 * @param {type} columns
 * @returns {Puzzle}
 */
var Puzzle = function (columns, rows) {
    this.rows = rows;
    this.columns = columns;
    this.solution = new Array(this.rows.length);
    for (var i = 0; i < this.solution.length; i++) {
        this.solution[i] = new Array(this.columns.length);
        for (var j = 0; j < this.solution[i].length; j++) {
            this.solution[i][j] = Puzzle.UNKNOWN;
        }
    }
    this.updateCallback = null;
    this.uCallbackThis = null;
};

/**
 * For squares that are empty.
 * @type Number
 */
Puzzle.EMPTY = 1;

/**
 * For squares that are filled.
 * @type Number
 */
Puzzle.FILLED = 2;

/**
 * For squares that it is not known if it is empty or filled.
 */
Puzzle.UNKNOWN = 3;

Puzzle.prototype.setUpdateCallback = function (updateCallback, uCallbackThis) {
    if (updateCallback && typeof (updateCallback) === "function") {
        this.updateCallback = updateCallback;
    } else {
        this.updateCallback = null;
    }
    this.uCallbackThis = uCallbackThis;
};

/**
 * Get the number of columns.
 * @returns {Puzzle.columns.length}
 */
Puzzle.prototype.getColumnCount = function () {
    return this.columns.length;
};

/**
 * Get the width of the puzzle.
 * @returns {Puzzle.columns.length}
 */
Puzzle.prototype.getWidth = function () {
    return this.getColumnCount();
};

/**
 * Get the number of rows.
 * @returns {Puzzle.rows.length}
 */
Puzzle.prototype.getRowCount = function () {
    return this.rows.length;
};

/**
 * Get the height of the puzzle.
 * @returns {Puzzle.rows.length}
 */
Puzzle.prototype.getHeight = function () {
    return this.getRowCount();
};

/**
 * Get the clues for the given column number. Zero indexed starting from left.
 * @param {type} number
 * @returns {type}
 */
Puzzle.prototype.getColumn = function (number) {
    return this.columns[number];
};

/**
 * Get the clues for the given row number. Zero indexed starting from top.
 * @param {type} number
 * @returns {type}
 */
Puzzle.prototype.getRow = function (number) {
    return this.rows[number];
};

/**
 * Get the solution for the square of the given column and row.
 * @param {type} column
 * @param {type} row
 * @returns {Puzzle.prototype@arr;@arr;solution}
 */
Puzzle.prototype.getSolutionAt = function (column, row) {
    return this.solution[column][row];
};

/**
 * Set the solution for the square at the given column and row to value.
 * @param {type} column
 * @param {type} row
 * @param {type} value
 * @returns {undefined}
 */
Puzzle.prototype.setSolutionAt = function (column, row, value) {
    this.solution[column][row] = value;
    if (this.updateCallback) {
        this.updateCallback.call(this.uCallbackThis, column, row, value);
    }
};

/**
 * Creates a string to represent the puzzle.
 *
 * @param {type} startGrid
 * @param {type} endGrid
 * @param {type} startRow
 * @param {type} endRow
 * @param {type} startElement
 * @param {type} endElement
 * @returns {Solver.prototype.puzzleToGridString.toReturn}
 */
Puzzle.prototype.toGridString = function (
        startGrid, endGrid, startRow, endRow, startElement, endElement) {
    var rowMatrix = this.rowsToMatrix();
    var rowLength = rowMatrix[0].length;
    var columnMatrix = this.columnsToMatrix();

    var toReturn = startGrid;

    for (var i = 0; i < columnMatrix[0].length; i++) {
        toReturn += startRow;
        for (var j = 0; j < rowLength; j++) {
            toReturn += startElement + '~~' + endElement;
        }
        columnMatrix.forEach(function (column) {
            var number = '';
            if (column[i] > 0) {
                number = padTwo(column[i]);
            }
            toReturn += startElement + number + endElement;
        });
        toReturn += endRow;
    }

    for (var i = 0; i < rowMatrix.length; i++) {
        toReturn += startRow;
        rowMatrix[i].forEach(function (element) {
            var number = '';
            if (element > 0) {
                number = padTwo(element);
            }
            toReturn += startElement + number + endElement;
        });
        for (var j = 0; j < this.solution[i].length; j++) {
            toReturn += startElement;
            toReturn += solutionValueToString(this.solution[j][i]);
            toReturn += endElement;
        }
        toReturn += endRow;
    }

    toReturn += endGrid;

    return toReturn;
};

/**
 * Creates a simple HTML table of the puzzle.
 *
 * @returns {type|Solver.prototype.puzzleToGridString.toReturn}
 */
Puzzle.prototype.toHtmlTable = function () {
    return this.toGridString("<table border='1'>", "</table>", "<tr>", "</tr>", "<td>", "</td>");
};

/**
 * Creates a dense matrix of the row clues.
 *
 * @returns {Array|vectorToMatrix.matrix}
 */
Puzzle.prototype.rowsToMatrix = function () {
    return vectorToMatrix(this.rows);
};

/**
 * Creates a dense matrix of the column clues.
 *
 * @returns {Array|vectorToMatrix.matrix}
 */
Puzzle.prototype.columnsToMatrix = function () {
    return vectorToMatrix(this.columns);
};

/**
 * Prints the column clues to a string.
 *
 * @returns {String}
 */
Puzzle.prototype.rowsToString = function () {
    return vectorToString(this.rows, 2);
};

/**
 * Prints the row clues to a string.
 *
 * @returns {String}
 */
Puzzle.prototype.columnsToString = function () {
    return vectorToString(this.columns, 2);
};

/**
 * Returns a String representing a value in the solution
 * @param {type} value
 * @returns {String}
 */
function solutionValueToString(value) {
    var toReturn = "";
    switch (value) {
        case Puzzle.UNKNOWN:
            toReturn = " ";
            break;
        case Puzzle.FILLED:
            toReturn = "X";
            break;
        case Puzzle.EMPTY:
            toReturn = "-";
            break;
    }
    return toReturn;
}

function solutionValueToClassName(value) {
    var toReturn = "";
    switch (value) {
        case Puzzle.UNKNOWN:
            toReturn = "unknown_value";
            break;
        case Puzzle.FILLED:
            toReturn = "filled_value";
            break;
        case Puzzle.EMPTY:
            toReturn = "empty_value";
            break;
    }
    return toReturn;
}

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

function padTwo(numberLessThan100) {
    var pad = "\xa0\xa0";
    return (pad + numberLessThan100).slice(-pad.length);
}
