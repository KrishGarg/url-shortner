const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

require('dotenv').config();
const ShortURL = require('./models/ShortURL.model')

// App Setup
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Mongoose Setup
mongoose.connect(
    process.env.MONGO_DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to the MongoDB server.'))
    .catch(err => console.error(err))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'home.html'));
})

const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

app.post('/api/shorten', async (req, res) => {
    if ("type" in req.body) {
        if (req.body.type !== "json") {
            res.status(403)
                .json({
                    Error: "Invalid type."
                })
            return;
        }

        if (!validURL(req.body.longURL)) {
            res.status(403)
                .json({
                    Error: "Invalid URL."
                })
            return;
        }
    }

    const longURL = req.body.longURL;
    let id = nanoid(6);
    let oldData = await ShortURL.find({
        shortURL: id
    });

    while (oldData.length > 0) {
        id = nanoid(6);
        oldData = await ShortURL.find({
            shortURL: id
        });
    }

    const doc = new ShortURL({
        shortURL: id,
        longURL: longURL
    });
    doc.save()
        .then(obj => {
            if (req.body.type === "json") {
                res.status(200)
                    .json(obj)
                return;
            } else {
                res.render('shortMade', {
                    shortURL: obj.shortURL
                });
                return;
            }
        })
})

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    let data = await ShortURL.findOne({
        shortURL: id
    });
    if (!data || data.length === 0) {
        res.sendFile(path.resolve(__dirname, "not_found.html"))
    } else {
        data.uses++;
        await data.save();
        res.redirect(data.longURL);
    }
})

app.listen(port, () => {
    console.log('listening on port ' + port);
});