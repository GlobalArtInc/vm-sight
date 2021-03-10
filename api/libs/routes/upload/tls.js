const express = require('express');
const db = require('../../db')
const router = express.Router();
const multer = require('multer')
const fs = require('fs')

var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            const certs_dir = './data/certs/'
            if (!fs.existsSync(certs_dir)) {
                fs.mkdirSync(certs_dir);
            }
            const dir = './data/certs/' + req.query.folder
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, './data/certs/' + req.query.folder)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);


var upload = multer({storage: storage});

router.post('/ca', upload.single('file'), async (req, res) => {
    const {folder} = req.query
    if (folder) {

        return res.send({response: true})
    } else {
        return res.status(400).send({message: "Incorrect Folder"})
    }
})
router.post('/cert', upload.single('file'), async (req, res) => {
    const {folder} = req.query
    if (folder) {
        return res.send({response: true})
    } else {
        return res.status(400).send({message: "Incorrect Folder"})
    }
})
router.post('/key', upload.single('file'), async (req, res) => {
    const {folder} = req.query
    if (folder) {
        return res.send({response: true})
    } else {
        return res.status(400).send({message: "Incorrect Folder"})
    }
})

router.get('*', function (req, res) {
    return res.status(404).end()
});

module.exports = router;
