exports.analyzeDream = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Contenido del sueño inválido' });
    }

    // Simulación de análisis
    const keywords = content.match(/\b[a-zA-Z]{4,}\b/g)?.slice(0, 5) || [];
    const insights = keywords.map(word => `El término "${word}" podría reflejar tus pensamientos subconscientes.`);

    res.json({
      keywords,
      insights,
      patterns: ['repetición', 'emoción intensa', 'escenarios irreales'] // simuladas
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al analizar el sueño' });
  }
};
