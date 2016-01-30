/*
 * Daniel Savaria
 * Released under the MIT license
 */

/**
 *
 * @param {Puzzle} puzzle
 * @returns {Solver}
 */
var Solver = function (puzzle) {
    this.puzzle = puzzle;
    this.rowPossibilities = [];
    this.columnPossibilities = [];
};

Solver.prototype.solve = function () {
    this.rowPossibilities = [];
    for (var row = 0; row < this.puzzle.getRowCount(); row++) {
        this.rowPossibilities.push(assemblePossibilities(
                this.puzzle.getRow(row), this.puzzle.getWidth()));
    }

    this.columnPossibilities = [];
    for (var col = 0; col < this.puzzle.getColumnCount(); col++) {
        this.columnPossibilities.push(assemblePossibilities(
                this.puzzle.getColumn(col), this.puzzle.getHeight()));
    }

    var keepGoing = true;
    while (keepGoing) {
        keepGoing = this.fillSolutionFromPossibilities();
        this.removeImpossibilities();
    }
};

Solver.prototype.removeImpossibilities = function () {
    for (var col = 0; col < this.puzzle.getColumnCount(); col++) {
        for (var row = 0; row < this.puzzle.getRowCount(); row++) {
            var answer = this.puzzle.getSolutionAt(col, row);
            if (answer !== Puzzle.UNKNOWN) {
                var possSet = this.columnPossibilities[col];
                for (var poss = possSet.length - 1; poss >= 0; poss--) {
                    if (answer !== possSet[poss][row]) {
                        possSet.splice(poss, 1);
                    }
                }

                possSet = this.rowPossibilities[row];
                for (var poss = possSet.length - 1; poss >= 0; poss--) {
                    if (answer !== possSet[poss][col]) {
                        possSet.splice(poss, 1);
                    }
                }
            }
        }
    }
};

Solver.prototype.fillSolutionFromPossibilities = function () {
    var updated = false;
    for (var col = 0; col < this.puzzle.getColumnCount(); col++) {
        for (var row = 0; row < this.puzzle.getRowCount(); row++) {
            if (this.puzzle.getSolutionAt(col, row) === Puzzle.UNKNOWN) {
                var answer = findCommonPossibility(this.columnPossibilities[col], row);
                if (answer !== Puzzle.UNKNOWN) {
                    this.puzzle.setSolutionAt(col, row, answer);
                    updated = true;
                }
            }
            if (this.puzzle.getSolutionAt(col, row) === Puzzle.UNKNOWN) {
                var answer = findCommonPossibility(this.rowPossibilities[row], col);
                if (answer !== Puzzle.UNKNOWN) {
                    this.puzzle.setSolutionAt(col, row, answer);
                    updated = true;
                }
            }
        }
    }
    return updated;
};

function findCommonPossibility(possibilities, index) {
    var toReturn = possibilities[0][index];
    for (var i = 0; i < possibilities.length; i++) {
        if (possibilities[i][index] !== toReturn) {
            toReturn = Puzzle.UNKNOWN;
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
    var variableEmpty;
    if (emptySegments > 2) {
        variableEmpty = empty - (emptySegments - 2);
    } else {
        variableEmpty = empty;
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
                possibility.push(Puzzle.EMPTY);
                empty[i]--;
            }
            if (i < copy.length) {
                while (copy[i] > 0) {
                    possibility.push(Puzzle.FILLED);
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

