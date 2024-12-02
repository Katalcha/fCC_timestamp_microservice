require('dotenv').config();
const express = require('express');
const app = express();

// enable CORS
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

app.use(express.static('public'));

app.get("/", (_, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", (_, res) => {
  res.json({greeting: 'hello API'});
});

app.get("/api", (_, res) => {
  const now = new Date(Date.now());
  res.json({ unix: now.getTime(), utc: now.toUTCString() });
});

app.get("/api/:date?", (req, res) => {
  const inputDate = req.params.date;

  const regex = /[- ]/g;
  const matched = inputDate.match(regex);

  if (matched === null) {
    const parsedNumber = parseInt(inputDate);
    if (isNaN(parsedNumber)) {
      return res.json({ error: "Invalid Date" });
    }
    
    const unixDate = new Date(parsedNumber);
    return res.json({ unix: unixDate.getTime(), utc: unixDate.toUTCString() });
  }

  if (matched !== null) {
    const timeStampDate = new Date(inputDate);
    if (timeStampDate.toString() === "Invalid Date") {
      return res.json({ error: timeStampDate.toString() });
    }
    return res.json({ unix: timeStampDate.getTime(), utc: timeStampDate.toUTCString() });
  }  
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
