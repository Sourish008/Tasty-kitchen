import { Link } from 'react-router-dom';
import { UtensilsCrossed, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#121212] text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-heading font-bold text-xl mb-4">
              <UtensilsCrossed className="text-primary-500" size={24} />
              <span>Rumela's Kitchen</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Experience the best culinary delights prepared with passion and the finest ingredients since 2025.
            </p>
            <div className="flex gap-4 text-gray-400">
              <span>Follow us on social media!</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/menu" className="hover:text-primary-500 text-gray-400 transition-colors">Our Menu</Link></li>
              <li><Link to="/special" className="hover:text-primary-500 text-gray-400 transition-colors">Today's Specials</Link></li>
              <li><Link to="/reviews" className="hover:text-primary-500 text-gray-400 transition-colors">Customer Reviews</Link></li>
              <li><Link to="/account" className="hover:text-primary-500 text-gray-400 transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-3">
                <MapPin size={18} className="text-primary-500 shrink-0" />
                <span>123 Culinary Boulevard,<br/>Food District, FD 10001</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={18} className="text-primary-500 shrink-0" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={18} className="text-primary-500 shrink-0" />
                <span>hello@tastykitchen.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Opening Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Mon - Fri</span>
                <span className="text-white">10:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Saturday</span>
                <span className="text-white">09:00 AM - 11:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Sunday</span>
                <span className="text-primary-500 font-medium">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 text-center md:flex justify-between items-center">
          <p>© {new Date().getFullYear()} Rumela's Kitchen. All rights reserved.</p>
          <div className="gap-6 mt-4 md:mt-0 flex justify-center">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
