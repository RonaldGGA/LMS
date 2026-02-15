CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE "BookTitle" ADD COLUMN search_document tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('spanish', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('spanish', coalesce("authorName", '')), 'B')
) STORED;

CREATE INDEX book_search_idx ON "BookTitle" USING GIN (search_document);