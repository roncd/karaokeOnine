-- Table SALON
CREATE TABLE IF NOT EXISTS salon (
    id SERIAL PRIMARY KEY, --id automatique
    code VARCHAR(8) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'En attente',
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table UTILISATEUR
CREATE TABLE IF NOT EXISTS utilisateur (
    id SERIAL PRIMARY KEY, --id automatique
    salon_id INTEGER NOT NULL REFERENCES salon(id) ON DELETE CASCADE,
    pseudo VARCHAR(20) NOT NULL, 
    role VARCHAR(20) NOT NULL DEFAULT 'Invité',
    joined TIMESTAMP NOT NULL DEFAULT NOW() 
);

-- Table CATALOGUE
CREATE TABLE IF NOT EXISTS song (
    id SERIAL PRIMARY KEY, --id automatique
    titre VARCHAR(100) NOT NULL,
    artiste VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    duree INTEGER,
    annee INTEGER
);

-- Table FILE D'ATTENTE
CREATE TABLE IF NOT EXISTS vote_skip (
    id SERIAL PRIMARY KEY, --id automatique
    salon_id INTEGER NOT NULL REFERENCES salon(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES utilisateur(id),
    song_id INTEGER NOT NULL REFERENCES song(id),
    position INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'En attente'
);

-- Table VOTE SKIP
CREATE TABLE IF NOT EXISTS queue (
    id SERIAL PRIMARY KEY, --id automatique
    salon_id INTEGER NOT NULL REFERENCES salon(id) ON DELETE CASCADE,
    queue_id INTEGER NOT NULL REFERENCES queue(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES utilisateur(id),
    created  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(queue_id, user_id)
);