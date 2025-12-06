import request from "../configs/request"

const login = async (data) => {
    return await request.post('/api/v1/auth/login', data)
}

const register = async (data) => {
    return await request.post('/api/v1/auth/register', data)
}

// Practice API functions
const getAllSentences = async () => {
    return await request.get('/api/v1/practice')
}

const getSentenceById = async (sentenceId) => {
    return await request.get(`/api/v1/practice/sentences/${sentenceId}`)
}

const getRandomSentence = async (difficulty = null) => {
    const params = difficulty ? `?difficulty=${difficulty}` : ''
    return await request.get(`/api/v1/practice/sentences/random/any${params}`)
}

const getRandomSentenceByTopic = async (topic, difficulty = null) => {
    const params = new URLSearchParams({ topic })
    if (difficulty) params.append('difficulty', difficulty)
    return await request.get(`/api/v1/practice/sentences/random/topic?${params.toString()}`)
}

const getAllTopics = async () => {
    return await request.get('/api/v1/practice/topics')
}

const evaluatePronunciation = async (data) => {
    return await request.post('/api/v1/practice/evaluate', data)
}

export {
    login, 
    register,
    getAllSentences,
    getSentenceById,
    getRandomSentence,
    getRandomSentenceByTopic,
    getAllTopics,
    evaluatePronunciation
}