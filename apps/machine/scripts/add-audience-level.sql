ALTER TABLE content_topics ADD COLUMN IF NOT EXISTS audience_level TEXT;

UPDATE content_topics SET audience_level = 'iniciante'
WHERE description LIKE '%iniciante%';

UPDATE content_topics SET audience_level = 'intermédio'
WHERE description LIKE '%intermédio%' OR description LIKE '%intermedio%';

UPDATE content_topics SET audience_level = 'avançado'
WHERE description LIKE '%avançado%' OR description LIKE '%avancado%';

UPDATE content_topics SET audience_level = 'intermédio'
WHERE audience_level IS NULL;
