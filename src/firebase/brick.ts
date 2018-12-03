var firestore = require('./firestore');
var bricksRef = firestore.collection('bricks');

function brickRef(brickId) { return bricksRef.doc(brickId); }

/**
 * Get all bricks
 * @returns {Object[]} All Bricks ids and titles
 */
exports.getBricks = function () {
  return bricksRef.get().then(brickSnapshots => {
    const bricks = [];
    brickSnapshots.forEach(brickSnapshoot => {
      const title = brickSnapshoot.data().title;
      bricks.push({id: brickSnapshoot.id, title});
    });
    return bricks;
  });
}

/**
 * Create brick
 * @param {object} Brick object
 * @return {string} Brick Id
 */
exports.createBrick = function (brickObj) {
  brickObj.argScope = 0;
  brickObj.creationDate = new Date();
  return bricksRef.add(brickObj).then(ref => ref.id);
}

/**
 * Update brick
 * @param {string} brickId Brick Id
 * @param {object} brickObj object
 * @return {string} Brick Id
 */
exports.updateBrick = function (brickId, brickObj) {
  return brickRef(brickId).set(brickObj).then(ref => ref.id);
}

/**
 * Delete brick
 * @param {string} brickId Brick Id
 * @return {string} Brick Id
 */
exports.deleteBrick = function (brickId) {
  return brickRef(brickId).delete().then(ref => ref.id);
}
