import { useState, useCallback } from 'react';
import { templateCategoryService, CreateTemplateCategory, UpdateTemplateCategory } from '../services/templateCategoryService';

export interface CategoryFormData {
  categoryName: string;
  categoryDescription: string;
}

export interface CategoryFormErrors {
  categoryName?: string;
  categoryDescription?: string;
}

export interface UseCategoryFormProps {
  initialData?: CategoryFormData;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export const useCategoryForm = ({ 
  initialData = { categoryName: '', categoryDescription: '' },
  onSuccess,
  onError 
}: UseCategoryFormProps = {}) => {
  const [formData, setFormData] = useState<CategoryFormData>(initialData);
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCategoryForm = useCallback((data: CategoryFormData, existingCategories: any[] = []): CategoryFormErrors => {
    const validationErrors: CategoryFormErrors = {};

    // Validate category name
    if (!data.categoryName.trim()) {
      validationErrors.categoryName = 'Category name is required';
    } else if (data.categoryName.trim().length < 2) {
      validationErrors.categoryName = 'Category name must be at least 2 characters';
    } else if (data.categoryName.trim().length > 100) {
      validationErrors.categoryName = 'Category name must be less than 100 characters';
    }

    // Check for duplicate category names
    const isDuplicateName = existingCategories.some(category => 
      category.categoryName.toLowerCase() === data.categoryName.trim().toLowerCase()
    );
    
    if (isDuplicateName) {
      validationErrors.categoryName = 'A category with this name already exists';
    }

    // Validate category description
    if (!data.categoryDescription?.trim()) {
      validationErrors.categoryDescription = 'Description is required';
    } else if (data.categoryDescription.trim().length < 5) {
      validationErrors.categoryDescription = 'Description must be at least 5 characters';
    } else if (data.categoryDescription.trim().length > 500) {
      validationErrors.categoryDescription = 'Description must be less than 500 characters';
    }

    return validationErrors;
  }, []);

  const updateFormField = useCallback((field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setFormData({ categoryName: '', categoryDescription: '' });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const createNewCategory = useCallback(async (existingCategories: any[] = []) => {
    const validationErrors = validateCategoryForm(formData, existingCategories);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return false;
    }

    try {
      setIsSubmitting(true);

      const categoryPayload: CreateTemplateCategory = {
        categoryName: formData.categoryName.trim(),
        categoryDescription: formData.categoryDescription.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await templateCategoryService.createCategory(categoryPayload);
      
      onSuccess?.('Category created successfully!');
      resetForm();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      onError?.(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateCategoryForm, onSuccess, onError, resetForm]);

  const updateExistingCategory = useCallback(async (categoryId: number, existingCategories: any[] = []) => {
    // Filter out the current category from duplicate check
    const otherCategories = existingCategories.filter(cat => cat.categoryId !== categoryId);
    const validationErrors = validateCategoryForm(formData, otherCategories);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return false;
    }

    try {
      setIsSubmitting(true);

      const updatePayload: UpdateTemplateCategory = {
        categoryName: formData.categoryName.trim(),
        categoryDescription: formData.categoryDescription.trim(),
        updatedAt: new Date().toISOString()
      };

      await templateCategoryService.updateCategory(categoryId, updatePayload);
      
      onSuccess?.('Category updated successfully!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
      onError?.(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateCategoryForm, onSuccess, onError]);

  return {
    formData,
    errors,
    isSubmitting,
    updateFormField,
    resetForm,
    createNewCategory,
    updateExistingCategory,
    setFormData
  };
};
