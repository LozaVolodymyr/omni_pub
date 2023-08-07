const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);


const localFilePath = path.join(__dirname, '../audio_tracks');
const localJsonPath = path.join(__dirname, '../player');

const processRequest = async ({ method, url, data = {}, headers = {} }) => {
    try {
        const response = await axios.request({
            method,
            url,
            data,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to make ${method} request to ${url}:`, error);
        throw error;
    }
};

async function callApiUntilTrue({ handler, args, maxAttempts = 10 }) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await handler(args);
        console.log('Check status :', response)
        if (response.converted) {
          return response;
        }
      } catch (error) {
        console.error(`Attempt ${attempt}: Error calling API:`, error.message);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
  }


const downloadFile = async ({ url, filename }) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });
        const writer = fs.createWriteStream(path.join(localFilePath, filename));
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (err) {
        console.log(`Error downloading file: ${err.message}`);
    }
};

const uploadJson = async ({ filename }) => {
    try {
        
        const emotioalKeyPath = path.join(localJsonPath, `${filename}_emotionkey.json`);
        const bsweightPath = path.join(localJsonPath, `${filename}_bsweight.json`);
    
        const [emotioalKeyJSON, bsweightJSON] = await Promise.all([
            readFileAsync(emotioalKeyPath, 'utf8'),
            readFileAsync(bsweightPath, 'utf8')
          ]);
          return { emotionkey: JSON.parse(emotioalKeyJSON), bsweight: JSON.parse(bsweightJSON) };
    } catch (error) {
        console.log(`Error uploadJson file: ${error.message}`);
    }

}


module.exports = {
    processRequest,
    callApiUntilTrue,
    downloadFile,
    uploadJson
}