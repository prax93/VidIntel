import ffprobe from 'ffprobe';
import ffprobePath from 'ffmpeg-ffprobe-static';
import fs from 'node:fs';
import path from 'node:path';
import jsonCreator from './jsonCreator.js';

let movies = []
let videoFiles = [];
const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.flv', '.wmv'];

export default {
    readMediaInfos,
    getVideoMetaData
};

async function readMediaInfos(filePath) {
    try {
        await fileExporter(filePath);
        await videoReader();
    } 
    catch (error) {
        console.error('Error reading media infos:', error);
        throw error;
    }
}

async function fileExporter(filePath) {
    const files = fs.readdirSync(filePath, {recursive: true});
    files.forEach(file => {
        const fullPath = path.join(filePath, file);
        const fileStat = fs.statSync(fullPath);
        if ((fileStat.isFile() && videoExtensions.includes(path.extname(file).toLowerCase()))) {
            videoFiles.push(fullPath);
        }
        else if (!(fileStat.isFile() && videoExtensions.includes(path.extname(file).toLowerCase())) && !fileStat.isDirectory()) {
            console.info(`%s: is not a valid media file`, file);
        }
    });
}

async function videoReader() {
    console.info(`${new Date().toISOString()} Media Sync Started`);
    for (const videoPath of videoFiles) {
        try {
            const info = await ffprobe(videoPath, { path: ffprobePath.ffprobePath });
            if (info) {
                const videoFile = path.basename(videoPath);
                const videoStream = info.streams.find(stream => stream.codec_type === 'video');
                const audioStreams = info.streams.filter(stream => stream.codec_type === 'audio');

                const mediaInfo = {
                    name: videoFile,
                    path: videoPath,
                    size: `${(fs.statSync(videoPath).size / 1024 / 1024 / 1024).toFixed(2)} GB`,
                    resolution: videoStream ? `${videoStream.width}x${videoStream.height}` : 'Unknown',
                    aspectRatio: videoStream?.display_aspect_ratio || 'Unknown',
                    codec: videoStream?.codec_long_name || 'Unknown',
                    audio: audioStreams.map(audio => ({
                        language: audio.tags?.language || 'und',
                        channels: audio.channels || 'Unknown',
                        channelsLayout: audio.channel_layout || 'Unknown',
                        codec: audio.codec_name || 'Unknown',
                        profile: audio.profile || 'Unknown'
                    }))
                };
                movies.push(mediaInfo);
            }
        } catch (err) {
            console.warn(`Error processing ${videoPath}:`, err.message);
        }
    }
    jsonCreator.writer('./movies.json', JSON.stringify(movies));
    videoFiles = []
    console.info(`${new Date().toISOString()} Media Sync Finished sucessfully`);

}

function getVideoMetaData() {
    return movies;
}