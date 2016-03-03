/*
 * (c) 2016 Daniel Savaria
 * Released under the MIT license
 */


var PossibilityList = function (filled, empties) {
    this.data = [];
    empties.forEach(function (empty) {
        var possibility = [];
        this.data.push(possibility);
        var copy = filled.slice(0);
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
    }, this);
};

PossibilityList.prototype.getNewInstance = function (filled, empties) {
    return new PossibilityList(filled, empties);
};

PossibilityList.prototype.findCommonPossibility = function (index) {
    var toReturn = this.data[0][index];
    for (var i = 0; i < this.data.length; i++) {
        if (this.data[i][index] !== toReturn) {
            toReturn = Puzzle.UNKNOWN;
            break;
        }
    }
    return toReturn;
};

PossibilityList.prototype.removeConflicts = function (answer, index) {
    for (var poss = this.data.length - 1; poss >= 0; poss--) {
        if (answer !== this.data[poss][index]) {
            this.data.splice(poss, 1);
        }
    }
};

