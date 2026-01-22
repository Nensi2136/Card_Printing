import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Crown, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { CardTheme } from '../types';
import { cardTemplateService } from '../services/cardTemplateService';

const Product: React.FC = () => {
  const { type } = useParams<{ type: 'basic' | 'luxury' }>();
  const isLuxury = type === 'luxury';
  
  const [templates, setTemplates] = useState<CardTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiTemplates = await cardTemplateService.getAllTemplates();
      
      // Transform API templates to CardTheme format
      const transformedTemplates: CardTheme[] = apiTemplates.map(template => ({
        id: template.templateId.toString(),
        name: template.title,
        backgroundColor: '#2563eb', // Default color
        backgroundImage: template.filePath || undefined,
        textColor: '#ffffff', // Default text color
        isPremium: template.isPremium
      }));
      
      setTemplates(transformedTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };


  // Filter templates based on premium status and page type
  const filteredTemplates = templates.filter(template => 
    isLuxury ? template.isPremium : !template.isPremium
  );

  const themes = filteredTemplates;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isLuxury ? 'Luxury' : 'Basic'} Business Cards
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isLuxury 
              ? 'Premium designs with stunning backgrounds and advanced customization options.'
              : 'Professional, clean designs perfect for any business or profession.'
            }
          </p>
          {isLuxury && (
            <div className="mt-4 inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
              <Crown className="h-4 w-4 mr-2" />
              Premium Feature - Upgrade Required
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading templates...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-12">
            <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
            <span className="text-red-600">{error}</span>
          </div>
        )}

        {/* Themes Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {themes.map((theme) => {
              
              return (
                <div key={theme.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div 
                    className="h-48 p-6 flex flex-col justify-between relative"
                    style={{
                      backgroundColor: theme.backgroundColor,
                      backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: theme.textColor
                    }}
                  >
                    {theme.backgroundImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    )}
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold">Your Business</h3>
                      <p className="text-sm opacity-90">Your Title</p>
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm">Your Name</p>
                      <p className="text-xs">contact@business.com</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{theme.name}</h4>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/customize?theme=${theme.id}&type=${type}`}
                        className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Use Design
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Something Custom?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your own unique design with our advanced customization tools.
          </p>
          <Link
            to="/customize?custom=true"
            className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Custom Design
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Product;