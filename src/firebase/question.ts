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
function getQuestion(brickId, questionId) {
  return questionRef(brickId, questionId).get().then(question => question.data());
}

/**
 * Create question in brick Collection
 * Question require components which must be array of components
 * Each component had data and name property
 * @param {string} brickId Brick Id.
 * @param {string} questionId Question Id.
 * @param {object} question Question object
 * {
 *     components: [
 *         data: object
 *         name: string
 *     ]
 * }
 * @returns questionId
 */
exports.createQuestion = async function (brickId, questionId, questionObj) {
  // questionId must be a string
  if (!questionId || typeof questionId !== 'string') {
    return new Promise((res, rej) => rej('Id of question must be a string'));
  }

  // components is required and must be an array
  if (!questionObj.components || !Array.isArray(questionObj.components)) {
    return new Promise((res, rej) => rej('Question hasn`t components property which is an array'));
  }

  // each component must have name and data property, name must be a string and data is an object
  for (let i = 0; i < questionObj.components.length; i++) {
    const component = questionObj.components[i];
    if (!component.name || typeof component.name !== 'string') {
      return new Promise((res, rej) => rej('component.name must be a string'));
    }
    if (!component.data || typeof component.data !== 'object') {
      return new Promise((res, rej) => rej('component.data must an object'));
    }
  }

  //if question with such name do not exist
  if (!await getQuestion(brickId, questionId)) {
    return questionsRef(brickId).doc(questionId).set(questionObj).then(ref => ref.id);
  } else {
    return new Promise((res, rej) => rej('Question with such Id already exist'));
  }
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

exports.getQuestion = getQuestion;
