const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");

const db = {
  users: [
    {
      id: "123",
      name: "John",
      password: "cookies",
      email: "john@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      password: "bananas",
      email: "sally@gmail.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};
const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json(db.users);
});

const storeUserPassword = (password, salt) =>
  bcrypt.hash(password, salt).then(storeHashInDatabase);
// Returns true if user password is correct, returns false otherwise
const checkUserPassword = (enteredPassword, storedPasswordHash) =>
  bcrypt.compare(enteredPassword, storedPasswordHash);

const storeHashInDatabase = (hash) => {
  // Store the hash in your password DB
  return hash;
};

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  //code on crypting the password
  // bcrypt.compare(password, "hash", function (err, result) {
  // result == true
  // });

  console.log(email, password);
  if (email === db.users[0].email && password === db.users[0].password) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  storeUserPassword(password, 10)
    .then((hash) => checkUserPassword(password, hash))
    .then(console.log)
    .catch(console.error);

  db.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.status(200).json(db.users[db.users.length - 1]);
});

app.get("/profile/:userId", (req, res) => {
  if (!req.params) res.status(400).json({ error: "No parameter passed" });
  const { userId } = req.params;
  let found = false;
  db.users.forEach((user) => {
    if (user.id === userId) {
      found = true;
      res.json(user);
    }
  });
  if (!found) res.status(404).json("no such user");
});

app.put("/image", (req, res) => {
  const { id } = req.params;
  let found = false;
  db.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) res.status(404).json("no such user");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}....`);
});
