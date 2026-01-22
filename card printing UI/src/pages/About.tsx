import React from 'react';
import { Award, Users, Heart, Target } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">About CardCraft</h1>
          <p className="text-xl leading-relaxed">
            We're passionate about helping professionals and businesses create 
            stunning business cards that make lasting impressions. Since 2020, 
            we've been the trusted choice for thousands of users worldwide.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                We deliver premium designs that exceed expectations
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Building a community of successful professionals
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p className="text-gray-600">
                We love what we do and it shows in our work
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Constantly improving and adding new features
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Story
          </h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              CardCraft was born from a simple frustration: creating professional 
              business cards shouldn't be complicated or expensive. Our founders, 
              experienced designers and entrepreneurs, noticed that most solutions 
              were either too complex for beginners or too limited for professionals.
            </p>
            <p className="mb-6">
              We set out to create the perfect balance - a platform that's intuitive 
              enough for anyone to use, yet powerful enough to create truly 
              professional results. Today, we're proud to serve thousands of users 
              who trust us with their professional image.
            </p>
            <p>
              From startup founders to established corporations, our users rely on 
              CardCraft to make meaningful connections through beautifully designed 
              business cards. We're committed to continuing this mission and helping 
              you succeed in your professional endeavors.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            CardCraft by the Numbers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Cards Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">15,000+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Design Templates</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;