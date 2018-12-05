import { BrickSnapshot, BrickAttempt, PalletSnapshot } from "../models/bricks";

var firestore = require('./firestore');
var palletsRef = firestore.collection('pallets');

/**
 * Get Pallet Reference
 * @param brickId Brick Id
 * @returns Brick Reference
 */
function palletRef(palletId) { return palletsRef.doc(palletId); }

/**
 * Get pallet from brick
 * @param {BrickSnapshot} Brick
 * @returns {Pallet} Pallet
 */
exports.getPalletFromBrick = function (brick: BrickSnapshot) {
  return brick.pallet.get().then(palletSnapshot => {
    if (palletSnapshot.exists) {
      const pallet = palletSnapshot.data();
      pallet._path = palletSnapshot.ref.path;
      return pallet;
    } else {
      return null;
    }
  });
}

/**
 * Get pallet by Id
 * @param {string} palletId
 */
function getPalletById(palletId: string) {
  return palletRef(palletId).get();
}

/**
 * Get pallet reference by Id
 * @param {string} palletId
 * @returns Pallet
 */
exports.getPalletReference = async function (palletId: string) {
  var pallet = await getPalletById(palletId);
  if (!pallet.exists) { return null; }
  return pallet._ref;
}