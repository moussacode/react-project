import { useState } from 'react';

const AdminDashboard = () => {
  // Données fictives
  const [users, setUsers] = useState([
    { id: 1, fullName: 'Admin Principal', username: 'admin', role: 'admin' },
    { id: 2, fullName: 'Éleveur 1', username: 'seller1', role: 'vendeur' },
    { id: 3, fullName: 'Client 1', username: 'client1', role: 'client' }
  ]);

  const [animals, setAnimals] = useState([
    { id: 1, name: 'Mouton 001', type: 'mouton', age: 2, price: 200, stock: 5 },
    { id: 2, name: 'Vache 001', type: 'vache', age: 4, price: 1500, stock: 3 }
  ]);

  // États pour la gestion des modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSection, setCurrentSection] = useState('users');

  // Suppression d'élément
  const handleDelete = (id, type) => {
    if (type === 'user') {
      setUsers(users.filter(user => user.id !== id));
    } else {
      setAnimals(animals.filter(animal => animal.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord Administrateur</h1>

      {/* Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setCurrentSection('users')}
          className={`px-4 py-2 rounded-lg ${currentSection === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Gestion des Utilisateurs
        </button>
        <button
          onClick={() => setCurrentSection('animals')}
          className={`px-4 py-2 rounded-lg ${currentSection === 'animals' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Gestion du Bétail
        </button>
      </div>

      {/* Section Utilisateurs */}
      {currentSection === 'users' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Utilisateurs</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Ajouter un utilisateur
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Nom complet</th>
                <th className="pb-3">Nom d'utilisateur</th>
                <th className="pb-3">Rôle</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="py-4">{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'vendeur' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.id, 'user')}
                      className="text-red-600 hover:text-red-800 mr-4"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => setSelectedItem(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Section Animaux */}
      {currentSection === 'animals' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Bétail</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Ajouter un animal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animals.map(animal => (
              <div key={animal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{animal.name}</h3>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                    {animal.type}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Âge: {animal.age} ans</p>
                  <p>Prix: {animal.price}€</p>
                  <p>Stock: {animal.stock}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(animal.id, 'animal')}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => setSelectedItem(animal)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modale */}
      {(isAddModalOpen || selectedItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {selectedItem ? 'Modifier' : 'Ajouter'} {currentSection === 'users' ? 'un utilisateur' : 'un animal'}
            </h3>

            <form className="space-y-4">
              {currentSection === 'users' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom complet</label>
                    <input
                      type="text"
                      defaultValue={selectedItem?.fullName}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rôle</label>
                    <select
                      defaultValue={selectedItem?.role}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="admin">Administrateur</option>
                      <option value="vendeur">Vendeur</option>
                      <option value="client">Client</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      defaultValue={selectedItem?.name}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      defaultValue={selectedItem?.type}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="mouton">Mouton</option>
                      <option value="vache">Vache</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedItem ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;