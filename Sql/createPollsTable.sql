CREATE TABLE IF NOT EXISTS polls (
    title VARCHAR(1100) NOT NULL,
    creator VARCHAR(20) NOT NULL,
    guild VARCHAR(20) NOT NULL,
    id UUID NOT NULL,
    options TEXT[] NOT NULL,
    PRIMARY KEY(id)
)
