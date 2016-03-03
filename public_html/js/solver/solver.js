/*
 * (c) 2016 Daniel Savaria
 * Released under the MIT license
 */

/**
 *
 * @param {Puzzle} puzzle
 * @returns {Solver}
 */
var Solver = function (puzzle, possibilityConstructor) {
    this.puzzle = puzzle;
    this.possibilityConstructor = possibilityConstructor;
    this.statusCallback = null;
    this.finalCallback = null;
    this.rowPossibilities = [];
    this.columnPossibilities = [];
};

/**
 * Solve the puzzle.
 *
 * @param {function} solverCallback
 * @param {function} statusCallback
 * @param {function} finalCallback
 * @returns {undefined}
 */
Solver.prototype.solve = function (solverCallback, statusCallback, finalCallback) {
    this.puzzle.setUpdateCallback(solverCallback);
    this.statusCallback = statusCallback;
    this.finalCallback = finalCallback;

    this.rowPossibilities = [];
    this.columnPossibilities = [];
    this.setupRowIteration(0);
};

/**
 * Creates all possible solutions for the given row number, then calls this
 * function for the next row. When there are no more rows it wil call
 * setupColumIteration
 *
 * @param {number} row
 * @returns {undefined}
 */
Solver.prototype.setupRowIteration = function (row) {
    this.updateStatus("Analyzing row: " + (row + 1) + " / " + this.puzzle.getRowCount());
    this.rowPossibilities.push(this.assemblePossibilities(
            this.puzzle.getRow(row), this.puzzle.getWidth()));
    var next = row + 1;
    if (next < this.puzzle.getRowCount()) {
        setTimeout(this.setupRowIteration.bind(this), 0, next);
    } else {
        setTimeout(this.setupColumnIteration.bind(this), 0, 0);
    }
};

/**
 * Creates all possible solutions for the given column number, then calls this
 * function for the next column. When there are no more columns it wil call
 * fillSolutionFromPossibilitiesIteration
 *
 * @param {number} col
 * @returns {undefined}
 */
Solver.prototype.setupColumnIteration = function (col) {
    this.updateStatus("Analyzing column: " + (col + 1) + " / " + this.puzzle.getColumnCount());
    this.columnPossibilities.push(this.assemblePossibilities(
            this.puzzle.getColumn(col), this.puzzle.getHeight()));
    var next = col + 1;
    if (next < this.puzzle.getColumnCount()) {
        setTimeout(this.setupColumnIteration.bind(this), 0, next);
    } else {
        this.updateStatus("Filling in solution.");
        setTimeout(this.fillSolutionFromPossibilitiesIteration.bind(this), 0, 0, 0, false);
    }
};

/**
 * Compares the solution for the given row and column number to the current set
 * of possibilities. Removes any possibilities that are not consistent with the
 * solution. Then calls this function for the next row and column. Calls
 * fillSolutionFromPossibilitiesIteration at the end.
 *
 * @param {number} col
 * @param {number} row
 * @returns {undefined}
 */
Solver.prototype.removeImpossibilitiesIteration = function (col, row) {
    var answer = this.puzzle.getSolutionAt(col, row);
    if (answer !== Puzzle.UNKNOWN) {
        this.columnPossibilities[col].removeConflicts(answer, row);
        this.rowPossibilities[row].removeConflicts(answer, col);
    }

    var nextCol = col + 1;
    var nextRow = row + 1;
    if (nextRow < this.puzzle.getRowCount()) {
        setTimeout(this.removeImpossibilitiesIteration.bind(this), 0, col, nextRow);
    } else if (nextCol < this.puzzle.getColumnCount()) {
        setTimeout(this.removeImpossibilitiesIteration.bind(this), 0, nextCol, 0);
    } else {
        this.updateStatus("Filling in solution.");
        setTimeout(this.fillSolutionFromPossibilitiesIteration.bind(this), 0, 0, 0, false);
    }
};

/**
 * For a given column and row, compares all the relevant possibilities. If the
 * possibilities are consistent, then set that value in the solution. Then calls
 * this function for the next row and column. At the end, calls
 * removeImpossibilitiesIteration if updated became true.
 *
 * @param {number} col
 * @param {number} row
 * @param {boolean} updated
 * @returns {undefined}
 */
Solver.prototype.fillSolutionFromPossibilitiesIteration = function (col, row, updated) {
    if (this.puzzle.getSolutionAt(col, row) === Puzzle.UNKNOWN) {
        var answer = this.columnPossibilities[col].findCommonPossibility(row);
        if (answer !== Puzzle.UNKNOWN) {
            this.puzzle.setSolutionAt(col, row, answer);
            updated = true;
        }
    }
    if (this.puzzle.getSolutionAt(col, row) === Puzzle.UNKNOWN) {
        var answer = this.rowPossibilities[row].findCommonPossibility(col);
        if (answer !== Puzzle.UNKNOWN) {
            this.puzzle.setSolutionAt(col, row, answer);
            updated = true;
        }
    }

    var nextCol = col + 1;
    var nextRow = row + 1;
    if (nextRow < this.puzzle.getRowCount()) {
        setTimeout(this.fillSolutionFromPossibilitiesIteration.bind(this), 0, col, nextRow, updated);
    } else if (nextCol < this.puzzle.getColumnCount()) {
        setTimeout(this.fillSolutionFromPossibilitiesIteration.bind(this), 0, nextCol, 0, updated);
    } else if (updated) {
        this.updateStatus("Cross referencing.");
        setTimeout(this.removeImpossibilitiesIteration.bind(this), 0, 0, 0);
    } else {
        setTimeout(this.updateStatus.bind(this), 0, "Finished");
        if (this.finalCallback && typeof (this.finalCallback) === "function") {
            this.finalCallback();
        }
    }
};

/**
 * Sends statusMessage to this.statusCallback
 *
 * @param {string} statusMessage
 * @returns {undefined}
 */
Solver.prototype.updateStatus = function (statusMessage) {
    if (this.statusCallback && typeof (this.statusCallback) === "function") {
        this.statusCallback(statusMessage);
    }
};

/**
 * Creates all of the possible solutions for a given row or column.
 *
 * @param {Array} data
 * @param {number} totalLength
 * @returns {type}
 */
Solver.prototype.assemblePossibilities = function (data, totalLength) {
    var filledSegments = data.length;
    var filled = data.reduce(function (a, b) {
        return a + b;
    });
    var emptySegments = filledSegments + 1;
    var empty = totalLength - filled;

    //empty is the number of empty squares that must exist in this row or
    //column. However, there must be at least one empty square between each
    //segment of filled squares. So variableEmpty is the number of empty squares
    //left over after we take into account the one required empty between each
    //filled segment.
    var variableEmpty;
    if (emptySegments > 2) {
        variableEmpty = empty - (emptySegments - 2);
    } else {
        variableEmpty = empty;
    }

    //figure out the different ways to distribute the empty squares.
    var e = setUpEmpty(variableEmpty, 0, emptySegments);

    //setUpEmpty only distributes the variable empty squares, this puts the
    //required squares back in to the count.
    for (var i = 0; i < e.length; i++) {
        for (var j = 1; j < e[i].length - 1; j++) {
            e[i][j]++;
        }
    }

    return this.possibilityConstructor(data, e);
};

/**
 * This recursive function takes the  number of empty squares to distribute, the
 * depth of the calculation, and the number of segments to distribute the empty
 * elements to.
 *
 * @param {number} count
 * @param {number} start
 * @param {number} segmentCount
 * @returns {Array|setUpEmpty.toReturn}
 */
function setUpEmpty(count, start, segmentCount) {
    var toReturn = [];
    if (start === segmentCount - 1) {
        toReturn[0] = [count];
    } else {
        for (var i = 0; i <= count; i++) {
            var nextPart = setUpEmpty(count - i, start + 1, segmentCount);
            for (var j = 0; j < nextPart.length; j++) {
                var temp = [];
                temp[0] = i;
                temp = temp.concat(nextPart[j]);
                toReturn.push(temp);
            }
        }
    }
    return toReturn;
}

