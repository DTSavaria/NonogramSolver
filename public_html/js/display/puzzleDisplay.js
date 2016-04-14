/*
 * (c) 2016 Daniel Savaria
 * Released under the MIT license
 */

/**
 * Displays a puzzle in the given container.
 *
 * @param {type} container
 * @param {type} puzzle
 * @returns {PuzzleDisplay}
 */
var PuzzleDisplay = function (container, puzzle) {
    this.htmlTable = document.createElement("table");
    this.htmlTable.border = "1";
    container.appendChild(this.htmlTable);

    this.puzzle = puzzle;

    this.rowOffset = 0;
    this.columnOffset = 0;

    this.initialize();
};

PuzzleDisplay.prototype.initialize = function () {
    this.htmlTable.innerHTML = "";

    var colMatrix = this.puzzle.columnsToMatrix();
    var rowMatrix = this.puzzle.rowsToMatrix();

    this.rowOffset = colMatrix[0].length;
    this.columnOffset = rowMatrix[0].length;

    var rowCount = this.rowOffset + rowMatrix.length;
    var colCount = this.columnOffset + colMatrix.length;

    var unknownClass = solutionValueToClassName(Puzzle.UNKNOWN);

    for (var i = 0; i < rowCount; i++) {
        var row = this.htmlTable.insertRow(-1);
        for (var j = 0; j < colCount; j++) {
            var cell = row.insertCell(-1);
            cell.className = unknownClass;
        }
    }

    for (var i = 0; i < colMatrix.length; i++) {
        for (var j = 0; j < colMatrix[i].length; j++) {
            this.setInnerHTML(i + this.columnOffset, j, padTwo(colMatrix[i][j]));
        }
    }

    for (var i = 0; i < rowMatrix.length; i++) {
        for (var j = 0; j < rowMatrix[i].length; j++) {
            this.setInnerHTML(j, i + this.rowOffset, padTwo(rowMatrix[i][j]));
        }
    }
};

/**
 * Sets the display of the puzzle column and row to the solution. If the
 * solution is null, the solution value of this.puzzle is used.
 * @param {type} puzzleColumn
 * @param {type} puzzleRow
 * @param {type} solution
 * @returns {undefined}
 */
PuzzleDisplay.prototype.setSolutionCell = function (puzzleColumn, puzzleRow, solution) {
    var col = puzzleColumn + this.columnOffset;
    var row = puzzleRow + this.rowOffset;
    var str;
    if (solution) {
        str = solutionValueToClassName(solution);
    } else {
        str = solutionValueToClassName(this.puzzle.getSolutionAt(puzzleColumn, puzzleRow));
    }
    this.setClass(col, row, str);
};

/**
 * Set the inner HTML of the given cell.
 * @param {type} column
 * @param {type} row
 * @param {type} value
 * @returns {undefined}
 */
PuzzleDisplay.prototype.setInnerHTML = function (column, row, value) {
    var cell = this.htmlTable.rows[row].cells[column];
    cell.innerHTML = value;
};

PuzzleDisplay.prototype.setClass = function (column, row, className) {
    var cell = this.htmlTable.rows[row].cells[column];
    cell.className = className;
};