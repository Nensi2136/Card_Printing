import { userDetailService, LoginUser } from './userDetailService';

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin';
  loginTime: string;
}

export interface RegularUser {
  id: string;
  email: string;
  username: string;
  isPremium: boolean;
  role: 'user';
}

export type AuthenticatedUser = AdminUser | RegularUser;

export interface RoleBasedAuthResponse {
  user: AuthenticatedUser;
  userType: 'admin' | 'user';
}

class AuthService {
  // Static admin credentials
  private static readonly ADMIN_CREDENTIALS = {
    email: 'admin@cardcraft.com',
    password: 'admin123',
    username: 'Administrator'
  };

  /**
   * Authenticate user with role-based login
   * Checks for admin credentials first, then regular user credentials
   */
  async login(credentials: LoginUser): Promise<RoleBasedAuthResponse> {
    try {
      // Check if credentials match static admin
      if (this.isAdminCredentials(credentials)) {
        const adminUser: AdminUser = {
          id: 'admin-1',
          username: AuthService.ADMIN_CREDENTIALS.username,
          email: AuthService.ADMIN_CREDENTIALS.email,
          role: 'admin',
          loginTime: new Date().toISOString()
        };

        return {
          user: adminUser,
          userType: 'admin'
        };
      }

      // Try regular user authentication through API
      const userResponse = await userDetailService.login(credentials);
      
      const regularUser: RegularUser = {
        id: userResponse.user.userId.toString(),
        email: userResponse.user.email,
        username: userResponse.user.username,
        isPremium: userResponse.user.isPremium,
        role: 'user'
      };

      return {
        user: regularUser,
        userType: 'user'
      };

    } catch (error) {
      // If user authentication fails, throw appropriate error
      throw new Error('Invalid email or password');
    }
  }

  /**
   * Check if credentials match static admin credentials
   */
  private isAdminCredentials(credentials: LoginUser): boolean {
    return credentials.email.toLowerCase() === AuthService.ADMIN_CREDENTIALS.email.toLowerCase() &&
           credentials.password === AuthService.ADMIN_CREDENTIALS.password;
  }

  /**
   * Get admin credentials for reference (without password)
   */
  getAdminInfo() {
    return {
      email: AuthService.ADMIN_CREDENTIALS.email,
      username: AuthService.ADMIN_CREDENTIALS.username
    };
  }

  /**
   * Validate if user has admin role
   */
  isAdmin(user: AuthenticatedUser): user is AdminUser {
    return user.role === 'admin';
  }

  /**
   * Validate if user has regular user role
   */
  isRegularUser(user: AuthenticatedUser): user is RegularUser {
    return user.role === 'user';
  }

  /**
   * Check if user has permission to access admin routes
   */
  hasAdminAccess(user: AuthenticatedUser | null): boolean {
    return user !== null && this.isAdmin(user);
  }

  /**
   * Check if user has permission to access user routes
   */
  hasUserAccess(user: AuthenticatedUser | null): boolean {
    return user !== null && (this.isAdmin(user) || this.isRegularUser(user));
  }
}

export const authService = new AuthService();
