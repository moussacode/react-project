import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
 
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSection, setCurrentSection] = useState('users');
  const [loading, setLoading] = useState(true);

  // Configuration des colonnes
  const tableConfig = {
    users: ['Nom complet', 'Email', 'Rôle', 'Actions'],
    animals: ['Nom', 'Type', 'Prix', 'Stock', 'Actions']
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = {
          users: '/admin/users',
  animals: '/admin/animals'
        };
        
        const { data } = await axios.get(endpoints[currentSection]);
        currentSection === 'users' ? setUsers(data) : setAnimals(data);
      } catch {
        toast.error('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [currentSection, user]);

  // Gestion des suppressions
  const handleDelete = async (id) => {
    try {
      const endpoints = {
        users: `/admin/users/${id}`,
        animals: `/admin/animals/${id}`
      };

      await axios.delete(endpoints[currentSection]);
      toast.success('Suppression réussie');
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de suppression');
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const isEdit = !!selectedItem;
      const endpoints = {
        users: isEdit ? `/admin/users/${selectedItem._id}` : '/admin/users',
        animals: isEdit ? `/admin/animals/${selectedItem._id}` : '/admin/animals'
      };

      isEdit
        ? await axios.put(endpoints[currentSection], data)
        : await axios.post(endpoints[currentSection], data);

      toast.success(`Opération réussie !`);
      refreshData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de traitement');
    }
  };

  // Rafraîchir les données
  const refreshData = async () => {
    const { data } = await axios.get(currentSection === 'users' ? '/admin/users' : '/admin/animals/admin');
    currentSection === 'users' ? setUsers(data) : setAnimals(data);
  };

  // Fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-red-600">Accès non autorisé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Bienvenue {user?.fullName}</h1>
            <p className="text-gray-600">Espace Admin</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord Administrateur</h1>

      {/* Navigation */}
      <div className="flex gap-2 mb-8">
        {Object.keys(tableConfig).map((section) => (
          <button
            key={section}
            onClick={() => setCurrentSection(section)}
            className={`px-4 py-2 rounded-lg capitalize ${
              currentSection === section
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold capitalize">{currentSection}</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  {tableConfig[currentSection].map((header) => (
                    <th key={header} className="pb-3 px-4">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(currentSection === 'users' ? users : animals).map((item) => (
                  <tr key={item._id} className="border-b">
                    {currentSection === 'users' ? (
                      <>
                        <td className="py-4 px-4">{item.fullName}</td>
                        <td>{item.username}</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            item.role === 'admin' ? 'bg-red-100 text-red-800' :
                            item.role === 'vendeur' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.role}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4">{item.name}</td>
                        <td>{item.type}</td>
                        <td>{item.price}€</td>
                        <td>{item.stock}</td>
                      </>
                    )}
                    <td className="py-4 px-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Modifier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {selectedItem ? 'Modifier' : 'Ajouter'} {currentSection.slice(0, -1)}
            </h3>

            <form onSubmit={handleSubmit}>
              {currentSection === 'users' ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Nom complet</label>
                      <input
                        name="fullName"
                        defaultValue={selectedItem?.fullName}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Email</label>
                      <input
                        name="username"
                        
                        defaultValue={selectedItem?.username}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Rôle</label>
                      <select
                        name="role"
                        defaultValue={selectedItem?.role || 'client'}
                        className="w-full p-2 border rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="vendeur">Vendeur</option>
                        <option value="client">Client</option>
                      </select>
                    </div>
                    {!selectedItem && (
        <div>
          <label className="block mb-2">Mot de passe</label>
          <input
            name="password"
            type="password"
            className="w-full p-2 border rounded"
            required={!selectedItem} // Obligatoire seulement pour la création
          />
        </div>
      )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Nom</label>
                      <input
                        name="name"
                        defaultValue={selectedItem?.name}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Type</label>
                      <select
                        name="type"
                        defaultValue={selectedItem?.type}
                        className="w-full p-2 border rounded"
                      >
                        <option value="mouton">Mouton</option>
                        <option value="vache">Vache</option>
                        <option value="chèvre">Chèvre</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">Prix</label>
                        <input
                          name="price"
                          type="number"
                          defaultValue={selectedItem?.price}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2">Stock</label>
                        <input
                          name="stock"
                          type="number"
                          defaultValue={selectedItem?.stock}
                          className="w-full p-2 border rounded"
                          required
                        />
                        <input 
    type="hidden" 
    name="seller" 
    value={user._id} // L'admin devient le vendeur par défaut
  />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedItem ? 'Enregistrer' : 'Créer'}
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