const API_BASE_URL = 'https://localhost:7090/api';

export interface Payment {
  paymentId: number;
  userId: number;
  acountNumber: number;
  cvvNumber: number;
  cardExpiryDate: string;
  amount: number;
  paymentDate: string;
  user?: {
    userId: number;
    username: string;
    email: string;
    passwordHash: string;
    isPremium: boolean;
    isAdmin: boolean;
    createdAt: string;
    updatedAt?: string;
  };
}

export interface CreatePayment {
  userId: number;
  acountNumber: number;
  cvvNumber: number;
  cardExpiryDate: string;
  amount: number;
  paymentDate: string;
}

export interface UpdatePayment {
  userId: number;
  acountNumber: number;
  cvvNumber: number;
  cardExpiryDate: string;
  amount: number;
}

class PaymentService {
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

  async getAllPayments(): Promise<Payment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<Payment[]>(response);
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  async getPaymentById(id: number): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<Payment>(response);
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error;
    }
  }

  async createPayment(payment: CreatePayment): Promise<Payment> {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      });
      return this.handleResponse<Payment>(response);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id: number, payment: UpdatePayment): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payment, paymentId: id }),
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error updating payment ${id}:`, error);
      throw error;
    }
  }

  async deletePayment(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
