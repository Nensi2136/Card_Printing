import { paymentService } from './paymentService';
import { userDetailService } from './userDetailService';
import { cardTemplateService } from './cardTemplateService';

export interface DashboardStats {
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
  totalTemplates: number;
  premiumUsers: number;
  activeUsers: number;
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'payment' | 'template';
  message: string;
  time: string;
  timestamp: Date;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Fetch data from all APIs in parallel
      const [users, payments, templates] = await Promise.all([
        userDetailService.getAllUsers().catch(() => []),
        paymentService.getAllPayments().catch(() => []),
        cardTemplateService.getAllTemplates().catch(() => [])
      ]);

      // Calculate statistics
      const totalUsers = users.length;
      const totalPayments = payments.length;
      const totalTemplates = templates.length;

      // Calculate total revenue
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate premium users
      const premiumUsers = users.filter(user => user.isPremium).length;

      // For active users, we'll use a simple heuristic (users created in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = users.filter(user => 
        new Date(user.createdAt) > thirtyDaysAgo
      ).length;

      return {
        totalUsers,
        totalPayments,
        totalRevenue,
        totalTemplates,
        premiumUsers,
        activeUsers
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if API calls fail
      return {
        totalUsers: 0,
        totalPayments: 0,
        totalRevenue: 0,
        totalTemplates: 0,
        premiumUsers: 0,
        activeUsers: 0
      };
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = [];

      // Fetch recent data from APIs
      const [users, payments, templates] = await Promise.all([
        userDetailService.getAllUsers().catch(() => []),
        paymentService.getAllPayments().catch(() => []),
        cardTemplateService.getAllTemplates().catch(() => [])
      ]);

      // Add recent users (last 5)
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      
      recentUsers.forEach((user) => {
        activities.push({
          id: `user-${user.userId}`,
          type: 'user',
          message: `New user registered: ${user.email}`,
          time: this.getRelativeTime(new Date(user.createdAt)),
          timestamp: new Date(user.createdAt)
        });
      });

      // Add recent payments (last 3)
      const recentPayments = payments
        .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
        .slice(0, 3);
      
      recentPayments.forEach((payment) => {
        activities.push({
          id: `payment-${payment.paymentId}`,
          type: 'payment',
          message: `Payment received: $${payment.amount} from ${payment.user?.username || 'User'}`,
          time: this.getRelativeTime(new Date(payment.paymentDate)),
          timestamp: new Date(payment.paymentDate)
        });
      });


      // Add recent templates (last 2)
      const recentTemplates = templates
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);
      
      recentTemplates.forEach((template) => {
        activities.push({
          id: `template-${template.templateId}`,
          type: 'template',
          message: `New template "${template.title}" added`,
          time: this.getRelativeTime(new Date(template.createdAt)),
          timestamp: new Date(template.createdAt)
        });
      });

      // Sort all activities by timestamp (most recent first) and return top 10
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}

export const dashboardService = new DashboardService();
