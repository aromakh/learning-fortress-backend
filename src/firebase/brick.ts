import { Brick } from "../bricks";

var firestore = require('./firestore'),
  bricksRef = firestore.collection('bricks'),
  questionFirebase = require('../firebase/question');

/**
 * Get Brick Reference
 * @param brickId Brick Id
 * @returns Brick Reference
 */
function brickRef(brickId) { return bricksRef.doc(brickId); }

/**
 * Get Brick
 * @param {string} brickId Brick Id
 * @returns {Promise} Promise with Brick
 */
function getBrick(brickId: string) {
  return brickRef(brickId).get().then(brick => brick.data());
}

/**
 * Get brcik with path
 * @param {string} brickId BrickId
 * @returns {Promise} Promise with brick which has path
 */
function getBrickWithPath(brickId: string) {
  return brickRef(brickId).get().then(brickSnapshot => {
    if (brickSnapshot.exists) {
      const brick = brickSnapshot.data();
      brick._path = brickSnapshot.ref.path;
      return brick;
    } else {
      return null;
    }
  });
}
/**
 * Get Brick with pallet and questions
 * @param {string} brickId
 * @returns {Promise} Promise with brick which has questions and pallet
 */
exports.getFullBrick = async function (brickId: string) {
  // get brick with path
  const brick = await getBrickWithPath(brickId);
  if (!brick) { return new Promise((res, rej) => rej('Document not found')); }

  // get questions
  const questions = await questionFirebase.getBrickQuestions(brickId);
  if (questions.length == 0) { return new Promise((res, rej) => rej('Collection haven`t items'))}
  brick.questions = questions;

  // get pallet
  return brick.pallet.get().then((palletSnapshot) => {
    if (palletSnapshot.exists) {
      brick.pallet = palletSnapshot.data();
      brick.pallet.bricks = [];
      brick.pallet._path = palletSnapshot.ref.path;
      return brick;
    } else {
      throw "Document not found";
    }
  });
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
exports.createBrick = function (brickObj: Brick) {
  brickObj.avgScore = 0;
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
exports.updateBrick = async function (brickId: string, brickObj: Brick) {
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
exports.deleteBrick = async function (brickId: string) {
  if (await getBrick(brickId)) {
    return brickRef(brickId).delete().then(ref => ref.id);
  } else {
    return new Promise((res, rej) => rej('Brick with Id = ' + brickId + ' not found'));
  }
}
