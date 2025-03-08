import React from 'react';
import { Activity, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-blue-300" />
              <span className="ml-2 text-xl font-bold">Saanvi Pathology Lab</span>
            </div>
            <p className="text-blue-200 text-sm">
              Providing accurate and reliable pathology services for over 15 years.
              Your health is our priority.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Services</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Test Reports</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-blue-200 text-sm">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Seohara-Noorpur Road, Budhanpur(Bijnor)</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>Primary: +91 9639739255</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>Secondary: +91 8630897049</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@saanvipathlab.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Saanvi Pathology Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;