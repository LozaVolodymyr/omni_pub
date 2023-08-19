const { processRequest } = require('../util')

const user_id = 'lmGmffci5QQjFxkjWLbTGrxhoSd2';
const api_key = 'e8a39ca867034b9897f991ad655bafb8';
const baseUrl = 'https://play.ht/api';
const defaultVoice = "en-US-JennyNeural";


const convert = async ({ text }) => {
    try {
        const response = await processRequest({ 
            method: 'post', 
            url: `${baseUrl}/v1/convert`, 
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
        console.log('TextToAudio convert request fail', error.message);
    }
}



const articleStatus = async ({ transcriptionId }) => {
    try {
        const response = await processRequest({ 
            method: 'get', 
            url: `${baseUrl}/v1/articleStatus?transcriptionId=${transcriptionId}`, 
            headers: {
            Authorization: api_key,
            'X-User-Id': user_id
        }
        });
        return response
    } catch (error) {
        console.log('articleStatus convert request fail', error.message);
    }
}

// v2
const convertV2 = async ({ text, voice = 'Larry' }) => {
    try {
        const response = await processRequest({ 
            method: 'post', 
            url: `${baseUrl}/v2/tts`, 
            headers: {
            Authorization: `Bearer ${api_key}`,
            'X-User-Id': user_id,
            accept: 'application/json'
        },
        data: {
            text,
            "output_format": "wav",
            voice
          }
        });
        return response
    } catch (error) {
        console.log('TextToAudio convert request fail', error);
    }
}


const articleStatusV2 = async ({ transcriptionId }) => {
    try {
        const response = await processRequest({ 
            method: 'get', 
            url: `${baseUrl}/v2/tts/${transcriptionId}`, 
            headers: {
            Authorization: `Bearer ${api_key}`,
            'X-User-Id': user_id
        }
        });
        return response
    } catch (error) {
        console.log('articleStatus convert request fail', error.message);
    }
}



module.exports = {
    convert,
    articleStatus,
    convertV2,
    articleStatusV2
}
