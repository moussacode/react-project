import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ClientShop = () => {
const { user, logout } = useAuth();
console.log(user)
  const [filters, setFilters] = useState({
    type: '',
    maxPrice: ''
  });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des animaux disponibles
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const { data } = await axios.get('/animals/available');
        setAnimals(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de chargement');
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);
  console.log(animals)

  // Gestion du panier
  const addToCart = (animal) => {
    const existingItem = cart.find(item => item.animal._id === animal._id);
    const availableStock = animal.stock - (existingItem?.quantity || 0);

    if (availableStock <= 0) {
      toast.error('Stock insuffisant');
      return;
    }

    setCart(prev => {
      if (existingItem) {
        return prev.map(item => 
          item.animal._id === animal._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { animal, quantity: 1 }];
    });
  };

  const removeFromCart = (animalId) => {
    setCart(prev => prev.filter(item => item.animal._id !== animalId));
  };

  // Passer la commande
  const handleCheckout = async () => {
    try {
      // Conversion explicite des types
      const orderItems = cart.map(item => ({
        animalId: String(item.animal._id), // Conversion en string
        quantity: Number(item.quantity) // Conversion en nombre
      }));
      console.log(orderItems)
  
      // Validation client
      const invalidItems = orderItems.filter(item => 
        !item.animalId || 
        !item.quantity ||
        !Number.isInteger(item.quantity)
      );
  
      if (invalidItems.length > 0) {
        throw new Error('Données de commande invalides');
      }
  
      await axios.post('/orders', { 
        items: orderItems 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })} catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    }
  };

  // Filtrage
  const filteredAnimals = animals.filter(animal => {
    return (
      (filters.type ? animal.type === filters.type : true) &&
      (filters.maxPrice ? animal.price <= filters.maxPrice : true)
    );
  });

  // Calcul du total
  const total = cart.reduce((sum, item) => sum + (item.animal.price * item.quantity), 0);

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
        <div className='flex flex-col gap-2'>
            <h1 className="text-2xl font-bold">Bienvenue {user?.fullName}</h1>
            <p className="text-gray-600">Espace Client</p>
          </div>
          <div className="flex justify-between items-center gap-4">

          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            🛒 Panier ({cart.length})
          </button>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Déconnexion
          </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tous les types</option>
            <option value="mouton">Moutons</option>
            <option value="vache">Vaches</option>
            <option value="chèvre">Chèvres</option>
          </select>

          <input
            type="number"
            placeholder="Prix maximum (€)"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map(animal => (
            <div key={animal._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200">
                <img 
                  src={`data:image/jpeg;base64,${animal.image}`} 
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{animal.name}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {animal.type}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>Âge: {animal.age} ans</p>
                  <p>Poids: {animal.weight} kg</p>
                  <p>Stock: {animal.stock}</p>
                  <p className="text-lg font-bold text-blue-600">{animal.price}€</p>
                </div>

                <button
                  onClick={() => addToCart(animal)}
                  className={`w-full mt-4 py-2 rounded-lg ${
                    animal.stock > 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                  disabled={animal.stock <= 0}
                >
                  {animal.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {isCartOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-end">
            <div className="bg-white w-full max-w-md p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Votre Panier</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500">Votre panier est vide</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.animal._id} className="flex items-center gap-4 border-b pb-4">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.animal.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {item.animal.price}€
                          </p>
                        </div>
                        <p className="font-medium">
                          {item.animal.price * item.quantity}€
                        </p>
                        <button
                          onClick={() => removeFromCart(item.animal._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total :</span>
                      <span>{total}€</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                    >
                      Passer la commande
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientShop;