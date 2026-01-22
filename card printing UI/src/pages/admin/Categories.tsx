import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { templateCategoryService, TemplateCategory } from '../../services/templateCategoryService';

interface Category extends TemplateCategory {
  templateCount: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDescription: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const templateCategories = await templateCategoryService.getAllCategories();
      
      // Add templateCount property to each category
      const categoriesWithCount: Category[] = templateCategories.map(templateCategory => ({
        ...templateCategory,
        templateCount: 0 // Default to 0 since API doesn't provide template count
      }));
      
      setCategories(categoriesWithCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.categoryDescription && category.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate pagination
  const totalItems = filteredCategories.length;
  const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Update total pages when filtered categories change
  useEffect(() => {
    setTotalPages(calculatedTotalPages);
    // Reset to first page if current page exceeds total pages
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredCategories.length, calculatedTotalPages, currentPage]);

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageCategories = filteredCategories.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    } else if (formData.categoryName.trim().length < 2) {
      newErrors.categoryName = 'Category name must be at least 2 characters';
    } else if (formData.categoryName.trim().length > 100) {
      newErrors.categoryName = 'Category name must be less than 100 characters';
    }

    if (!formData.categoryDescription?.trim()) {
      newErrors.categoryDescription = 'Description is required';
    } else if (formData.categoryDescription.trim().length < 5) {
      newErrors.categoryDescription = 'Description must be at least 5 characters';
    } else if (formData.categoryDescription.trim().length > 500) {
      newErrors.categoryDescription = 'Description must be less than 500 characters';
    }

    // Check for duplicate category names
    const isDuplicate = categories.some(cat => 
      cat.categoryName.toLowerCase() === formData.categoryName.trim().toLowerCase() &&
      (!editingCategory || cat.categoryId !== editingCategory.categoryId)
    );
    
    if (isDuplicate) {
      newErrors.categoryName = 'A category with this name already exists';
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
      setSubmitting(true);
      setError(null);

      if (editingCategory) {
        // Update existing category
        await templateCategoryService.updateCategory(editingCategory.categoryId, {
          CategoryName: formData.categoryName.trim(),
          CategoryDescription: formData.categoryDescription.trim(),
          UpdatedAt: new Date().toISOString()
        });
        setSuccessMessage('Category updated successfully!');
      } else {
        // Add new category
        await templateCategoryService.createCategory({
          CategoryName: formData.categoryName.trim(),
          CategoryDescription: formData.categoryDescription.trim(),
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString()
        });
        setSuccessMessage('Category added successfully!');
      }

      // Refresh categories list
      await fetchCategories();
      
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ categoryName: '', categoryDescription: '' });
      setErrors({});
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setError(null);
        await templateCategoryService.deleteCategory(categoryId);
        setSuccessMessage('Category deleted successfully!');
        await fetchCategories(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete category');
      }
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ categoryName: '', categoryDescription: '' });
    setErrors({});
    setError(null);
    setSuccessMessage(null);
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-green-800">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage template categories</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading categories...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Categories Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPageCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? 'No categories found matching your search.' : 'No categories available.'}
                    </div>
                  </td>
                </tr>
              ) : (
                currentPageCategories.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.categoryName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{category.categoryDescription || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {totalItems > 5 && totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{startIndex + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(endIndex, totalItems)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{totalItems}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-gray-500 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      const showPage = page === 1 || 
                                      page === totalPages || 
                                      (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      if (!showPage) {
                        // Show ellipsis for gaps
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-gray-500 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.categoryName ? 'border-red-500' : 'border-gray-300'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter category name (e.g., Business Cards, Invitations)"
                    maxLength={100}
                  />
                  {errors.categoryName && (
                    <p className="text-red-500 text-xs mt-1">{errors.categoryName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="categoryDescription"
                    value={formData.categoryDescription}
                    onChange={handleChange}
                    disabled={submitting}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.categoryDescription ? 'border-red-500' : 'border-gray-300'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter category description (e.g., Professional business card templates)"
                    maxLength={500}
                  />
                  {errors.categoryDescription && (
                    <p className="text-red-500 text-xs mt-1">{errors.categoryDescription}</p>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      setFormData({ categoryName: '', categoryDescription: '' });
                      setErrors({});
                    }}
                    disabled={submitting}
                    className={`flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors ${
                      submitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center ${
                      submitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editingCategory ? 'Update' : 'Add'} Category
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

export default Categories;