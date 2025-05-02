import fs from 'node:fs'


export default {
    writer,
    reader
}

function writer(jsonFile, jsonData){
    fs.writeFile(jsonFile, jsonData, (error) => {
        if (error){
            console.error(error)
        }
    })
}

function reader(filePath, callback) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, data);
    });
}