import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import fs from 'node:fs';
import path from 'node:path';

let movies = []
let videoFiles = [];
const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.flv', '.wmv'];

export default {
    readMediaInfos,
    clear
};

function readMediaInfos(filePath) {
        
    fileExporter(filePath)
    videoReader()
    return movies;
}

function fileExporter(filePath) {
    const files = fs.readdirSync(filePath, {recursive: true});

        files.forEach(file => {
            const fullPath = path.join(filePath, file);
            const fileStat = fs.statSync(fullPath);

            if (fileStat.isFile() && videoExtensions.includes(path.extname(file).toLowerCase())) {
                videoFiles.push(fullPath);
            }

        });
}

function videoReader() {
    videoFiles.forEach(videoPath => {
        ffprobe(videoPath, { path: ffprobeStatic.path }, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                const mediaInfo = {
                    "name": videoPath,
                    "video": info.streams.find(stream => stream.codec_type === 'video'),
                    "audio": info.streams.find(stream => stream.codec_type === 'audio')
                };
                movies.push(mediaInfo);
            }
        });
    })
}

function clear(){
    movies = []
    videoFiles = []
}