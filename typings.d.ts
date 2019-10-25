
//db user
export interface user {
    id: string
    name?: string
    guilds: string[] //array of guild ids
    polls: string[] //array of UUID's to corresponding ids of poll objects
    votes: number //number of times this user has voted on something
}

export interface poll {
    title: string
    creator: string
    guild: string
    id?: string //UUID identifier for 
    options: string[]
    settings?: object
    votes: object[] | null
    graph?: string //UUID to graph obj, contains the date 
}

export interface vote {
    poll: string //poll UUID
    id: string //id of the voter
    option: object
}

export interface graph {
    type: string
    data: any[]
    image: string //base64 encoded image data
    pollId: string //UUID of the poll
    id: string //UUID of the graph
}

export interface option {
    question: string
    emoji: string
}