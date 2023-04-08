const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const location = req.body.location;
  const apiKey = "{Your APIKey}";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  https.get(url, (response) => {
    console.log(response.statusCode);

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const image = "https://openweathermap.org/img/w/" + icon + ".png";
      console.log(temp, description);
      res.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ADD8E6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .weather-container {
            text-align: center;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        img {
            width: 100px;
            height: 100px;
        }

        footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        footer a {
            color: #007bff;
            text-decoration: none;
        }
        footer a:hover {
            color: #0056b3;
            text-decoration: underline;
        }
        
    </style>
</head>
<body>
    <div class="weather-container">
`);

      if (weatherData.cod === 200) {
        res.write(
          "<h1>The Temperature in " +
            req.body.location +
            " is " +
            temp +
            "°C.</h1>"
        );
        res.write("<p>The weather currently is " + description + "</p>");
        res.write(
          '<img src="http://openweathermap.org/img/wn/' + icon + '@2x.png">'
        );
      } else {
        res.write("<h1>City not found</h1>");
        res.write("<p>Please check the city you entered again!</p>");
      }
      res.write(`
      <form action="/" method="GET">
          <button type="submit" class="btn btn-primary" style="background-color: #1e88e5; border-color: #1e88e5; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;">Search Again</button>
      </form>
      `);

      res.write(`
    </div>
    <footer>
    <p>&copy; 2023 Puvaan Raaj. Learned based on The Complete 2023 Web Development Bootcamp from Udemy.</p>
    <p>
        <a href="https://github.com/PuvaanRaaj" target="_blank">GitHub</a> | 
        <a href="https://www.linkedin.com/in/puvaan-raaj-65385a157/" target="_blank">LinkedIn</a> | 
        <a href="https://www.tiktok.com/@_puvaanraaj2001" target="_blank">TikTok</a>
    </p>
</footer>
</body>
</html>
`);
      res.send();

      res.send();
    });
  });
});

// Port: 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
