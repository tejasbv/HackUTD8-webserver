const express = require('express')
const multer = require('multer')
//const upload = multer({ dest: 'uploads/' })
const fs = require('fs');
var path = require('path');

const app = express()
const PORT = 8000;
const state = {
    phone: 111 - 000 - 0000,
    claims: {},
};
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};
// //app.use(cors());
let storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        console.log(state.phone)
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var id = state.claims[file.fieldname.substring(0, 10)].length - 1
        var name = file.fieldname + '-' + id + "-" + file.originalname
        state.claims[file.fieldname.substring(0, 10)][id].images_names.push(name)
        console.log(state.claims[file.fieldname.substring(0, 10)][id].images_names)
        cb(null, name)
    }
})

const upload = multer({ storage: storage })


//const upload = multer({ storage: storage })
app.use(express.json());

//const upload = multer({ dest: './public/data/uploads/' })
app.post('/image_upload', upload.any(), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    state.phone = req.body.phone
    let path = "uploads/"
    if (!fs.existsSync(path)) {
        fs.mkdir(path, (err) => {
            if (err) {
                throw err;
            }
            console.log("Directory is created.");
        });
    } else {
        console.log("Directory already exists.");
    }

    res.json("successfully sent the data")
    //console.log(req.file, req.body)
});


app.get('/get_images/:phone&:index&?:id', function (req, res) {
    //res.send(fs.open("/home/tejas/Documents/HackUTD8-webserver/uploads/4694861197-DL-0-download.jpeg"))
    // var file = "/home/tejas/Documents/HackUTD8-webserver/uploads/4694861197-DL-0-download.jpeg";
    // // if (file.indexOf(dir + path.sep) !== 0) {
    // //     return res.status(403).end('Forbidden');
    // // }
    // var type = mime[path.extname(file).slice(1)] || 'text/plain';
    // var s = fs.createReadStream(file);
    // s.on('open', function () {
    //     res.set('Content-Type', type);
    //     s.pipe(res);
    // });
    // s.on('error', function () {
    //     res.set('Content-Type', 'text/plain');
    //     res.status(404).end('Not found');
    // });
    console.log(req.params)
    state.phone = req.params.phone
    console.log(req.params.id)
    const id = req.params.id == '-1'? state.claims[state.phone].length-1:req.params.id
    console.log(id)
    console.log(state.claims[state.phone][id])
    const img = 'uploads/'+state.claims[state.phone][id].images_names[req.params.index]
   
    console.log(img)
    //res.json(array)
    res.download(img)
});
app.post('/newClaim', (req, res) => {
    const claim_request = req.body
    state.phone = req.body.phone
    //console.log(state.claims[state.phone])

    if (state.claims[state.phone] === undefined) {
        ///console.log("doesn't exist")
        state.claims[state.phone] = []
        const id = state.claims[state.phone].length
        temp = {
            type_of_accident: claim_request.type_of_accident,
            called_911: claim_request.called_911,
            no_of_people_injured: claim_request.no_of_people_injured,
            injury_desc: claim_request.NoInjured == 0 ? "" : claim_request.injury_desc,
            public_property_damage: claim_request.public_property_damage,
            vitness: claim_request.vitness,
            no_of_cars_involved: claim_request.no_of_cars_involved,
            images_names: []
        }
        state.claims[state.phone].push(temp)
        res.json(id)
    }
    else {
        const id = state.claims[state.phone].length

        temp = {
            type_of_accident: claim_request.type_of_accident,
            called_911: claim_request.called_911,
            no_of_people_injured: claim_request.no_of_people_injured,
            injury_desc: claim_request.NoInjured == 0 ? "" : claim_request.injury_desc,
            public_property_damage: claim_request.public_property_damage,
            vitness: claim_request.vitness,
            no_of_cars_involved: claim_request.no_of_cars_involved,
            images_names: []
        }
        state.claims[state.phone].push(temp)
        res.json(id)
    }
    //console.log("print")


})
app.get("/get_claims", (req, res) => {
    res.json(state.claims)
})
app.get("/get_images", (req, res) => {

})
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});