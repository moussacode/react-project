import { useState } from 'react';

const SellerSpace = () => {
  const [animals, setAnimals] = useState([
    {
      id: 1,
      name: 'Mouton Beldi',
      type: 'mouton',
      age: 2,
      weight: 45,
      price: 200,
      stock: 5,
      description: 'Mouton de race locale en bonne santé'
    },
    {
      id: 2,
      name: 'Vache Holstein',
      type: 'vache',
      age: 4,
      weight: 600,
      price: 1500,
      stock: 3,
      description: 'Vache laitière haute production'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'mouton',
    age: '',
    weight: '',
    price: '',
    stock: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnimal = {
      ...formData,
      id: editingId || Date.now(),
      age: Number(formData.age),
      weight: Number(formData.weight),
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    setAnimals(prev => 
      editingId 
        ? prev.map(item => item.id === editingId ? newAnimal : item) 
        : [...prev, newAnimal]
    );

    setFormData({
      name: '',
      type: 'mouton',
      age: '',
      weight: '',
      price: '',
      stock: '',
      description: ''
    });
    setEditingId(null);
  };

  const handleEdit = (animal) => {
    setFormData({
      name: animal.name,
      type: animal.type,
      age: animal.age,
      weight: animal.weight,
      price: animal.price,
      stock: animal.stock,
      description: animal.description
    });
    setEditingId(animal.id);
  };

  const handleDelete = (id) => {
    setAnimals(prev => prev.filter(animal => animal.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Espace Vendeur</h1>

        {/* Formulaire d'ajout/modification */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Modifier un animal' : 'Ajouter un nouvel animal'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="mouton">Mouton</option>
                <option value="vache">Vache</option>
                <option value="chèvre">Chèvre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Âge (ans)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
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
                    description: ''
                  });
                  setEditingId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>

        {/* Liste des animaux */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Mes animaux en vente</h2>
          
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
                    onClick={() => handleDelete(animal.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSpace;