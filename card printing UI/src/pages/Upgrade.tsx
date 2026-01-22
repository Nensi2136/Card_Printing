import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PaymentModal from '../components/PaymentModal';

const Upgrade: React.FC = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (user) {
      setUser({ ...user, isPremium: true });
      setShowPaymentModal(false);
      navigate('/customize?custom=true');
    }
  };

  const features = [
    'Unlimited luxury card designs',
    'Custom background images',
    'Advanced color customization',
    'Premium templates library',
    'High-resolution PDF downloads',
    'Priority customer support',
    'Commercial usage rights',
    'Brand removal option'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600">
            Unlock the full potential of CardCraft with our Premium features
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Premium Plan</h2>
            <div className="text-5xl font-bold text-white mb-2">
              $9.99
              <span className="text-xl font-normal">/month</span>
            </div>
            <p className="text-yellow-100">
              Everything you need for professional business cards
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What's Included:
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Pay with Card - $9.99/month
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            What Our Premium Users Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The luxury designs are absolutely stunning. My clients are always impressed with my business cards!"
              </p>
              <div className="font-medium text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-500">Marketing Director</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Worth every penny! The custom backgrounds make my cards stand out from the competition."
              </p>
              <div className="font-medium text-gray-900">Michael Chen</div>
              <div className="text-sm text-gray-500">Business Owner</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Professional quality and easy to use. CardCraft Premium has transformed my networking game."
              </p>
              <div className="font-medium text-gray-900">Emily Rodriguez</div>
              <div className="text-sm text-gray-500">Freelance Designer</div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Upgrade;