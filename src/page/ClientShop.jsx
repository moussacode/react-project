import { useState } from 'react';

const ClientShop = () => {
  const [filters, setFilters] = useState({
    type: '',
    maxPrice: ''
  });

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Données fictives
  const animals = [
    { 
      id: 1,
      name: 'Mouton Beldi', 
      type: 'mouton',
      price: 200,
      age: 2,
      weight: 45,
      stock: 5,
      image: 'https://www.la-coccinelle.fr/wp-content/uploads/2020/06/Tremblante-du-mouton-elle-pourrait-se-transmettre-a-l-homme.jpg'
    },
    { 
      id: 2,
      name: 'Vache Holstein', 
      type: 'vache',
      price: 1500,
      age: 4,
      weight: 600,
      stock: 3,
      image: 'https://medias.pourlascience.fr/api/v1/images/view/5d41a66e8fe56f645641e985/wide_1000-webp/image.jpg'
    }
  ];

  const filteredAnimals = animals.filter(animal => {
    return (
      (filters.type ? animal.type === filters.type : true) &&
      (filters.maxPrice ? animal.price <= filters.maxPrice : true)
    );
  });

  const addToCart = (animal) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === animal.id);
      if (existing) {
        return prev.map(item => 
          item.id === animal.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...animal, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Boutique</h1>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            🛒 Panier ({cart.length})
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tous les types</option>
            <option value="mouton">Moutons</option>
            <option value="vache">Vaches</option>
          </select>

          <input
            type="number"
            placeholder="Prix maximum"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Liste des animaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map(animal => (
            <div key={animal.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200">
                <img 
                  src={animal.image} 
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
                  <p className="text-lg font-bold text-blue-600">{animal.price}€</p>
                </div>

                <button
                  onClick={() => addToCart(animal)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Panier */}
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
                      <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {item.price}€
                          </p>
                        </div>
                        <p className="font-medium">
                          {item.price * item.quantity}€
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
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
                    <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
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