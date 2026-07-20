import { useState, useEffect } from 'react';
import { mockApiCalls } from '../services/mockApi';
import { Trash2, Plus } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await mockApiCalls.getCategories();
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert('Category name is required');
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
    };

    setCategories([...categories, newCategory]);
    setFormData({ name: '', type: 'EXPENSE' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-gray-400">Loading categories...</div>
      </div>
    );
  }

  const incomeCategories = categories.filter(c => c.type === 'INCOME');
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ name: '', type: 'EXPENSE' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Food, Rent, Salary"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', type: 'EXPENSE' });
                }}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Income Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-green-400">Income Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeCategories.map(cat => (
            <div key={cat.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg p-4 flex justify-between items-center hover:border-green-700/50 transition-colors">
              <span className="font-medium">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-red-400">Expense Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenseCategories.map(cat => (
            <div key={cat.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg p-4 flex justify-between items-center hover:border-red-700/50 transition-colors">
              <span className="font-medium">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}