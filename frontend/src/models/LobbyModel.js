/**
 * LobbyModel.js
 * Handles lobby data and business logic
 */

const LOBBY_ID_LENGTH = 6;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const LobbyModel = {
  /**
   * Generates a random 6-character lobby ID
   * @returns {string} e.g. "K9F2XA"
   */
  generateId() {
    return Array.from({ length: LOBBY_ID_LENGTH }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('');
  },

  /**
   * Validates a lobby ID string
   * @param {string} id
   * @returns {{ valid: boolean, error?: string }}
   */
  validateId(id) {
    if (!id || id.trim().length === 0) {
      return { valid: false, error: 'Please enter a lobby ID.' };
    }
    if (id.trim().length !== LOBBY_ID_LENGTH) {
      return { valid: false, error: `ID must be exactly ${LOBBY_ID_LENGTH} characters.` };
    }
    if (!/^[A-Z0-9]+$/i.test(id.trim())) {
      return { valid: false, error: 'ID may only contain letters and numbers.' };
    }
    return { valid: true };
  },

  /**
   * Normalises a lobby ID to uppercase
   * @param {string} id
   * @returns {string}
   */
  normaliseId(id) {
    return id.trim().toUpperCase();
  },
};
