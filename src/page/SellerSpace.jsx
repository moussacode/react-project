import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const SellerSpace = () => {
  const { user, logout } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'mouton',
    age: '',
    weight: '',
    price: '',
    stock: '',
    description: '',
    image: ''
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result});
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [editingId, setEditingId] = useState(null);

  // Récupération des animaux au montage
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/animals', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setAnimals(response.data);
      } catch (error) {
        console.error('Erreur de récupération des animaux:', error);
        setError('Erreur lors du chargement des animaux');
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchAnimals();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'mouton',
      age: '',
      weight: '',
      price: '',
      stock: '',
      description: '',
      image: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const animalData = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.split(',')[1], 
      };

      const method = editingId ? 'put' : 'post';
      const url = editingId ? `http://localhost:5000/api/animals/${editingId}` : 'http://localhost:5000/api/animals';
      
      const response = await axios[method](url, animalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setAnimals(prev => 
        editingId 
          ? prev.map(item => item._id === editingId ? response.data : item) 
          : [...prev, response.data]
      );
      
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (animal) => {
    setFormData({
      name: animal.name,
      type: animal.type,
      age: animal.age,
      weight: animal.weight,
      price: animal.price,
      stock: animal.stock,
      description: animal.description,
      image: animal.image
    });
    setEditingId(animal._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/animals/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnimals(prev => prev.filter(animal => animal._id !== id));
    } catch (error) {
      console.error('Erreur de suppression:', error);
      setError('Erreur lors de la suppression');
    }
  };
  console.log(user)
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Bienvenue {user?.fullName}</h1>
            <p className="text-gray-600">Espace vendeur</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Formulaire d'ajout/modification */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
  <h2 className="text-2xl font-bold mb-6 text-gray-900">
    {editingId ? 'Modifier un animal' : 'Ajouter un nouvel animal'}
  </h2>
  
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Nom */}
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Nom <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        required
      />
    </div>

    {/* Type */}
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Type <span className="text-red-500">*</span>
      </label>
      <select
        value={formData.type}
        onChange={(e) => setFormData({...formData, type: e.target.value})}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none transition-all"
      >
        <option value="mouton">Mouton</option>
        <option value="vache">Vache</option>
        <option value="chèvre">Chèvre</option>
      </select>
    </div>

    {/* Âge */}
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Âge (ans) <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        value={formData.age}
        onChange={(e) => setFormData({...formData, age: e.target.value})}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
        min="0"
        required
      />
    </div>

    {/* Poids */}
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Poids (kg) <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        value={formData.weight}
        onChange={(e) => setFormData({...formData, weight: e.target.value})}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
        min="0"
        required
      />
    </div>

    {/* Prix */}
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Prix (€) <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({...formData, price: e.target.value})}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
        min="0"
        required
      />
    </div>

    {/* Stock */}
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Stock <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        value={formData.stock}
        onChange={(e) => setFormData({...formData, stock: e.target.value})}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
        min="0"
        required
      />
    </div>

    {/* Image */}
    <div className="md:col-span-2 space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Image <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-4">
        <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span className="text-sm font-medium">Choisir un fichier</span>
          <input 
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            required
          />
        </label>
        {previewImage && (
          <div className="relative group">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="mt-2 h-32 w-32 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">Format accepté : JPEG, PNG (max 2MB)</p>
    </div>

    {/* Description */}
    <div className="md:col-span-2 space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
        rows="3"
      />
    </div>

    {/* Boutons */}
    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
      <button
        type="button"
        onClick={() => {
          setFormData({
            name: '',
            type: 'mouton',
            age: '',
            weight: '',
            price: '',
            stock: '',
            description: '',
            image: ''
          });   
                 setEditingId(null);
        }}
        className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all font-medium"
      >
        {editingId ? 'Enregistrer' : 'Ajouter'}
      </button>
    </div>
  </form>
</div>

        {/* Liste des animaux */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Mes animaux en vente</h2>
          
          {loadingAnimals ? (
            <div className="text-center py-4">Chargement en cours...</div>
          ) : animals.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Aucun animal enregistré pour le moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {animals.map(animal => (
              <div key={animal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{animal.name}</h3>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    animal.type === 'mouton' ? 'bg-green-100 text-green-800' :
                    animal.type === 'vache' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {animal.type}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                <img 
  src={`data:image/jpeg;base64,${animal.image}`} 
  alt={animal.name}
  className="w-full h-48 object-cover mb-4 rounded-lg"
/>
                  <p>Âge: {animal.age} ans</p>
                  <p>Poids: {animal.weight} kg</p>
                  <p>Prix: {animal.price}€</p>
                  <p>Stock: {animal.stock}</p>
                  {animal.description && (
                    <p className="text-gray-500 mt-2">{animal.description}</p>
                  )}
                </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(animal)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(animal._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerSpace;