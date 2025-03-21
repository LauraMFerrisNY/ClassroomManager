const router = require("express").Router();
const db = require("../db");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Register a new instructor account
router.post("/register", async (req, res, next) => {
  try {
    const {
      rows: [instructor],
    } = await db.query(
      "INSERT INTO instructor (username, password) VALUES ($1, $2) RETURNING *",
      [req.body.username, await bcrypt.hash(req.body.password, 5)]
    );

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login to an existing instructor account
router.post("/login", async (req, res, next) => {
  try {
    const {
      rows: [instructor],
    } = await db.query(
      "SELECT * FROM instructor WHERE username = $1 AND password = $2",
      [req.body.username, req.body.password]
    );

    if (!instructor || (await bcrypt.compare(req.body.password, instructor.rows[0].password)) === false) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/github/callback", (req, res) => { const code = req.query.code; });



// Get the currently logged in instructor
router.get("/me", async (req, res, next) => {
  try {
    const {
      rows: [instructor],
    } = await db.query("SELECT * FROM instructor WHERE id = $1", [
      req.user?.id,
    ]);

    res.send(instructor);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
