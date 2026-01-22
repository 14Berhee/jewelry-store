// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: number;
    total: number;
    status: string;
    createdAt: string;
    user: {
      name: string | null;
      email: string;
    };
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    price: number;
    _count: {
      orderItems: number;
    };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      const res = await fetch('/api/admin/dashboard', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+23%',
      isPositive: true,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8%',
      isPositive: true,
    },
    {
      title: 'Total Revenue',
      value: `₮${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+15%',
      isPositive: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    {card.isPositive ? (
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        card.isPositive ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {card.change}
                    </span>
                    <span className="ml-1 text-gray-500">from last month</span>
                  </div>
                </div>
                <div className={`rounded-full p-3 ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Top Products Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
          </div>
          <div className="divide-y">
            {stats.recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No orders yet</div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.user.name || order.user.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₮{order.total.toLocaleString()}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Products
            </h2>
          </div>
          <div className="divide-y">
            {stats.topProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No products sold yet
              </div>
            ) : (
              stats.topProducts.map((product, index) => (
                <div key={product.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₮{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {product._count.orderItems} sold
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
