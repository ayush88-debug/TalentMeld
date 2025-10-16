import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900 w-full">
      <div className="container mx-auto py-6 px-4 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} TalentMeld. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;