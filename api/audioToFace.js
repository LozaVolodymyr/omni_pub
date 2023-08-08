const { exec } = require('child_process');
const path = require('path');
const os = require('os');
 
const { processRequest } = require('../util')

const baseUrl = 'http://localhost:8011'
const username = os.userInfo().username;


const startUpAudioToFace = async () => { 
    const filePath = `C:\\Users\\${username}\\AppData\\Local\\ov\\pkg\\audio2face-2023.1.1\\audio2face_headless`;
    try {
        await exec(filePath)
        console.log(`audio2face_headless started successfully`);
            // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(`audio2face_headless delay for api start`);
    } catch (error) {
        console.error(`Error: audio2face_headless failed to execute: ${error.message}`);
    }
}
// 2. Set usd file
const loadUsd = async () => {
    try {
        const markTest2FilePath = path.join(__dirname, '../MarkTest2.usd');
        const response = await processRequest({ method: 'post', url: `${baseUrl}/A2F/USD/Load`, data: {
            file_name: markTest2FilePath }
        });
        console.log('Successfully made POST request after startup:', response);
    } catch (error) {
        console.error('Failed to make POST request after startup:', error.message);
    }
}
 
const getInstances = async () => {
    try {
        const response = await Promise.all([
            processRequest({ method: 'get', url: `${baseUrl}/A2F/Player/GetInstances`}), 
            processRequest({ method: 'get', url: `${baseUrl}/A2F/GetInstances`}), 
            processRequest({ method: 'get', url: `${baseUrl}/A2F/Exporter/GetBlendShapeSolvers`})])
        const [playerInstance, insance,  blendShape] = response;
        console.log('Successfully made GET requests for getInstances');
        return {
            playerInstance: playerInstance.result.regular[0],
            insance: insance.result.fullface_instances[0],
            blendShape: blendShape.result[0]
        };
    } catch (error) {
        console.error('Failed to make getInstances requests:', error.message);
    }
}

const setRootPath = async({ playerInstance })=> {
    try {
        const response = await processRequest({ method: 'post', url: `${baseUrl}/A2F/Player/SetRootPath`, data: {
            "a2f_player": playerInstance,
            "dir_path": path.join(__dirname, '../audio_tracks')
        }});
        console.log('Successfully made POST requests for SetRootPath');
    } catch (error) {
        console.error('Failed to make SetRootPath requests:', error.message);
    }
}

const setTrack = async({ instances, filename })=> {
    // Move to audio AI after generation audio file 5-8
    // 5. Set track

    try {
        const response = await processRequest({ method: 'post', url: `${baseUrl}/A2F/Player/SetTrack`, data: {
            "a2f_player": instances.playerInstance,
            "file_name": filename
        }});
        console.log('Successfully made POST requests for SetTrack:', response);
    } catch (error) {
        console.error('Failed to make SetTrack requests:', error.message);
    }
}



const generateKeys = async({ insance })=> { 
    // 6. Generate Keys 
    // Need to wait while set track upload or retry request on fail
    await new Promise(resolve => setTimeout(resolve, 5000)); // [TODO] remove, better retry 
    try {
        const response = await processRequest({ method: 'post', url: `${baseUrl}/A2F/A2E/GenerateKeys`, data: {
            "a2f_instance": insance,
        }});
        console.log('Successfully made POST requests for GenerateKeys:', response);
    } catch (error) {
        console.error('Failed to make GenerateKeys requests:', error.message);
    }
}


const exportEmotionKeys = async({ instances, filename })=> { 
    // 7. Export Emotional Keys
    try {
        const response = await processRequest({ method: 'post', url: `${baseUrl}/A2F/Exporter/ExportEmotionKeys`, data: {
            "a2f_node": instances.insance,
            "export_directory": path.join(__dirname, '../player'),
            "file_name": filename,
            "format": "json",
            "batch": false
        }});
        console.log('Successfully made POST requests for ExportEmotionKeys:', response);
    } catch (error) {
        console.error('Failed to make ExportEmotionKeys requests:', error.message);
    }
}

const exportBlendshapes = async({ instances, filename })=> { 
    // 8. Export Blend shapes
    try {
        const response = await processRequest({ method: 'post', url: `${baseUrl}/A2F/Exporter/ExportBlendshapes`, data: {
            "solver_node": instances.blendShape,
            "export_directory": path.join(__dirname, '../player'),
            "file_name": filename,
            "format": "json",
            "batch": false,
            "fps": 20
        }});
        console.log('Successfully made POST requests for ExportBlendshapes:', response);
    } catch (error) {
        console.error('Failed to make ExportBlendshapes requests:', error.message);
    }
}


module.exports = {
    startUpAudioToFace,
    loadUsd,
    getInstances,
    setRootPath,
    setTrack,
    generateKeys,
    exportEmotionKeys,
    exportBlendshapes
}