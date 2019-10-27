SELECT json_build_object (
    'title', polls.title,
    'creator', polls.creator,
    'guild', polls.guild,
    'id', polls.id,
    'options', polls.options,
    'closed', polls.closed,
    'settings', json_build_object(
        'poll_id', settings.poll_id,
        'anonymousVotes', settings.anonymousvotes,
        'customPrompts', settings.customprompts,
        'numOptions', settings.numoptions,
        'endTimestamp', settings.endtimestamp
    )
)
FROM polls
INNER JOIN settings ON polls.id = settings.poll_id