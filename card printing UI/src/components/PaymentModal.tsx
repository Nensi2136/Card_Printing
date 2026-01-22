import React, { useState } from 'react';
import { X, CreditCard, Lock, Check } from 'lucide-react';
import { paymentService, CreatePayment } from '../services/paymentService';
import { userDetailService } from '../services/userDetailService';
import { useApp } from '../context/AppContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount?: number;
  description?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount = 9.99, 
  description = 'CardCraft Premium (Monthly)' 
}) => {
  const { user, setUser } = useApp();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formatted.length <= 5) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    // Limit CVV to 4 digits
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '');
      if (formatted.length <= 4) {
        setFormData({ ...formData, [name]: formatted });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('User not found. Please log in again.');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Create payment record
      const paymentData: CreatePayment = {
        userId: parseInt(user.id),
        acountNumber: parseInt(formData.cardNumber.replace(/\s/g, '').slice(-4)), // Last 4 digits
        cvvNumber: parseInt(formData.cvv),
        cardExpiryDate: formData.expiryDate,
        amount: amount,
        paymentDate: new Date().toISOString()
      };
      
      // Save payment to database
      await paymentService.createPayment(paymentData);
      
      // First get the full user details from backend
      const fullUserDetails = await userDetailService.getUserById(parseInt(user.id));
      
      // Update user to premium status
      await userDetailService.updateUser(parseInt(user.id), {
        username: fullUserDetails.username,
        email: fullUserDetails.email,
        passwordHash: fullUserDetails.passwordHash,
        isPremium: true,
        isAdmin: fullUserDetails.isAdmin
      });
      
      // Update local user state
      setUser({ ...user, isPremium: true });
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessing(false);
      onSuccess();
    } catch (err) {
      setProcessing(false);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      console.error('Payment error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Complete Your Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{description}</span>
            <span className="font-semibold text-gray-900">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-lg text-blue-600">${amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <CreditCard className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <X className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <Lock className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Your payment information is secure and encrypted
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className={`w-full mt-6 py-3 px-4 rounded-md font-medium transition-colors ${
              processing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 mr-2" />
                Complete Purchase - ${amount.toFixed(2)}
              </div>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            You can cancel your subscription at any time.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;