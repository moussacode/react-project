import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "client",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation améliorée
    if (!formData.fullName || !formData.username || !formData.password) {
      setError("Tous les champs obligatoires doivent être remplis");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        `http://localhost:5000/api/auth/register`,
        {
          ...formData,
          role: formData.role
        }
      );

      if (response.data.token) {
        navigate("/login", { state: { success: "Inscription réussie ! Veuillez vous connecter." } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message?.includes("E11000") 
        ? "Ce nom d'utilisateur est déjà utilisé" 
        : "Erreur lors de l'inscription. Veuillez réessayer.";
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Section Image */}
      <div className="hidden md:block relative w-1/2 bg-gray-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ 
            backgroundImage: "url('https://magazinedelafrique.com/wp-content/uploads/2024/03/Petits-producteurs-Senegal-770x470.jpg')",
            backgroundPosition: "center 30%"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-4xl font-bold mb-4">Tabaski Market</h2>
          <p className="text-xl">Rejoignez notre communauté d'éleveurs professionnels</p>
        </div>
      </div>

      {/* Section Formulaire */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          {/* En-tête */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Création de compte
            </h1>
            <p className="text-gray-500">
              Commencez votre expérience Tabaski Market
            </p>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Nom complet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Jean Dupont"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Sélection du rôle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              >
                <option value="vendeur">Vendeur</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Nom d'utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                name="username"
                placeholder="jean.dupont"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg 
                    className="animate-spin h-5 w-5 mr-3" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {/* Spinner SVG */}
                  </svg>
                  Création en cours...
                </>
              ) : (
                "Créer le compte"
              )}
            </button>
          </form>

          {/* Lien vers connexion */}
          <p className="text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium underline focus:outline-none"
              aria-label="Aller à la page de connexion"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;