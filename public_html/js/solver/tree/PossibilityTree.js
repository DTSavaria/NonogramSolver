/*
 * (c) 2016 Daniel Savaria
 * Released under the MIT license
 */

/**
 * A tree to represent possible solutions for a row or column. It contains
 * alternating counts of empty and then filled squares (starting at the left of
 * the row or top of the column). See PossibiityTreeNode.
 *
 * @param {Array} filled An array of numbers representing the number of filled
 * squares in the row or column
 * @param {Array} empties An array of array of numbers represent the possible
 * number of empty squares that can exist between each set of filled
 * @returns {PossibilityTree}
 */
var PossibilityTree = function (filled, empties) {
    this.head = new PossibilityTreeNode(null, null, null);

    empties.forEach(function (empty) {
        var parent = this.head;
        for (var i = 0; i < filled.length; i++) {
            var match = null;
            for (var j = 0; j < parent.children.length; j++) {
                if (parent.children[j].count === empty[i]) {
                    match = parent.children[j];
                    break;
                }
            }

            if (match === null) {
                match = new PossibilityTreeNode(Puzzle.EMPTY, empty[i], parent);
                match.addChild(new PossibilityTreeNode(Puzzle.FILLED, filled[i], match));
                parent.addChild(match);
            }
            parent = match.children[0];
        }
        parent.addChild(new PossibilityTreeNode(Puzzle.EMPTY, empty[empty.length - 1], parent));
    }, this);
};

PossibilityTree.prototype.getNewInstance = function (filled, empties) {
    return new PossibilityTree(filled, empties);
};

PossibilityTree.prototype.findCommonPossibility = function (index) {
    var nodes = this.getNodesAtIndex(index);
    var filled = nodes[0].filled;
    for (var i = 1; i < nodes.length; i++) {
        if (nodes[i].filled !== filled) {
            return Puzzle.UNKNOWN;
        }
    }
    return filled;
};

PossibilityTree.prototype.removeConflicts = function (answer, index) {
    var nodes = this.getNodesAtIndex(index);
    for (var i = 0; i < nodes.length; i++) {
        if (answer !== nodes[i].filled) {
            nodes[i].removeSelfFromParent();
        }
    }
};

PossibilityTree.prototype.getNodesAtIndex = function (index) {
    return getNodesAtIndexHelper(index, 0, this.head.children);
};

function getNodesAtIndexHelper(index, start, nodes) {
    var toReturn = [];
    for (var i = 0; i < nodes.length; i++) {
        var end = start + nodes[i].count;
        if (index < end) {
            toReturn.push(nodes[i]);
        } else {
            toReturn = toReturn.concat(getNodesAtIndexHelper(index, end, nodes[i].children));
        }
    }

    return toReturn;
}
