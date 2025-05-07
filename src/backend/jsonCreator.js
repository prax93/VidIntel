import fs from 'node:fs'


export default {
    writer,
    reader
}

function writer(jsonFile, jsonData){
    fs.writeFile(jsonFile, JSON.stringify(jsonData, null, 2), 'utf8', (error) => {
        if (error) {
            console.error('Error writing file:', error);
        } else {
            console.log('File written successfully');
        }
    });
}

function reader(filePath, callback) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err)
            return null
        }
        callback(null, data);
    });
}