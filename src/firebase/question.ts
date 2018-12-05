import { Question } from "../bricks";

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

/**
 * 
 * @param brickId Brick Id
 * @param questionId Question Id
 * @return {QuestionRef} reference to specific question
 */
function questionRef(brickId: string, questionId: string) {
  return questionsRef(brickId).doc(questionId);
}

/**
 * Get one question by Brick Id and Question Id
 * @param {string} brickId Brick Id.
 * @param {string} questionId Question Id.
 * @returns question
 */
function getQuestion(brickId: string, questionId: string) {
  return questionRef(brickId, questionId).get().then(question => question.data());
}

/**
 * Create question in bricks Collection
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
 * @returns Promise with questionId
 */
exports.createQuestion = async function (brickId: string, questionId: string, questionObj: Question) {
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
 * Update question in bricks Collection
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
 * @returns Promise with questionObj
 */
exports.updateQuestion = async function (brickId: string, questionId: string, questionObj: Question) {
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

  if (await getQuestion(brickId, questionId)) {
    return questionRef(brickId, questionId).set(questionObj);
  } else {
    return new Promise((res, rej) => rej('Question with Id = ' + questionId + ' doen`t exist'));
  }
}

/**
 * Delete question
 * @param {string} brickId Brick Id.
 * @param {string} questionId Question Id.
 */
exports.deleteQuestion = async function (brickId: string, questionId: string) {
  //if question with such name do not exist
  if (await getQuestion(brickId, questionId)) {
    return questionRef(brickId, questionId).delete();
  } else {
    return new Promise((res, rej) => rej('Question with Id = ' + questionId + ' doen`t exist'));
  }
}

exports.getQuestion = async function (brickId: string, questionId: string) {
  const question = await getQuestion(brickId, questionId);
  if (question) {
    return questionRef(brickId, questionId).get().then(question => question.data());
  } else {
    return new Promise((res, rej) => rej('Question with Id = ' + questionId + ' doen`t exist'));
  }
};

/**
 * Get Questions of Brick
 * @param {string} brickId
 * @returns {array} questions
 */
exports.getBrickQuestions = async function (brickId: string) {
  return questionsRef(brickId).orderBy("number", "asc").get()
  .then((questionsSnapshot) => {
    if (!questionsSnapshot.empty) {
      return questionsSnapshot.docs.map((questionSnapshot) => {
        var qstn = questionSnapshot.data();
        qstn._path = questionSnapshot.ref.path;
        return qstn;
      });
    } else {
      return [];
    }
  })
}