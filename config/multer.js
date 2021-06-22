const multer = require('multer');
const path = require('path');

function checkCSV(file, cb) {
    // Allowed file types
    const fileTypes = /csv/;
    // Check ext
    const extFileName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mine
    const mimetype = fileTypes.test(file.mimetype);
    if (extFileName && mimetype) {
        return cb(null, true);
    } else {
        return cb(new Error("INVALID_CSV"));
    }
}

const storageCSV = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname + '/../config/'))
    },
    filename: function (req, file, cb) {
        cb(null, "alunos.csv");
    }
});


async function uploadCSVToMemory(req, res, next) {
    // 50MB = 50 * 1024 * 1024 Bytes
    const multerUploader = multer({
        storage: storageCSV, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: function (req, file, cb) {
            checkCSV(file, cb);
        }
    });
    const upload = multerUploader.single('students');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            if (err.code == "LIMIT_FILE_SIZE") return res.status(400).send({msg:"invalid csv type"});
            return res.status(400).send({msg:"invalid csv"})
        } else if (err) {
            // An unknown error occurred when uploading
            if (err.toString().includes("INVALID_CSV")) return res.status(400).send({msg:"invalid csv type"});
            return res.status(400).send({msg:"invalid csv"})
        }
        return next()
    })
}

module.exports = {
    uploadCSVToMemory: uploadCSVToMemory
}