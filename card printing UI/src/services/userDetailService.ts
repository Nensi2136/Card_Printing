const API_BASE_URL = 'https://localhost:7090/api';

export interface UserDetail {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
  isPremium: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDetail {
  username: string;
  email: string;
  passwordHash: string;
  isPremium: boolean;
  isAdmin: boolean;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserDetail;
  token?: string;
}

export interface UpdateUserDetail {
  username: string;
  email: string;
  passwordHash: string;
  isPremium: boolean;
  isAdmin: boolean;
}

class UserDetailService {
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

  async getAllUsers(): Promise<UserDetail[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/UserDetail`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<UserDetail[]>(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<UserDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/UserDetail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<UserDetail>(response);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async createUser(user: CreateUserDetail): Promise<UserDetail> {
    try {
      console.log('Creating user with data:', user);
      const response = await fetch(`${API_BASE_URL}/UserDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to create user: ${errorText}`);
      }
      
      return this.handleResponse<UserDetail>(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, user: UpdateUserDetail): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/UserDetail/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/UserDetail/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: RegisterUser): Promise<AuthResponse> {
    try {
      // Generate unique phone number to avoid constraint violation
      const uniquePhoneNumber = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-10);
      
      // Hash password and create user
      const createUserData: CreateUserDetail = {
        username: userData.username,
        email: userData.email,
        passwordHash: userData.password, // In real app, this should be hashed on backend
        isPremium: false,
        isAdmin: false,
        phoneNumber: uniquePhoneNumber,
        firstName: userData.username.split(' ')[0] || userData.username,
        lastName: userData.username.split(' ')[1] || ''
      };

      const user = await this.createUser(createUserData);
      return { user };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(credentials: LoginUser): Promise<AuthResponse> {
    try {
      // Get all users and find matching email/password
      const users = await this.getAllUsers();
      const user = users.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() && 
        u.passwordHash === credentials.password // In real app, compare hashed passwords
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      return { user };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserDetail | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
}

export const userDetailService = new UserDetailService();
