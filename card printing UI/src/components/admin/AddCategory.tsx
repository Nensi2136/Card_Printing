import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { templateCategoryService } from '../../services/templateCategoryService';

interface AddCategoryProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onSuccess, onError }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      onError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await templateCategoryService.createCategory({
        categoryName: name.trim(),
        categoryDescription: description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      setName('');
      setDescription('');
      setShowForm(false);
      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </button>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Add New Category</h3>
        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category name"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category description"
            disabled={loading}
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
