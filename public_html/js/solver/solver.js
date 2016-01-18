/*
 * Daniel Savaria
 * Released under the MIT license
 */

var Solver = function (rows, columns) {
    this.rows = rows;
    this.columns = columns;
};

Solver.prototype.solve = function () {
    alert("I'm gonna solve it. \n"
            + "r: " + this.vectorToString(this.rows) + "\n"
            + "c: " + this.vectorToString(this.columns));
};

Solver.prototype.vectorToString = function (vector) {
    var toReturn = "[";
    vector.forEach(function (entry) {
        if (entry instanceof Array) {
            toReturn += this.vectorToString(entry);
        } else {
            toReturn += entry;
        }
        toReturn += ", ";
    }.bind(this));
    toReturn = toReturn.slice(0, -2);
    toReturn += "]";
    return toReturn;
};