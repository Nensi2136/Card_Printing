export interface ContactMessage {
  contactId: number;
  userId?: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  user?: {
    userId: number;
    username: string;
    email: string;
  };
}

export interface CreateContactMessage {
  userId?: number;
  name: string;
  email: string;
  message: string;
}

export interface UpdateContactMessage {
  name: string;
  email: string;
  message: string;
}

class ContactService {
  private readonly baseURL = 'https://localhost:7090/api/ContactU';

  async getAllContacts(): Promise<ContactMessage[]> {
    try {
      const response = await fetch(this.baseURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contact messages');
    }
  }

  async getContactById(id: number): Promise<ContactMessage> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw new Error('Failed to fetch contact message');
    }
  }

  async createContact(contact: CreateContactMessage): Promise<ContactMessage> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new Error('Failed to create contact message');
    }
  }

  async updateContact(id: number, contact: UpdateContactMessage): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: id,
          ...contact
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      throw new Error('Failed to update contact message');
    }
  }

  async deleteContact(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw new Error('Failed to delete contact message');
    }
  }
}

export const contactService = new ContactService();
