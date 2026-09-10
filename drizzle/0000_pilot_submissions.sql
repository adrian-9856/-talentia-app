CREATE TABLE IF NOT EXISTS pilot_submissions (
  id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  municipality TEXT NOT NULL,
  program_id TEXT NOT NULL,
  route_code TEXT NOT NULL CHECK (route_code IN ('A', 'B', 'C')),
  input_json TEXT NOT NULL,
  result_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
