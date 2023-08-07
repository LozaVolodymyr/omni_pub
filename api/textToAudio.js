const { processRequest } = require('../util')

const user_id = 'lmGmffci5QQjFxkjWLbTGrxhoSd2';
const api_key = 'e8a39ca867034b9897f991ad655bafb8';
const baseUrl = 'https://play.ht/api/v1';
const defaultVoice = "en-US-JennyNeural";


const convert = async ({ text }) => {
    try {
        const response = await processRequest({ 
            method: 'post', 
            url: `${baseUrl}/convert`, 
            headers: {
            Authorization: api_key,
            'X-User-Id': user_id
        },
        data: {
            "content": [
                text
            ],
            "voice": defaultVoice
          }
        });
        return response
    } catch (error) {
        console.log('TextToAudio convert request fail', error);
    }
}

const articleStatus = async ({ transcriptionId }) => {
    try {
        const response = await processRequest({ 
            method: 'get', 
            url: `${baseUrl}/articleStatus?transcriptionId=${transcriptionId}`, 
            headers: {
            Authorization: api_key,
            'X-User-Id': user_id
        }
        });
        return response
    } catch (error) {
        console.log('articleStatus convert request fail', error);
    }
}


module.exports = {
    convert,
    articleStatus
}
