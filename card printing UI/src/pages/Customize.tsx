import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, Crown, Palette, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CardPreview from '../components/CardPreview';
import { cardTemplateService, CardTemplate } from '../services/cardTemplateService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Customize: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, cardData, setCardData } = useApp();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeId = searchParams.get('theme');
  const cardType = searchParams.get('type');
  const isCustom = searchParams.get('custom') === 'true';
  const isLuxury = cardType === 'luxury';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if ((isLuxury || isCustom) && !user.isPremium) {
      setShowPremiumModal(true);
    }

    // Fetch template data if themeId is provided
    if (themeId) {
      fetchTemplateData(parseInt(themeId));
    }
  }, [themeId, user, navigate, isLuxury, isCustom]);

  const fetchTemplateData = async (templateId: number) => {
    try {
      setLoading(true);
      setError(null);
      const template = await cardTemplateService.getTemplateById(templateId);
      setSelectedTemplate(template);
      
      // Update card data with template information
      const templateCardData = {
        ...cardData,
        backgroundColor: template.isPremium ? '#2563eb' : '#ffffff',
        backgroundImage: template.filePath || undefined,
        textColor: template.isPremium ? '#ffffff' : '#1f2937'
      };
      
      setCardData(templateCardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch template');
      console.error('Error fetching template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCardData({ ...cardData, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Create file reader to convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setCardData({ ...cardData, backgroundImage: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  const downloadPDF = async () => {
    if ((isLuxury || isCustom) && !user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }

    const cardElement = document.getElementById('business-card');
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [89, 51], // Standard business card size (3.5" x 2")
      });

      // Add image with proper scaling to fit business card dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, 89, 51);
      pdf.save(`${cardData.businessName || 'business-card'}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const colorPresets = [
    '#2563eb', '#7c3aed', '#dc2626', '#059669', '#d97706', '#1f2937', '#6b7280', '#ffffff'
  ];

  const backgroundImages = [
    'https://images.pexels.com/photos/259915/pexels-photo-259915.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2693208/pexels-photo-2693208.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customize Your Business Card
          </h1>
          <p className="text-gray-600">
            Design your perfect business card with live preview
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Card Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={cardData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={cardData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={cardData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={cardData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={cardData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your website URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={cardData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Enter your business address"
                />
              </div>

              {/* Design Controls */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Design Options
                  {(isLuxury || isCustom) && !user?.isPremium && (
                    <Crown className="h-4 w-4 ml-2 text-yellow-500" />
                  )}
                </h3>

                <div className="space-y-4">
                  {/* Only show background color picker for luxury cards */}
                  {(isLuxury || isCustom) && (
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleInputChange('backgroundColor', color)}
                          className={`w-8 h-8 rounded border-2 ${
                            cardData.backgroundColor === color ? 'border-gray-600' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          disabled={!user?.isPremium}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={cardData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-16 h-8 border border-gray-300 rounded"
                      disabled={!user?.isPremium}
                    />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={cardData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-16 h-8 border border-gray-300 rounded"
                    />
                  </div>

                  {(isLuxury || isCustom) && (
                    <div className="space-y-4">
                      {/* Preset Background Images */}
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preset Background Images
                        {!user?.isPremium && (
                          <span className="text-yellow-600 text-xs ml-2">(Premium Only)</span>
                        )}
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                          onClick={() => handleInputChange('backgroundImage', '')}
                          className={`p-2 border rounded ${
                            !cardData.backgroundImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                          }`}
                          disabled={!user?.isPremium}
                        >
                          None
                        </button>
                        {backgroundImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => user?.isPremium && handleInputChange('backgroundImage', image)}
                            className={`h-16 border rounded bg-cover bg-center ${
                              cardData.backgroundImage === image ? 'border-blue-500' : 'border-gray-300'
                            } ${!user?.isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ backgroundImage: `url(${image})` }}
                            disabled={!user?.isPremium}
                          />
                        ))}
                      </div>
                      </div>

                      {/* Custom Background Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Custom Background
                          {!user?.isPremium && (
                            <span className="text-yellow-600 text-xs ml-2">(Premium Only)</span>
                          )}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={!user?.isPremium}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                            !user?.isPremium ? 'opacity-50 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'
                          }`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: JPG, PNG, GIF (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <button
                onClick={downloadPDF}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  (isLuxury || isCustom) && !user?.isPremium
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Download className="h-4 w-4 mr-2" />
                {(isLuxury || isCustom) && !user?.isPremium ? 'Upgrade to Download' : 'Download PDF'}
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading template...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex justify-center items-center py-12">
                <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
                <span className="text-red-600">{error}</span>
              </div>
            )}

            {/* Template Info */}
            {selectedTemplate && !loading && !error && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">{selectedTemplate.title}</h3>
                {selectedTemplate.cardTemplateDescription && (
                  <p className="text-sm text-gray-600 mt-1">{selectedTemplate.cardTemplateDescription}</p>
                )}
                {selectedTemplate.isPremium && (
                  <div className="mt-2 inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium Template
                  </div>
                )}
              </div>
            )}

            {/* Card Preview */}
            {!loading && !error && (
              <div className="flex justify-center">
                <CardPreview cardData={cardData} />
              </div>
            )}

            {(isLuxury || isCustom) && !user?.isPremium && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <Crown className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Premium Feature</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Upgrade to Premium to access luxury designs, custom backgrounds, and download capabilities.
                    </p>
                    <button
                      onClick={() => navigate('/upgrade')}
                      className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-6">
                This feature requires a Premium subscription. Upgrade now to access luxury designs and advanced customization options.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowPremiumModal(false);
                    navigate('/upgrade');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customize;