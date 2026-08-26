"use client";

import { useState } from "react";
import { createSale } from "../actions/actions";

type Product = {
  id: string;
  name: string;
  sellingPrice: string;
  stockQuantity: number;
};

type Customer = {
  id: string;
  name: string;
};

type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  maxStock: number;
};

type SaleFormProps = {
  products: Product[];
  customers: Customer[];
};

export default function SaleForm({
  products,
  customers,
}: SaleFormProps) {
  const [customerId, setCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

  function addToCart() {
    if (!selectedProduct) {
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return;
    }

    const existingItem = cart.find(
      (item) => item.productId === selectedProduct.id
    );

    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (newQuantity > selectedProduct.stockQuantity) {
      alert(
        `Not enough stock. Only ${selectedProduct.stockQuantity} available.`
      );
      return;
    }

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === selectedProduct.id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          quantity,
          unitPrice: Number(selectedProduct.sellingPrice),
          maxStock: selectedProduct.stockQuantity,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);
  }

  function removeFromCart(productId: string) {
    setCart(
      cart.filter((item) => item.productId !== productId)
    );
  }

  function updateCartQuantity(
    productId: string,
    newQuantity: number
  ) {
    if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
      return;
    }

    setCart(
      cart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(
                newQuantity,
                item.maxStock
              ),
            }
          : item
      )
    );
  }

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0
  );

  return (
    <form
      action={createSale}
      onSubmit={() => setIsSubmitting(true)}
      className="grid gap-8 lg:grid-cols-3"
    >
      <input
        type="hidden"
        name="customerId"
        value={customerId}
      />

      <input
        type="hidden"
        name="cart"
        value={JSON.stringify(
          cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        )}
      />

      {/* Product selection */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

          {/* Customer */}
          <div>
            <label
              htmlFor="customer"
              className="block text-sm font-medium text-gray-700"
            >
              Customer
            </label>

            <select
              id="customer"
              value={customerId}
              onChange={(event) =>
                setCustomerId(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
            >
              <option value="">
                Walk-in Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div className="mt-6">
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700"
            >
              Product
            </label>

            <select
              id="product"
              value={selectedProductId}
              onChange={(event) =>
                setSelectedProductId(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
            >
              <option value="">
                Select a product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} — Stock:{" "}
                  {product.stockQuantity}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>

            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(Number(event.target.value))
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          {/* Add product */}
          <button
            type="button"
            onClick={addToCart}
            disabled={!selectedProduct}
            className="mt-6 w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add Product
          </button>
        </div>

        {/* Cart */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Sale
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products included in this transaction.
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-gray-900">
                No products added yet.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Select a product above and add it to the
                sale.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ₦{item.unitPrice.toLocaleString()} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={item.maxStock}
                      value={item.quantity}
                      onChange={(event) =>
                        updateCartQuantity(
                          item.productId,
                          Number(event.target.value)
                        )
                      }
                      className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm"
                    />

                    <p className="w-28 text-right font-semibold text-gray-900">
                      ₦
                      {(
                        item.unitPrice *
                        item.quantity
                      ).toLocaleString()}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.productId)
                      }
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Sale Summary
          </h2>

          <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-sm text-gray-500">
              Products
            </span>

            <span className="font-medium text-gray-900">
              {cart.length}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">
              Total
            </span>

            <span className="text-2xl font-bold text-gray-900">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>

          <button
            type="submit"
            disabled={cart.length === 0 || isSubmitting}
            className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Recording Sale..." : "Record Sale"}
          </button>
        </div>
      </div>
    </form>
  );
}
