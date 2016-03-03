/*
 * (c) 2016 Daniel Savaria
 * Released under the MIT license
 */

/**
 * This represents either a contiguous group of either empty or filled squares
 * in a row or column. It contains an array of children. If this Node is a group
 * of empty squares, children will be of length zero if it is the end of the row
 * or column or one and contain a Node representing the next set of filled
 * squares. If this node is a group of filled squares, children can be of any
 * length greater than 0 and each Node in it represents a different possibility
 * of the number of following empty squares.
 *
 * @param {Number} filled Puzzle.FILLED or Puzzle.EMPTY or null
 * @param {Number} count the number of squares this represents
 * @param {PossibilityTreeNode} parent
 * @returns {PossibilityTreeNode}
 */
var PossibilityTreeNode = function (filled, count, parent) {
    this.filled = filled;
    this.count = count;
    this.parent = parent;
    this.children = [];
};

/**
 *
 * @param {PossibilityTreeNode} child
 * @returns {undefined}
 */
PossibilityTreeNode.prototype.addChild = function (child) {
    this.children.push(child);
};

/**
 *
 * @param {PossibilityTreeNode} child
 * @returns {undefined}
 */
PossibilityTreeNode.prototype.removeChild = function (child) {
    this.children.splice(this.children.indexOf(child), 1);
};

/**
 * Remove this Node from its parent. If its parent now has no children, the
 * parent  be removed from the parent's parent.
 * @returns {undefined}
 */
PossibilityTreeNode.prototype.removeSelfFromParent = function () {
    this.parent.removeChild(this);
    if (this.parent.children.length === 0) {
        this.parent.removeSelfFromParent();
    }
};

PossibilityTreeNode.prototype.toString = function () {
    var toReturn = "";
    if (this.parent) {
        toReturn += this.parent.toString();
    }
    var c = "-";
    if (this.filled === Puzzle.FILLED) {
        c = "X";
    }
    for (var i = 0; i < this.count; i++) {
        toReturn += c;
    }
    return toReturn;
};