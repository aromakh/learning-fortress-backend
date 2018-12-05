var firestore = require('./firestore');
var bricksRef = firestore.collection('bricks');

/**
 * Get Question ref
 * @param {String} brickId Brick Id
 * @return {QuestionRef} reference to question collection
 */
function questionsRef(brickId: string) {
  return bricksRef.doc(brickId).collection('questions');
}

function questionRef(brickId, questionId) {
  return questionsRef(brickId).doc(questionId);
}

/**
 * Get one question by Brick Id and Question Id
 * @param {string} brickId Brick Id.
 * @param {string} questionId Question Id.
 * @returns question
 */
exports.getQuestion = function (brickId, questionId) {
  return questionRef(brickId, questionId).get().then(question => question.data());
}

/**
 * Create question
 * @param {string} brickId Brick Id.
 * @param {object} question Question object.
 * @returns questionId
 */
exports.createQuestion = function (brickId, questionObj) {
  return questionsRef(brickId).add(questionObj).then(ref => ref.id);
}

/**
 * Update question
 * @param {string} brickId Brick Id.
 * @param {string} questionId Question Id.
 * @param {object} question Question object.
 */
exports.updateQuestion = function (brickId, questionId, questionObj) {
  return questionRef(brickId, questionId).set(questionObj);
}

/**
 * Delete question
 * @param {string} brickId Brick Id.
 * @param {string} questionId Question Id.
 */
exports.deleteQuestion = function (brickId, questionId) {
  return questionRef(brickId, questionId).delete();
}
