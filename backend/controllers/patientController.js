const Patient = require("../models/Patient");

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addPatient = async (req, res) => {
  try {
    const { name, age, disease } = req.body;

    const patient = new Patient({
      name,
      age,
      disease,
    });

    await patient.save();

    res.status(201).json({
      message: "Patient Added Successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { name, age, disease } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        disease,
      },
      {
        new: true,
      },
    );

    res.json({
      message: "Patient Updated Successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);

    res.json({
      message: "Patient Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
};
