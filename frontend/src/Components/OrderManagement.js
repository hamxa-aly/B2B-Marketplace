import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faClock, faChevronDown, faChevronUp, faSpinner, faTag } from "@fortawesome/free-solid-svg-icons"

export default function OrderManagementComponent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [newDeliveryTime, setNewDeliveryTime] = useState("")

  // Available order statuses
  const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const storeIDResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/GetStoreId`,{method:'GET', headers: {
          authorization: `${token}`,
        }});
        if(!storeIDResponse.ok){
          throw new Error('Failed to fetch store ID');
        }
        const jsonResponse =await storeIDResponse.json();
        const storeId = jsonResponse.storeID; 
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/GetOrders/${storeId}`,{method: 'GET', headers:{
          authorization: `${token}`,
        }})

        if (!response.ok) {
          throw new Error('Failed to fetch store Orders');
        }

        const jsonOrdersResponse = await response.json();
        const data = jsonOrdersResponse.orders;
        setOrders(data)
        setError(null)
      } catch (err) {
        setError("Failed to load orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
    const intervalId = setInterval(fetchOrders, 60000)
    return () => clearInterval(intervalId)
  }, [])

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          authorization: `${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
  
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };
  
  const handleUpdateDeliveryTime = async (orderId, newTime) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}/delivery`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({ newDeliveryDate: newTime }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update delivery time");
      }
  
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, DeliveryDate: newTime } : order)));
      setShowDeliveryDialog(false);
    } catch (err) {
      console.error("Error updating delivery time:", err);
    }
  };
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({ newStatus }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
  
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, OrderStatus: newStatus } : order)));
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };
  

  // Toggle order expansion
  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  // Open delivery time dialog
  const openDeliveryDialog = (orderId) => {
    setSelectedOrderId(orderId)
    const order = orders.find((o) => o.id === orderId)
    setNewDeliveryTime(order.deliveryTime)
    setShowDeliveryDialog(true)
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="mx-auto px-10">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex flex-wrap gap-2">
          {/* <Link href="/orders/new">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 whitespace-nowrap">
              New Order
            </button>
          </Link> */}
          <Link href="/orders/export">
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">
              Export Orders
            </button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-orange-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders available.</div>
        ) : (
          <div className="w-full">
            {orders.map((order) => (
              <div key={order._id} className="border-b last:border-b-0">
                <div
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleOrder(order._id)}
                >
                  <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pr-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="font-medium">{order._id}</div>
                      <div className="text-sm text-gray-500 sm:hidden">{order.customerName}</div>
                      <div className="hidden sm:block">{order.customerName}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="text-sm font-medium">PKR {parseFloat(order.TotalPrice.$numberDecimal).toFixed(2)}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.OrderStatus)}`}>
                        {order.OrderStatus}
                      </span>
                      <div className="text-sm text-gray-500 hidden sm:block">{order.date}</div>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={expandedOrder === order._id ? faChevronUp : faChevronDown}
                    className="h-4 w-4 text-gray-500"
                  />
                </div>

                {expandedOrder === order._id && (
                  <div className="px-4 py-2 bg-gray-50">
                    <div className="bg-white border rounded-lg shadow-sm">
                      <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold">Order Details</h2>
                        <p className="text-sm text-gray-500">Placed on {order.createdAt}</p>
                      </div>

                      <div className="px-6 py-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="font-semibold mb-2">Customer Information</h3>
                            <p>{order.customerName}</p>
                            <Link href={`/customers/${order.buyerId}`} className="text-blue-600 text-sm hover:underline">
                              View Customer Profile
                            </Link>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Order Summary</h3>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>PKR {parseFloat(order.SubTotalPrice.$numberDecimal).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>PKR {parseFloat(order.ShippingPrice.$numberDecimal).toFixed(2)}</span>
                              </div>
                              
                              <hr className="my-2" />
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>PKR {parseFloat(order.TotalPrice.$numberDecimal).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h3 className="font-semibold mb-2">Items</h3>
                          <div className="space-y-2">
                          <div className="space-y-2">
  {order.OrderItems.map((item, i) => (
    <div
      key={i}
      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 border rounded gap-2"
    >
      <span>{item.productId?.Name || "Unknown Product"}</span>
      <Link
        href={`/products/${item.productId?._id}`}
        className="text-blue-600 text-sm hover:underline"
      >
        View Product
      </Link>
    </div>
  ))}
</div>

                          </div>
                        </div>
                        <div className="mt-6">
                          <h3 className="font-semibold mb-2">Delivery & Status Information</h3>
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                              <span>Estimated Delivery: {order.DeliveryDate}</span>
                              <button
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeliveryDialog(order._id)
                                }}
                              >
                                Update
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
                              <span>Order Status:</span>
                              <select
                                className="border rounded-md p-1.5 text-sm"
                                value={order.OrderStatus}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  handleUpdateStatus(order._id, e.target.value)
                                }}
                              >
                                {orderStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/orders/${order._id}`}>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                              View Details
                            </button>
                          </Link>
                          <Link href={`/orders/${order._id}/invoice`}>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                              Generate Invoice
                            </button>
                          </Link>
                        </div>
                        <button
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteOrder(order._id)
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery Time Update Dialog */}
      {showDeliveryDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Update Delivery Time</h3>
            <input
                type="date"
                className="w-full p-2 border rounded-md mb-4"
                value={newDeliveryTime}
                onChange={(e) => setNewDeliveryTime(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setShowDeliveryDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => handleUpdateDeliveryTime(selectedOrderId, newDeliveryTime)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

