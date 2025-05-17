import React from 'react';
import { FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AffiliateFailed = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <FaTimesCircle className="h-6 w-6 text-red-600" />
          </div>
          
          {/* Heading */}
          <h2 className="mt-3 text-lg font-medium text-gray-900">Payment Failed</h2>
          
          {/* Message */}
          <p className="mt-2 text-sm text-gray-500">
            We couldn't process your affiliate program payment. Please try again.
          </p>
          
          {/* Additional Help */}
          <div className="mt-4 bg-red-50 p-3 rounded-md">
            <p className="text-sm text-red-600">
              If the amount was deducted from your account, it will be refunded within 3-5 business days.
            </p>
          </div>
          
          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Link
              to="/affiliate"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try Again
            </Link>
            
            <Link
              to="/contact"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact Support
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <FaArrowLeft className="mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateFailed;