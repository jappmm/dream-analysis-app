const Dream = require('../models/DreamModel');

// Obtener todos los sueños del usuario autenticado
exports.getDreams = async (req, res) => {
  try {
    const dreams = await Dream.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(dreams);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los sueños' });
  }
};

// Obtener un sueño por ID
exports.getDreamById = async (req, res) => {
  try {
    const dream = await Dream.findOne({ _id: req.params.id, user: req.userId });
    if (!dream) return res.status(404).json({ message: 'Sueño no encontrado' });
    res.json(dream);
  } catch (err) {
    console.error('Error al obtener el sueño:', err);
    res.status(500).json({ message: 'Error al obtener el sueño' });
  }
};

// Crear un nuevo sueño
exports.createDream = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const dream = new Dream({
      user: req.userId,
      title,
      content,
      date: date || new Date()
    });
    await dream.save();
    res.status(201).json(dream);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear el sueño' });
  }
};

// Actualizar un sueño
exports.updateDream = async (req, res) => {
  try {
    const updated = await Dream.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Sueño no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar el sueño' });
  }
};

// Eliminar un sueño
exports.deleteDream = async (req, res) => {
  try {
    const deleted = await Dream.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Sueño no encontrado' });
    res.json({ message: 'Sueño eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el sueño' });
  }
};