import React from 'react';
import { FaYoutube, FaInstagram, FaFacebookF, FaGithub, FaPhoneAlt, FaEnvelope, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand & About */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">apnaAccessories</h2>
            <p className="text-gray-400 mb-4">
              Your Style. Your Way. The best destination for trendy and affordable accessories.
            </p>
<h2 className="text-2xl font-bold text-white mb-3">Developer Accounts</h2> 
            <div className="flex space-x-4 text-xl">
              
              <a href="https://github.com/Praveen-kumar1Singh" target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:text-pink-400 transition">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/praveenkumarsingh39" target="_blank" rel="noopener noreferrer" title="GitHub" className="hover:text-gray-300 transition">
                <FaLinkedin/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="https://personalportfolio-praveen-kumar-singhs-projects-b7187ba0.vercel.app/" target="_blank" className="hover:text-white transition">About Us</a></li>
              <li><a href="/" className="hover:text-white transition">Shop</a></li>
              {/* <li><a href="#" className="hover:text-white transition">About Us</a></li> */}
              {/* <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li> */}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <p className="flex items-center gap-2 mb-2 text-gray-400">
              <FaPhoneAlt /> <span>+1 (555) 123-4567</span>
            </p>
            <p className="flex items-center gap-2 mb-4 text-gray-400">
              <FaEnvelope /> <span>support@apnaaccessories.com</span>
            </p>

            {/* <h3 className="text-xl font-semibold text-white mb-3">Subscribe to Newsletter</h3>
            {/* <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 rounded-l bg-slate-700 border border-gray-600 text-gray-300 focus:outline-none"
              /> */}
              {/* <button
                type="submit"
                className="px-4 bg-red-600 hover:bg-red-700 rounded-r text-white font-semibold transition"
              >
                Subscribe
              </button> */}
            {/* </form> */} 
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} apnaAccessories. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
   