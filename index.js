require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
const shortUrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  }
});
 const Url = mongoose.model('Url', shortUrlSchema);
 var arrayOfUrls =[{original_url: 'www.freecodecamp.org/', short_url:"24"},{original_url: 'John', short_url:24},{original_url: 'John', short_url:24}];
const createUrls = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post("/", async (req, res) => {
  console.log("HERE",req.body.url);
  const { origUrl } = req.body;
  try {
    let url = await Url.findOne({ original_url });
    if (url) {
      res.json(url);
    } else {
      const short_url = Math.random().toString(36).slice(-6);

      url = new Url({
        original_url,
        short_url,
        
      });

      await url.save();
      res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  
});
app.get("/api/shorturl/:shortUrl", async (req, res) => {
  try {
    const url = await Url.findOne({ short_url: req.params.shortUrl });
    console.log(url)
    if (url) {
     
      url.save();
      return res.redirect(url.origUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
