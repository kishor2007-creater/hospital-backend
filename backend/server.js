const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  disease: String,
});

const Patient = mongoose.model("Patient", patientSchema);

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  next();
});

let tasks = [];

let contactMessages = [];

app.get("/", (req, res) => {
  res.send("Hospital Backend Running Successfully");
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      message: "Task field required",
    });
  }

  const newTask = {
    id: Date.now(),
    text,
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task Added Successfully",
    task: newTask,
  });
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    message: "Task Deleted Successfully",
  });
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
  };

  contactMessages.push(newMessage);

  res.status(201).json({
    message: "Message Sent Successfully",
    data: newMessage,
  });
});

app.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();

    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/patients", async (req, res) => {
  try {
    const { name, age, disease } = req.body;

    if (!name || !age || !disease) {
      return res.status(400).json({
        message: "All patient fields are required",
      });
    }

    const newPatient = new Patient({
      name,
      age,
      disease,
    });

    await newPatient.save();

    res.status(201).json({
      message: "Patient Added Successfully",
      patient: newPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/patients/:id", async (req, res) => {
  try {
    const { name, age, disease } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        disease,
      },
      { new: true },
    );

    if (!updatedPatient) {
      return res.status(404).json({
        message: "Patient Not Found",
      });
    }

    res.json({
      message: "Patient Updated Successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* DELETE PATIENT */

app.delete("/patients/:id", async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({
        message: "Patient Not Found",
      });
    }

    res.json({
      message: "Patient Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
