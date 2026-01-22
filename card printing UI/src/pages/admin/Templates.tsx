import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Upload } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { cardTemplateService } from '../../services/cardTemplateService';
import { templateCategoryService, TemplateCategory } from '../../services/templateCategoryService';

interface TemplateDisplay {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId: number;
  imageUrl: string;
  isPremium: boolean;
  createdAt: string;
  downloads: number;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateDisplay[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load both templates and categories
      const [templatesData, categoriesData] = await Promise.all([
        cardTemplateService.getAllTemplates(),
        templateCategoryService.getAllCategories()
      ]);
      
      // Transform API data to display format
      const transformedTemplates: TemplateDisplay[] = templatesData.map(template => ({
        id: template.templateId,
        name: template.title,
        description: template.cardTemplateDescription || 'No description',
        category: template.category?.categoryName || 'Uncategorized',
        categoryId: template.categoryId,
        imageUrl: template.filePath || '/placeholder-image.jpg',
        isPremium: template.isPremium,
        createdAt: new Date(template.createdAt).toISOString().split('T')[0],
        downloads: 0 // API doesn't have downloads field, default to 0
      }));
      
      setTemplates(transformedTemplates);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateDisplay | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: 0,
    isPremium: false,
    imageFile: null as File | null
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  // Categories are now loaded from API

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!editingTemplate && !formData.imageFile) {
      newErrors.imageFile = 'Template image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template
        await cardTemplateService.updateTemplate(editingTemplate.id, {
          categoryId: formData.categoryId,
          title: formData.name,
          cardTemplateDescription: formData.description,
          filePath: imagePreview || editingTemplate.imageUrl,
          isPremium: formData.isPremium
        });
      } else {
        // Add new template
        await cardTemplateService.createTemplate({
          categoryId: formData.categoryId,
          title: formData.name,
          cardTemplateDescription: formData.description,
          filePath: imagePreview || '/placeholder-image.jpg',
          isPremium: formData.isPremium
        });
      }

      // Reload data after successful operation
      await loadData();
      
      setShowModal(false);
      setEditingTemplate(null);
      setFormData({ name: '', description: '', categoryId: 0, isPremium: false, imageFile: null });
      setImagePreview('');
      setErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    }
  };

  const handleEdit = (template: TemplateDisplay) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      categoryId: template.categoryId,
      isPremium: template.isPremium,
      imageFile: null
    });
    setImagePreview(template.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await cardTemplateService.deleteTemplate(id);
        await loadData(); // Reload data after deletion
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete template');
      }
    }
  };

  const handleAddNew = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', categoryId: 0, isPremium: false, imageFile: null });
    setImagePreview('');
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, imageFile: 'Please select a valid image file' });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, imageFile: 'File size must be less than 5MB' });
      return;
    }

    setFormData({ ...formData, imageFile: file });
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Clear error
    if (errors.imageFile) {
      setErrors({ ...errors, imageFile: '' });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading templates...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Error loading templates:</strong> {error}
          </div>
          <button
            onClick={loadData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
            <p className="text-gray-600">Manage business card templates</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No templates found
            </div>
          ) : (
            filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  {template.isPremium && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{template.category}</span>
                  <span>{template.downloads} downloads</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="flex-1 flex items-center justify-center bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="flex-1 flex items-center justify-center bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter template name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.categoryId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value={0}>Select category</option>
                      {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter template description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Image {!editingTemplate && '*'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Browse to upload image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded"
                        />
                      </div>
                    )}
                  </div>
                  {errors.imageFile && (
                    <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Premium Template
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTemplate(null);
                      setFormData({ name: '', description: '', categoryId: 0, isPremium: false, imageFile: null });
                      setImagePreview('');
                      setErrors({});
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTemplate ? 'Update' : 'Add'} Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Templates;