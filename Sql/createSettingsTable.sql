CREATE TABLE IF NOT EXISTS settings (
    poll_id UUID UNIQUE NOT NULL,
    anonymousVotes BOOLEAN DEFAULT FALSE,
    customPrompts TEXT[] DEFAULT NULL,
    numOptions INT DEFAULT 0,
    endTimestamp BIGINT DEFAULT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id)
);
