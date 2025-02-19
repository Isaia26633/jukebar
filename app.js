const express = require("express");
const ejs = require("ejs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const jwt = require('jsonwebtoken');
const session = require('express-session');
const fs = require("fs");

const routes = require("./modules/routes.js");
const { isAuthenticated, AUTH_URL, THIS_URL } = require("./modules/authentication.js");

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database("db/database.db", (err) => {
    if (err) {
        console.error("Failed to connect to the database: ", err);
        process.exit(1); // exit the process
    }
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: 'make up a secret string here but never publish it!',
    resave: false,
    saveUninitialized: false
}));
app.use('/', routes);

app.get("/sounds", (req, res) => {
    const soundsFolder = path.join(__dirname, "sfx");

    fs.readdir(soundsFolder, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Could not read directory" });
        }

        res.json(files.filter(file => /\.(mp3)$/i.test(file)));
    });
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});