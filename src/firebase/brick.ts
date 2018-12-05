var firestore = require('./firestore');
var bricksRef = firestore.collection('bricks');

/**
 * Get Brick Reference
 * @param brickId Brick Id
 * @returns Brick Reference
 */
function brickRef(brickId) { return bricksRef.doc(brickId); }

/**
 * Get Brick
 * @param brickId Brick Id
 * @returns Promise with Brick
 */
function getBrick(brickId) {
  return brickRef(brickId).get().then(brick => brick.data());
}

/**
 * Get all brick ids and titles
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

  // check brick data
  if (!brickObj.brief) { return new Promise((res, rej) => rej('Brief is required')); }
  if (!brickObj.title) { return new Promise((res, rej) => rej('Title is required')); }

  return bricksRef.add(brickObj).then(ref => ref.id);
}

/**
 * Update brick
 * @param {string} brickId Brick Id
 * @param {object} brickObj object
 * @return {string} Brick Id
 */
exports.updateBrick = async function (brickId, brickObj) {
  // check brick data
  if (!brickObj.brief) { return new Promise((res, rej) => rej('Brief is required')); }
  if (!brickObj.title) { return new Promise((res, rej) => rej('Title is required')); }

  if (await getBrick(brickId)) {
    return brickRef(brickId).set(brickObj).then(ref => ref.id);
  } else {
    return new Promise((res, rej) => rej('Brick with Id = ' + brickId + ' not found'));
  }
}

/**
 * Delete brick
 * @param {string} brickId Brick Id
 * @return {string} Brick Id
 */
exports.deleteBrick = async function (brickId) {
  if (await getBrick(brickId)) {
    return brickRef(brickId).delete().then(ref => ref.id);
  } else {
    return new Promise((res, rej) => rej('Brick with Id = ' + brickId + ' not found'));
  }
}
