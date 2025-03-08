import React, { useState } from 'react';
import { Activity, Microscope, FlaskRound as Flask, Clock, Award, Users, Phone, X } from 'lucide-react';

const HomePage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleBookTest = () => {
    setShowDialog(true);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">Advanced Pathology Testing for Better Healthcare</h1>
              <p className="text-xl mb-6">Accurate, reliable, and timely diagnostic services for patients and healthcare providers.</p>
              <button 
                onClick={handleBookTest}
                className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Book a Test
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Laboratory Equipment" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of pathology tests to help diagnose and monitor various health conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Microscope className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hematology</h3>
              <p className="text-gray-600">
                Complete blood count, blood smear examination, coagulation studies, and more.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Flask className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Clinical Chemistry</h3>
              <p className="text-gray-600">
                Liver function tests, kidney function tests, lipid profile, glucose tests, and more.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Activity className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Immunology</h3>
              <p className="text-gray-600">
                Allergy testing, autoimmune disease testing, immunoglobulin testing, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Saanvi Pathology Lab</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to providing the highest quality pathology services with accuracy and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Accredited Lab</h3>
              <p className="text-gray-600 text-sm">
                Nationally recognized for meeting the highest standards of quality and accuracy.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Team</h3>
              <p className="text-gray-600 text-sm">
                Experienced pathologists and technicians with specialized training.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Results</h3>
              <p className="text-gray-600 text-sm">
                Fast turnaround times with online access to your test results.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Technology</h3>
              <p className="text-gray-600 text-sm">
                State-of-the-art equipment for accurate and reliable test results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a pathology test?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Visit our lab or schedule a home collection. We're here to provide you with accurate and timely diagnostic services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleBookTest}
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Book a Test
            </button>
            <button className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Book Test Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Book a Test</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                To book a test or schedule a home collection, please contact us at:
              </p>
              <div className="flex items-center space-x-2 text-blue-600">
                <Phone className="h-5 w-5" />
                <a href="tel:+919639739255" className="font-medium">+91 9639739255</a>
                <span className="text-gray-400">(Primary)</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Phone className="h-5 w-5" />
                <a href="tel:+918630897049" className="font-medium">+91 8630897049</a>
                <span className="text-gray-400">(Secondary)</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Our team will assist you with test selection, pricing, and scheduling.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;