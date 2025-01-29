import React from 'react';
import { FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 shadow-lg text-gray-300 py-6">
  <div className="flex flex-col items-center space-y-4">
    <div className="flex justify-center space-x-4">
      <a href="https://github.com/Monwabisindlovu" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
        <FaYoutube size={24} />
      </a>
      <a href="https://twitter.com/MDRyan43203488" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
        <FaTwitter size={24} />
      </a>
      <a href="https://www.linkedin.com/in/monwabisi-ndlovu-3270a020b" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
        <FaLinkedin size={24} />
      </a>
    </div>
    <p className="text-sm">&copy; {new Date().getFullYear()} EzyInvoice01. All rights reserved.</p>
        <div className="flex space-x-6 text-sm">
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/privacy-policy" className="hover:underline">PrivacyPolicy</Link>
         <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        </div>
    <form className="flex space-x-2 mt-4">
      <input 
        type="email" 
        placeholder="Enter your email" 
        className="px-2 py-1 rounded-md text-gray-700 focus:outline-none"
      />
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
      >
        Subscribe
      </button>
    </form>
    <p className="text-sm mt-4">
      Designed & Developed by <a href="https://github.com/Monwabisindlovu" className="text-blue-500 hover:underline">Monwabisi Ndlovu</a>
    </p>
    <a href="#top" className="text-sm text-blue-500 hover:underline mt-4">
      Back to Top
    </a>
  </div>
</footer>
  );
};

export default Footer;
