CREATE TABLE IF NOT EXISTS votes (
    vote_user VARCHAR(20) NOT NULL,
    poll_id UUID NOT NULL,
    vote_timestamp BIGINT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);