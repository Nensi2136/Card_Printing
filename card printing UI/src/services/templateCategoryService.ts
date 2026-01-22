const API_BASE_URL = 'https://localhost:7090/api';

export interface TemplateCategory {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateCategory {
  CategoryName: string;
  CategoryDescription?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface UpdateTemplateCategory {
  CategoryName: string;
  CategoryDescription?: string;
  UpdatedAt: string;
}

class TemplateCategoryService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json();
  }

  async getAllCategories(): Promise<TemplateCategory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/TemplateCategory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<TemplateCategory[]>(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<TemplateCategory> {
    try {
      const response = await fetch(`${API_BASE_URL}/TemplateCategory/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<TemplateCategory>(response);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  async createCategory(category: CreateTemplateCategory): Promise<TemplateCategory> {
    try {
      const response = await fetch(`${API_BASE_URL}/TemplateCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return this.handleResponse<TemplateCategory>(response);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, category: UpdateTemplateCategory): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/TemplateCategory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/TemplateCategory/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
}

export const templateCategoryService = new TemplateCategoryService();