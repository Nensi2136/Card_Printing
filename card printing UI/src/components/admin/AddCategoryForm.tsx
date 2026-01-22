import React from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { useCategoryForm, CategoryFormData } from '../../hooks/useCategoryForm';

interface AddCategoryFormProps {
  isVisible: boolean;
  existingCategories: any[];
  onClose: () => void;
  onCategoryAdded: () => void;
  onShowMessage: (message: string, type: 'success' | 'error') => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  isVisible,
  existingCategories,
  onClose,
  onCategoryAdded,
  onShowMessage
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    updateFormField,
    resetForm,
    createNewCategory
  } = useCategoryForm({
    onSuccess: (message) => {
      onShowMessage(message, 'success');
      onCategoryAdded();
      handleCloseForm();
    },
    onError: (error) => {
      onShowMessage(error, 'error');
    }
  });

  const handleCloseForm = () => {
    resetForm();
    onClose();
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createNewCategory(existingCategories);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    updateFormField(name as keyof CategoryFormData, value);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Form Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
          </div>
          <button
            onClick={handleCloseForm}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Category Name Field */}
          <div>
            <label 
              htmlFor="categoryName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              id="categoryName"
              name="categoryName"
              type="text"
              value={formData.categoryName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.categoryName 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
              placeholder="Enter category name (e.g., Business Cards, Invitations)"
              maxLength={100}
            />
            {errors.categoryName && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.categoryName}
              </p>
            )}
          </div>

          {/* Category Description Field */}
          <div>
            <label 
              htmlFor="categoryDescription" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="categoryDescription"
              name="categoryDescription"
              value={formData.categoryDescription}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.categoryDescription 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
              placeholder="Enter category description (e.g., Professional business card templates for various industries)"
              maxLength={500}
            />
            {errors.categoryDescription && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.categoryDescription}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseForm}
              disabled={isSubmitting}
              className={`flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>

        {/* Form Footer */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;
