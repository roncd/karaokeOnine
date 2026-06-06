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