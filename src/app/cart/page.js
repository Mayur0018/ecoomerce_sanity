"use client";
import React from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import {
  decrementQuantity,
  incrementQuantity,
} from "../../../redux/CartReducer";
import { loadStripe } from "@stripe/stripe-js";

function Cart() {
  const stripePromise = loadStripe(
    "pk_test_51JEFpUSByXQZwLeJlP8yozoVPaknL6iXC2LgEAdRbtzAdrjrAjwdtWLblrx1iu5eP5mBeRVOCkHtPOkDYWSUTksZ00h0vpZ2Cg"
  );
  const cart = useSelector((state) => state.cart.cart);
  
  const dispatch = useDispatch();

  const increaseQuantity = (item) => {
    dispatch(incrementQuantity(item));
  };

  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };

  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((prev, curr) => prev + curr, 0);
  const grandTotal = total + 65;

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
  
      // Log the cart to verify its structure
      console.log('Cart:', cart);
  
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({ body: cart }), // Ensure cart is correctly structured
      });
  
      const data = await response.json();
  
      // Log the response to see the server's response
      console.log('Response status:', response.status);
      console.log('Response data:', data);
  
      if (response.ok && data.session) {
        stripe?.redirectToCheckout({ sessionId: data?.session.id });
      } else {
        console.error('Failed to create checkout session:', data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  

  return (
    <div>
      <Header />
      <div className="relative grid grid-cols-8 h-screen bg-gray-200">
        <div className="flex flex-col col-span-5 mt-16 ml-20">
          <h2 className="text-xl font-bold">Your shopping Cart</h2>
          {cart?.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-md p-3 bg-white shadow-md flex flex-row space-x-4 my-4"
            >
              <img
                className="w-20 h-20 object-contain"
                src={item.image}
                alt={item.title}
              />

              <div className="flex-grow">
                <p className="text-sm line-clamp-2">{item.title}</p>
                <p className="text-xl font-semibold">Price : Rs {item.price}</p>
                {item?.description ? (
                  <p className="text-xs line-clamp-2 font-normal">
                    {item?.description}
                  </p>
                ) : (
                  <div>
                    <p className="text-sm line-clamp-2 font-normal">
                      Color : {item?.color}
                    </p>
                    <p className="text-sm line-clamp-2 font-normal">
                      Size : {item?.size}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2 mt-1">
                  <button
                    className="rounded-full bg-gray-500 px-2"
                    onClick={() => decreaseQuantity(item)}
                  >
                    <MinusSmallIcon className="h-4 w-4 text-white" />
                  </button>
                  <span className="text-gray-500">{item.quantity}</span>
                  <button
                    className="rounded-full bg-gray-500 px-2"
                    onClick={() => increaseQuantity(item)}
                  >
                    <PlusSmallIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <p
                    className="text-xs font-semibold text-cyan-600 cursor-pointer"
                    onClick={() => console.log("Delete clicked")}
                  >
                    Delete
                  </p>
                  <p className="text-xs font-semibold text-cyan-600 cursor-pointer">
                    Save for later
                  </p>
                  <p className="text-xs font-semibold text-cyan-600 cursor-pointer">
                    See more like this
                  </p>
                  <p className="text-xs font-semibold text-cyan-600 cursor-pointer">
                    Share
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2 mt-16 ml-20">
          <h3 className="mb-2">Choose a delivery Address</h3>
          <div>
            <div className="bg-white p-4 rounded-sm mt-2">
              <h4 className="text-xs text-gray-400">Select Location</h4>
              <p className="text-xs text-gray-400">
                Please select location, so that we can find a place that
                delivers to you
              </p>
              <button className="rounded-sm py-1 mt-2 text-sm font-semibold text-gray-600">
                Add Address
              </button>
            </div>
          </div>

          <h3 className="mt-4">Offers</h3>
          <div>
            <div className="bg-white p-4 rounded-sm mt-2">
              <h4 className="text-xs text-gray-400">Apply Coupon</h4>
              <p className="text-xs text-gray-400">
                Get Discount with your order
              </p>
            </div>
          </div>

          <h3 className="mt-1">Price details</h3>
          <div className="bg-white rounded-sm mt-2 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs">Sub Total</h4>
              <p className="text-sm font-normal">Rs {total.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs">Discount</h4>
              <p className="text-sm font-normal">-</p>
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs">Taxes and Charges</h4>
              <p className="text-sm font-normal">Rs 65</p>
            </div>
            <hr className="w-full mt-1 decoration-dotted" />
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold">Grand Total</h4>
              <p className="text-sm font-normal">Rs {grandTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-yellow-500 text-center font-normal text-white rounded-md py-2 px-3 w-full"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
