export const TOAST_MESSAGES = {
  voteRecorded: {
    variant: 'success',
    title: 'Vote enregistré',
    subtitle: '',
  },
  roomFull: {
    variant: 'error',
    title: 'Salon plein',
    subtitle:
      'Le salon que vous essayez de rejoindre est plein (9/9), veuillez essayer un autre code.',
  },
  songNotFound: {
    variant: 'error',
    title: 'Morceau introuvable',
    subtitle:
      'Le morceau que vous cherchez est introuvable, veuillez essayer un autre morceau.',
  },
  songAdded: {
    variant: 'success',
    title: 'Morceau ajouté',
    subtitle: 'Le morceau a été ajouté à la file d\'attente.',
  },
  songDeleted: {
    variant: 'success',
    title: 'Morceau supprimé',
    subtitle: 'Le morceau a été retiré de la file d\'attente.',
  },
  songSkipped: {
    variant: 'success',
    title: 'Morceau passé',
    subtitle: 'Le morceau a été passé.',
  },
  skipVote: {
    variant: 'success',
    title: 'Vote enregistré',
    subtitle: 'Votre vote pour passer le morceau a été pris en compte.',
  },
};

export function buildToast(presetKey, overrides = {}) {
  const preset = TOAST_MESSAGES[presetKey] || {};
  return { ...preset, ...overrides };
}
