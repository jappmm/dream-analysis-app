import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDreams from '../hooks/useDreams';
import LoadingSpinner from '../components/LoadingSpinner';

const Analysis = () => {
  const { dreamId } = useParams();
  const navigate = useNavigate();
  const { getDreamById } = useDreams();
  
  const [dream, setDream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [fetched, setFetched] = useState(false); // Nuevo estado para controlar si ya se hizo la petición

  // Efecto para cargar los datos del sueño UNA SOLA VEZ
  useEffect(() => {
    // Solo ejecutar si aún no se ha hecho la petición
    if (!fetched && dreamId) {
      const fetchDreamData = async () => {
        try {
          setLoading(true);
          console.log('Fetching dream with ID:', dreamId);
          
          // Obtener el sueño usando nuestro hook contextualizado
          const dreamData = await getDreamById(dreamId);
          
          console.log('Dream data received:', dreamData);
          
          if (!dreamData) {
            console.error('Dream not found');
            setError('Sueño no encontrado');
            setLoading(false);
            return;
          }
          
          // Si no hay análisis en el sueño, mostrar un error
          if (!dreamData.analysis) {
            console.error('No analysis data found for dream:', dreamId);
            setError('El análisis de este sueño no está disponible');
            setLoading(false);
            return;
          }
          
          setDream(dreamData);
        } catch (err) {
          console.error('Error fetching dream data:', err);
          setError('Error al cargar el análisis del sueño');
        } finally {
          setLoading(false);
          setFetched(true); // Marcar que ya se ha hecho la petición
        }
      };

      fetchDreamData();
    }
  }, [dreamId, getDreamById, fetched]); // Añadir fetched como dependencia

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (feedbackRating === 0) {
      return;
    }
    
    try {
      // Por ahora, simplemente guardamos el feedback en localStorage
      const storedDreams = JSON.parse(localStorage.getItem('dreams') || '[]');
      const dreamIndex = storedDreams.findIndex(d => d.id === dreamId);
      
      if (dreamIndex !== -1) {
        storedDreams[dreamIndex].feedback = {
          rating: feedbackRating,
          comments: feedbackText,
          timestamp: new Date().toISOString(),
        };
        
        localStorage.setItem('dreams', JSON.stringify(storedDreams));
      }
      
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Error saving feedback:', err);
    }
  };

  // El resto del componente permanece igual...
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Estado de carga
  if (loading) {
    return <LoadingSpinner message="Cargando análisis del sueño..." />;
  }

  // Estado de error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => navigate('/history')}
        >
          Volver al historial
        </button>
      </div>
    );
  }

  // Si no hay sueño, no renderizar nada
  if (!dream) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{dream.title}</h1>
        <p className="text-gray-600">
          {new Date(dream.date || dream.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Narrative Section */}
      <motion.section 
        className="mb-12 bg-gray-50 p-6 rounded-lg"
        variants={fadeInUp}
      >
        <h2 className="text-xl font-semibold mb-3">Narrativa del sueño</h2>
        <p className="whitespace-pre-line">{dream.content || dream.description || dream.narrative}</p>
      </motion.section>

      {/* Analysis Summary */}
      <motion.section 
        className="mb-12"
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-semibold mb-6">Resumen del análisis</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="whitespace-pre-line">{dream.analysis?.summary}</p>
        </div>
      </motion.section>

      {/* Symbols Section */}
      {dream.analysis?.symbols && dream.analysis.symbols.length > 0 && (
        <motion.section 
          className="mb-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold mb-6">Símbolos identificados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dream.analysis.symbols.map((symbol, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg">{symbol.name || 'Símbolo ' + (index + 1)}</h3>
                <p className="text-gray-700">{symbol.meaning || symbol}</p>
                {symbol.context && <p className="text-gray-600 mt-2 text-sm">{symbol.context}</p>}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Patterns Section */}
      {dream.analysis?.patterns && dream.analysis.patterns.length > 0 && (
        <motion.section 
          className="mb-12"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-semibold mb-6">Patrones identificados</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {dream.analysis.patterns.map((pattern, index) => (
              <div 
                key={index} 
                className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <h3 className="font-semibold">{pattern.description || pattern}</h3>
                {pattern.significance && <p className="text-gray-700 mt-1">{pattern.significance}</p>}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Reflection Questions */}
      {dream.analysis?.reflectionQuestions && dream.analysis.reflectionQuestions.length > 0 && (
        <motion.section 
          className="mb-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold mb-6">Preguntas para reflexionar</h2>
          <div className="space-y-4">
            {dream.analysis.reflectionQuestions.map((question, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="font-medium">
                    <span className="text-yellow-600 mr-2">{index + 1}.</span>
                    {question}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recommendations */}
      {dream.analysis?.recommendations && dream.analysis.recommendations.length > 0 && (
        <motion.section 
          className="mb-12"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-semibold mb-6">Recomendaciones</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <ul className="space-y-3">
              {dream.analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      )}

      {/* Feedback Section */}
      <motion.section 
        className="mb-12"
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-semibold mb-6">Tu opinión sobre este análisis</h2>
        
        {feedbackSubmitted ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
            <p className="text-green-800 text-lg font-medium mb-2">¡Gracias por tu feedback!</p>
            <p className="text-green-700">Tus comentarios nos ayudan a mejorar nuestro sistema de análisis.</p>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <p className="font-medium mb-3">¿Qué tan útil fue este análisis?</p>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      feedbackRating >= rating 
                        ? 'bg-yellow-400 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    onClick={() => setFeedbackRating(rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="feedbackText" className="block font-medium mb-2">
                Comentarios adicionales (opcional)
              </label>
              <textarea
                id="feedbackText"
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Comparte tus impresiones sobre el análisis..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              ></textarea>
            </div>
            
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg ${
                feedbackRating === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={feedbackRating === 0}
            >
              Enviar feedback
            </button>
          </form>
        )}
      </motion.section>
    </div>
  );
};

export default Analysis;