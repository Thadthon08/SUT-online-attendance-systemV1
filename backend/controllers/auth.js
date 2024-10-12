const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Teacher } = require("../models");

const signUp = async (req, res) => {
  const { tid, fname, lname, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await Teacher.create({
      tid,
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating teacher", error: err.message });
  }
};

const signIn = async (req, res) => {
  const { tid, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ where: { tid } });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: teacher.tid,
        fname: teacher.fname,
        lname: teacher.lname,
        email: teacher.email,
        profile_pic: teacher.profile_pic,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "SignIn successful", token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error during sign-in", error: err.message });
  }
};

module.exports = { signUp, signIn };
