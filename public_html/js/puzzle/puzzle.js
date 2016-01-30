/*
 * Daniel Savaria
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
var Puzzle = function (rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.solution = new Array(this.rows.length);
    for (var i = 0; i < this.solution.length; i++) {
        this.solution[i] = new Array(this.columns.length);
        for (var j = 0; j < this.solution[i].length; j++) {
            this.solution[i][j] = Puzzle.UNKNOWN;
        }
    }
};

Puzzle.EMPTY = 1;
Puzzle.FILLED = 2;
Puzzle.UNKNOWN = 3;

Puzzle.prototype.getColumnCount = function () {
    return this.columns.length;
};

Puzzle.prototype.getWidth = function () {
    return this.getColumnCount();
};

Puzzle.prototype.getRowCount = function () {
    return this.rows.length;
};

Puzzle.prototype.getHeight = function () {
    return this.getRowCount();
};

Puzzle.prototype.getColumn = function (number) {
    return this.columns[number];
};

Puzzle.prototype.getRow = function (number) {
    return this.rows[number];
};

Puzzle.prototype.getSolutionAt = function (column, row) {
    return this.solution[column][row];
};

Puzzle.prototype.setSolutionAt = function (column, row, value) {
    this.solution[column][row] = value;
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
            toReturn += startElement + ' ' + endElement;
        }
        columnMatrix.forEach(function (column) {
            toReturn += startElement + padTwo(column[i]) + endElement;
        });
        toReturn += endRow;
    }

    for (var i = 0; i < rowMatrix.length; i++) {
        toReturn += startRow;
        rowMatrix[i].forEach(function (element) {
            toReturn += startElement + padTwo(element) + endElement;
        });
        for (var j = 0; j < this.solution[i].length; j++) {
            toReturn += startElement;
            switch (this.solution[j][i]) {
                case Puzzle.UNKNOWN:
                    toReturn += " ";
                    break;
                case Puzzle.FILLED:
                    toReturn += "X";
                    break;
                case Puzzle.EMPTY:
                    toReturn += "-";
                    break;
            }
            toReturn += endElement;
        }
        toReturn += endRow;
    }

    toReturn += endGrid;

    return toReturn;
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
    var pad = "00";
    return (pad+numberLessThan100).slice(-pad.length);
}