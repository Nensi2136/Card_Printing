const API_BASE_URL = 'https://localhost:7090/api';

export interface CardTemplate {
  templateId: number;
  categoryId: number;
  title: string;
  cardTemplateDescription?: string;
  filePath: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateCardTemplate {
  categoryId: number;
  title: string;
  cardTemplateDescription?: string;
  filePath: string;
  isPremium: boolean;
}

export interface UpdateCardTemplate {
  categoryId: number;
  title: string;
  cardTemplateDescription?: string;
  filePath: string;
  isPremium: boolean;
}

class CardTemplateService {
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

  async getAllTemplates(): Promise<CardTemplate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/CardTemplate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<CardTemplate[]>(response);
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  async getTemplateById(id: number): Promise<CardTemplate> {
    try {
      const response = await fetch(`${API_BASE_URL}/CardTemplate/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<CardTemplate>(response);
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      throw error;
    }
  }

  async createTemplate(template: CreateCardTemplate): Promise<CardTemplate> {
    try {
      const response = await fetch(`${API_BASE_URL}/CardTemplate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });
      return this.handleResponse<CardTemplate>(response);
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async updateTemplate(id: number, template: UpdateCardTemplate): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/CardTemplate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...template, templateId: id }),
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      throw error;
    }
  }

  async deleteTemplate(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/CardTemplate/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  }
}

export const cardTemplateService = new CardTemplateService();
