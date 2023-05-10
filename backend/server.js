const companies = require("./data");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("working");
});

app.get("/companies", (req, res) => {
  res.status(200).json(companies);
});

app.post("/search", (req, res) => {
  const { name } = req.query;

  if (!name) {
    res.status(404).send("Wrong search parameter");
  }

  const filterCompanies = companies.data.filter(
    (company) => company.companyName.toLowerCase() === name.toLowerCase()
  );

  res.status(200).json(filterCompanies);
});

const port = 4000;
const start = async () => {
  try {
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
