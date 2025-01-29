import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">About EzyInvoice01</h1>
      <p className="text-lg mb-4">
        EzyInvoice01 is a powerful yet simple tool built to help you manage invoices effortlessly. 
        This project was designed and developed by <span className="font-bold">Monwabisi Ndlovu</span> with a passion for empowering businesses.
      </p>
      <p className="text-lg mb-4">
        I would like to take this opportunity to thank <span className="font-bold">David Sampson</span> for his incredible support throughout the journey. 
        Your encouragement and guidance have been invaluable.
      </p>
      <p className="text-lg">
        Thank you for visiting this website! If you have any questions, feel free to reach out through the social media links below.
      </p>
    </div>
  );
};

export default About;
