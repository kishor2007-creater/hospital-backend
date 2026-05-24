const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  disease: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Patient", patientSchema);
