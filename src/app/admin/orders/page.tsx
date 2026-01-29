'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: number;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
  customerName: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  } | null;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
    };
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/orders', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    setUpdatingOrderId(orderId);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status: data.order.status }
              : order
          )
        );
        alert('Order status updated successfully!');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Update order status error:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PAID':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Package className="h-4 w-4" />;
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'SHIPPED':
        return <Truck className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const statusOptions = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-gray-600">
          Manage customer orders ({orders.length} total)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="text-gray-500">
            {searchQuery || statusFilter !== 'ALL'
              ? 'No orders found'
              : 'No orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {order.customerName} • {order.email}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₮{order.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item(s)
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Order Items:
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          ₮{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Delivery Information:
                  </h4>
                  <p className="text-sm text-gray-600">{order.address}</p>
                  <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    disabled={updatingOrderId === order.id}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:opacity-50"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        Change to {status}
                      </option>
                    ))}
                  </select>

                  <Link
                    href={`/order-invoice/${order.id}`}
                    target="_blank"
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    View Invoice
                  </Link>

                  {updatingOrderId === order.id && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                      Updating...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
