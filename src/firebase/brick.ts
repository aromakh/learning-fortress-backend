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
 * Get one brick by id
 * @param {string} brickId Brick id.
 * @returns {Object} brick
 */
exports.getBrick = function (brickId) {
  return brickRef(brickId).get().then(brick => {
    if (!brick.exists) {
      return null;
    } else {
      return brick.data();
    }
  });
}

exports.getBrick = function (brickId) {
  return brickRef(brickId).get().then(brickSnapshot => {
    if (!brickSnapshot.exists) {
      return null;
    } else {
      const brick = brickSnapshot.data();
      brick.id = brickSnapshot.id;
      brick._path = brickSnapshot.ref.path;
      return brick;
    }
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
