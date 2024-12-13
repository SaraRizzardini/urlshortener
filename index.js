require('dotenv').config({ path: "./sample.env" });

let mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) .then(() => {
  console.log('Connected to Mongo!');
})
.catch((err) => {
  console.error('Error connecting to Mongo', err);
});
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
//Schema
const shortUrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: { type: String, required: true, unique: true },
});
 const Url = mongoose.model('Url', shortUrlSchema);
 var arrayOfUrls =[{original_url: 'www.freecodecamp.org/', short_url:"24"},{original_url: 'John', short_url:24},{original_url: 'John', short_url:24}];
const createUrls = (arrayOfUrls, done) => {
  Url.create(arrayOfUrls).then((result) => {
    done(null, result);
    console.log(Url);
})
.catch((err) => {
  console.log(err);
});

};

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
//Post
app.post("/api/shorturl", async (req, res) => {
  console.log("HERE",req.body.url);
  
  const { url: original_url } = req.body;
  const urlRegex = /^(https?:\/\/)/;
  if (!urlRegex.test(original_url)) {
    return res.json({ error: 'invalid url' });
  } 
  try {
    let url = await Url.findOne({ original_url });
    if (url) {
      res.json({ original_url, short_url: url.short_url });
    } else {
      const short_url = Math.random().toString(36).substring(2, 8);

      url = new Url({
        original_url,
        short_url});

      await url.save();
      res.json({ original_url, short_url });
      console.log("post successful");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  
});
//Find the original Url
app.get("/api/shorturl/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  try {
    
    const url = await Url.findOne({ short_url:shortUrl });
    console.log("url:",url)
    if (url) {
      return res.redirect(url.original_url);
    } else {
      res.status(404).json({ error: 'No short URL found for the given input' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
exports.createUrls = createUrls;