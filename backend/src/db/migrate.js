const pool = require('./db');

const SONG_MEDIA = [
  {
    titre: 'Ma direction',
    audio_path: 'assets/audio/ma_direction_sexion_dassaut_2012.mp3',
    lyrics_path: 'assets/lyrics/sexion_dassaut_ma_direction.lrc',
  },
  {
    titre: 'Cry Me A River',
    audio_path: 'assets/audio/cry_me_a_river_justin_timberlake.mp3',
    lyrics_path: 'assets/lyrics/justin_timberlake_cry_me_a_river.lrc',
  },
  {
    titre: "Fallin'",
    audio_path: 'assets/audio/alicia_keys_fallin.mp3',
    lyrics_path: 'assets/lyrics/alicia_keys_fallin.lrc',
  },
  {
    titre: 'Drunk in Love',
    audio_path: 'assets/audio/beyonce_jayz_drunk_in_love.mp3',
    lyrics_path: 'assets/lyrics/beyonce_drunk_in_love.lrc',
  },
  {
    titre: 'Umbrella',
    audio_path: 'assets/audio/rihanna_umbrella.mp3',
    lyrics_path: 'assets/lyrics/rihanna_umbrella.lrc',
  },
  {
    titre: 'Melodrama',
    audio_path: 'assets/audio/disiz_theodora_melodrama.mp3',
    lyrics_path: 'assets/lyrics/disiz_theodora_melodrama.lrc',
  },
  {
    titre: 'Finesse',
    audio_path: 'assets/audio/bruno_mars_finesse_remix.mp3',
    lyrics_path: 'assets/lyrics/bruno_mars_finesse_remix.lrc',
  },
  {
    titre: 'La Foule',
    audio_path: 'assets/audio/edith_piaf_la_foule.mp3',
    lyrics_path: 'assets/lyrics/edith_piaf_la_foule.lrc',
  },
  {
    titre: 'Remember the Time',
    audio_path: 'assets/audio/michael_jackson_remember_the_time.mp3',
    lyrics_path: 'assets/lyrics/michael_jackson_remember_the_time.lrc',
  },
];

async function runMigrations() {
  await pool.query(`
    ALTER TABLE song
    ADD COLUMN IF NOT EXISTS audio_path VARCHAR(255),
    ADD COLUMN IF NOT EXISTS lyrics_path VARCHAR(255)
  `);

  for (const song of SONG_MEDIA) {
    await pool.query(
      `UPDATE song
       SET audio_path = $1, lyrics_path = $2
       WHERE titre = $3 AND (audio_path IS NULL OR lyrics_path IS NULL)`,
      [song.audio_path, song.lyrics_path, song.titre],
    );
  }
}

module.exports = { runMigrations };
