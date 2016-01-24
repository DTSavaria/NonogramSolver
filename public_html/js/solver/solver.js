/*
 * Daniel Savaria
 * Released under the MIT license
 */

var Solver = function (rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.rowPossibilities = [];
    this.columnPossibilities = [];
    this.solution = new Array(this.rows.length);
    for (var i = 0; i < this.solution.length; i++) {
        this.solution[i] = new Array(this.columns.length);
        for (var j = 0; j < this.solution[i].length; j++) {
            this.solution[i][j] = Solver.UNKNOWN;
        }
    }
};

Solver.EMPTY = 1;
Solver.FILLED = 2;
Solver.UNKNOWN = 3;

Solver.prototype.solve = function () {
    this.rowPossibilities = [];
    this.rows.forEach(function (row) {
        this.rowPossibilities.push(assemblePossibilities(row, this.columns.length));
    }, this);

    this.columnPossibilities = [];
    this.columns.forEach(function (column) {
        this.columnPossibilities.push(assemblePossibilities(column, this.rows.length));
    }, this);

    this.fillSolutionFromPossibilities();

    //@TODO...
};

Solver.prototype.fillSolutionFromPossibilities = function () {
    for (var i = 0; i < this.solution.length; i++) {
        for (var j = 0; j < this.solution[i].length; j++) {
            if (this.solution[i][j] === Solver.UNKNOWN) {
                var answer = findCommonPossibility(this.columnPossibilities[i], j);
                if (answer !== Solver.UNKNOWN) {
                    this.solution[i][j] = answer;
                }
            }
            if (this.solution[i][j] === Solver.UNKNOWN) {
                var answer = findCommonPossibility(this.rowPossibilities[j], i);
                if (answer !== Solver.UNKNOWN) {
                    this.solution[i][j] = answer;
                }
            }
        }
    }
};

function findCommonPossibility(possibilities, index) {
    var toReturn = possibilities[0][index];
    for (var i = 0; i < possibilities.length; i++) {
        if (possibilities[i][index] !== toReturn) {
            toReturn = Solver.UNKNOWN;
            break;
        }
    }
    return toReturn;
}

/**
 * Creates all of the possible solutions for a given row or column.
 *
 * @param {type} data
 * @param {number} totalLength
 * @returns {Array|createPossibilities.toReturn}
 */
function assemblePossibilities(data, totalLength) {
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
    var variableEmpty = empty;
    if (emptySegments > 2) {
        variableEmpty -= emptySegments - 2;
    }

    //figure out the different ways to distribute the empty squares.
    var e = setUpEmpty(variableEmpty, 0, emptySegments);

    //setUpEmpty only distributes the variable empty squares, this pusts the
    //required squares back in to the count.
    for (var i = 0; i < e.length; i++) {
        for (var j = 1; j < e[i].length - 1; j++) {
            e[i][j]++;
        }
    }

    return createPossibilities(data, e);
}

/**
 * Given a row or column and the possible empty segments, put together all the
 * possible solutions.
 *
 * @param {type} data
 * @param {Array} empties
 * @returns {Array|createPossibilities.toReturn}
 */
function createPossibilities(data, empties) {
    var toReturn = [];
    empties.forEach(function (empty) {
        var possibility = [];
        toReturn.push(possibility);
        var copy = data.slice(0);
        for (var i = 0; i < empty.length; i++) {
            while (empty[i] > 0) {
                possibility.push(Solver.EMPTY);
                empty[i]--;
            }
            if (i < copy.length) {
                while (copy[i] > 0) {
                    possibility.push(Solver.FILLED);
                    copy[i]--;
                }
            }
        }
    });
    return toReturn;
}

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

/**
 * Creates a string to represent the puzzle. Right now this is only printing the
 * clues. It should also print the solution so far.
 *
 * @param {type} startGrid
 * @param {type} endGrid
 * @param {type} startRow
 * @param {type} endRow
 * @param {type} startElement
 * @param {type} endElement
 * @returns {Solver.prototype.puzzleToGridString.toReturn}
 */
Solver.prototype.puzzleToGridString = function (
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
            toReturn += startElement + column[i] + endElement;
        });
        toReturn += endRow;
    }

    for (var i = 0; i < rowMatrix.length; i++) {
        toReturn += startRow;
        rowMatrix[i].forEach(function (element) {
            toReturn += startElement + element + endElement;
        });
        for (var j = 0; j < this.solution[i].length; j++) {
            toReturn += startElement;
            switch (this.solution[j][i]) {
                case Solver.UNKNOWN:
                    toReturn += " ";
                    break;
                case Solver.FILLED:
                    toReturn += "X";
                    break;
                case Solver.EMPTY:
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
Solver.prototype.rowsToMatrix = function () {
    return vectorToMatrix(this.rows);
};

/**
 * Creates a dense matrix of the column clues.
 *
 * @returns {Array|vectorToMatrix.matrix}
 */
Solver.prototype.columnsToMatrix = function () {
    return vectorToMatrix(this.columns);
};

/**
 * Prints the column clues to a string.
 *
 * @returns {String}
 */
Solver.prototype.rowsToString = function () {
    return vectorToString(this.rows, 2);
};

/**
 * Prints the row clues to a string.
 *
 * @returns {String}
 */
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