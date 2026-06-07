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
('La Foule',          'Edith Piaf',            'Variété française',  203, 1958);
('Remember the Time', 'Michael Jackson',       'R&B',                232, 1992),
('Bohemian Rhapsody', 'Queen',                 'Rock',               354, 1975),
('Save Your Tears',   'The Weeknd',            'Pop',                215, 2020),
('Bella Ciao',        'Traditionnel',          'Folk',               180, 1943),
('Blinding Lights',   'The Weeknd',            'Pop',                200, 2019),
('La Vie en Rose',    'Édith Piaf',            'Chanson française',  210, 1947)


ALTER TABLE song ADD COLUMN IF NOT EXISTS audio_path VARCHAR(255);
ALTER TABLE song ADD COLUMN IF NOT EXISTS lyrics_path VARCHAR(255);

-- Mettre à jour les chemins pour chaque chanson
UPDATE song SET 
  audio_path = 'Ma Direction - Sexion dAssaut Karaoké (2012).mp3',
  lyrics_path = 'assets/lyrics/Sexion Dassaut - Ma Direction.lrc'
WHERE titre = 'Ma direction';

UPDATE song SET 
  audio_path = 'assets/audio/Cry Me a River - Justin Timberlake _ Karaoke Version _ KaraFun.mp3',
  lyrics_path = 'assets/lyrics/Justin Timberlake - Cry Me A River.lrc'
WHERE titre = 'Cry Me A River';

UPDATE song SET 
  audio_path = 'assets/audio/Alicia Keys - Fallin (Karaoke Version).mp3',
  lyrics_path = 'assets/lyrics/Alicia Keys - Fallin.lrc'
WHERE titre = 'Fallin''';

UPDATE song SET 
  audio_path = 'assets/audio/Drunk in Love - Beyoncé & Jay-Z _ Karaoke Version _ KaraFun.mp3',
  lyrics_path = 'assets/lyrics/Beyoncé - Drunk In Love (feat. Jay Z).lrc'
WHERE titre = 'Drunk in Love';

UPDATE song SET 
  audio_path = 'assets/audio/Rihanna - Umbrella - Rihanna & Jay-Z _ Karaoke Version _ KaraFun.mp3',
  lyrics_path = 'assets/lyrics/Rihanna - Umbrella (feat. Jay-Z).lrc'
WHERE titre = 'Umbrella';

UPDATE song SET 
  audio_path = 'assets/audio/Mélodrama - Disiz ft Theodora (Karaoke).mp3',
  lyrics_path = 'assets/lyrics/disiz & Theodora - melodrama.lrc'
WHERE titre = 'Melodrama';

UPDATE song SET 
  audio_path = 'assets/audio/Finesse (Remix) feat. Cardi B - Bruno Mars Karaoke.mp3',
  lyrics_path = 'assets/lyrics/Bruno Mars - Finesse (Remix) [feat. Cardi B].lrc'
WHERE titre = 'Finesse';

UPDATE song SET 
  audio_path = 'assets/audio/karaoké edith piaf la foule.mp3',
  lyrics_path = 'assets/lyrics/Édith Piaf - La foule (Remasterise en 2015).lrc'
WHERE titre = 'La Foule';

UPDATE song SET 
  audio_path = 'assets/audio/Remember the Time - Michael Jackson _ Karaoke Version _ KaraFun.mp3',
  lyrics_path = 'assets/lyrics/Michael Jackson - Remember the Time.lrc'
WHERE titre = 'Remember the Time';
