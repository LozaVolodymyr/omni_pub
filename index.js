const express = require('express');



const audio2face = require('./api/audioToFace');
const text2audio = require('./api/textToAudio');
const util = require('./util')
const app = express();

let instances;

app.use(express.json()); // for parsing application/json
app.post('/api/v1/t2b', async (req, res) => {

    try {
        const data = req.body;
        const { transcriptionId } = await text2audio.convert({ text: data.text });
        const { audioUrl } = await util.callApiUntilTrue({ handler: text2audio.articleStatus, args: { transcriptionId }});
        const filename = (`test${transcriptionId}.wav`.toLowerCase()).replace(/-/g, '_'); // weird logic regarding name, need document clarification
        await util.downloadFile({ url: audioUrl, filename });
        console.log('Successfully File donwloaded');
        
        await audio2face.setTrack({ instances, filename });
        await audio2face.generateKeys(instances);
        
        await Promise.all([
            audio2face.exportEmotionKeys({ instances, filename }),  
            audio2face.exportBlendshapes({ instances, filename })
        ])
        
        // return files and 
        const json = await util.uploadJson({ filename });
        console.log('Successfully uploadJson')
        res.json(json);
        console.log('Successfully flow end')
    } catch (error) {
        res.status(500).json(error.message);
    }

});


// Wrap the server.listen callback in an async function
app.listen(8001, async () => {
    console.log('Server is running on port 8001');

    await audio2face.startUpAudioToFace();
    await audio2face.loadUsd();
    instances = await audio2face.getInstances();
    await audio2face.setRootPath(instances);

    
});
