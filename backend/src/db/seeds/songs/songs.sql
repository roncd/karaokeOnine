-- Données de test/ Catalogue de chansons
-- psql -U postgres -d karaoke_dev -f backend/src/db/seeds/songs.sql

INSERT INTO song (titre, artiste, genre, duree, annee) VALUES
('Ma direction',      'Sexion d''assaut',      'Rap',                270, 2012),
('Cry Me A River',    'Justin Timberlake',     'Pop',                300, 2002),
('Fallin''',          'Alicia Keys',           'Soul',               215, 2001),
('Drunk in Love',     'Beyonce et Jay-Z',      'Pop',                332, 2013),
('Umbrella',          'Rihanna',               'R&B',                280, 2007),
('Melodrama',         'Disiz et Théodora',     'Pop',                177, 2025),
('Finesse',           'Bruno Mars et Cardi B', 'Funk',               207, 2016),
('La Foule',          'Edith Piaf',            'Variété française',  203, 1958),
('Remember the Time', 'Michael Jackson',       'R&B',                232, 1992),
('Bohemian Rhapsody', 'Queen',                 'Rock',               354, 1975),
('Save Your Tears',   'The Weeknd',            'Pop',                215, 2020),
('Bella Ciao',        'Traditionnel',          'Folk',               180, 1943),
('Blinding Lights',   'The Weeknd',            'Pop',                200, 2019),
('La Vie en Rose',    'Édith Piaf',            'Chanson française',  210, 1947);


ALTER TABLE song ADD COLUMN IF NOT EXISTS audio_path VARCHAR(255);
ALTER TABLE song ADD COLUMN IF NOT EXISTS lyrics_path VARCHAR(255);

UPDATE song SET 
  audio_path = 'assets/audio/ma_direction_sexion_dassaut_2012.mp3',
  lyrics_path = 'assets/lyrics/sexion_dassaut_ma_direction.lrc'
WHERE titre = 'Ma direction';

UPDATE song SET 
  audio_path = 'assets/audio/cry_me_a_river_justin_timberlake.mp3',
  lyrics_path = 'assets/lyrics/justin_timberlake_cry_me_a_river.lrc'
WHERE titre = 'Cry Me A River';

UPDATE song SET 
  audio_path = 'assets/audio/alicia_keys_fallin.mp3',
  lyrics_path = 'assets/lyrics/alicia_keys_fallin.lrc'
WHERE titre = 'Fallin''';

UPDATE song SET 
  audio_path = 'assets/audio/beyonce_jayz_drunk_in_love.mp3',
  lyrics_path = 'assets/lyrics/beyonce_drunk_in_love.lrc'
WHERE titre = 'Drunk in Love';

UPDATE song SET 
  audio_path = 'assets/audio/rihanna_umbrella.mp3',
  lyrics_path = 'assets/lyrics/rihanna_umbrella.lrc'
WHERE titre = 'Umbrella';

UPDATE song SET 
  audio_path = 'assets/audio/disiz_theodora_melodrama.mp3',
  lyrics_path = 'assets/lyrics/disiz_theodora_melodrama.lrc'
WHERE titre = 'Melodrama';

UPDATE song SET 
  audio_path = 'assets/audio/bruno_mars_finesse_remix.mp3',
  lyrics_path = 'assets/lyrics/bruno_mars_finesse_remix.lrc'
WHERE titre = 'Finesse';

UPDATE song SET 
  audio_path = 'assets/audio/edith_piaf_la_foule.mp3',
  lyrics_path = 'assets/lyrics/edith_piaf_la_foule.lrc'
WHERE titre = 'La Foule';

UPDATE song SET 
  audio_path = 'assets/audio/michael_jackson_remember_the_time.mp3',
  lyrics_path = 'assets/lyrics/michael_jackson_remember_the_time.lrc'
WHERE titre = 'Remember the Time';