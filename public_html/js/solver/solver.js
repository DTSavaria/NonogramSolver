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

Solver.prototype.rowsToString = function () {
    return this.vectorToString(this.rows, 2);
};

Solver.prototype.columnsToString = function () {
    return this.vectorToString(this.columns, 2);
};

Solver.prototype.vectorToString = function (vector, depth) {
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
};