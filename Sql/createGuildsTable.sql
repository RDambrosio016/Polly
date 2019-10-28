CREATE TABLE IF NOT EXISTS guilds (
    id VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    prefix TEXT DEFAULT 'p!',
    pollMasterRole TEXT DEFAULT NULL,
    creationPermissions INT DEFAULT 0
)

-- creationPermissions:
-- 0: only people with admin permissions/ pollMasterRole can create polls
-- 1: only people with personalPoll role and above can create roles
-- 2: anybody can create a poll