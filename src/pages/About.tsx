import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-gray-800">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-600">About EzyInvoice01</h1>

      <p className="text-lg mb-6 text-center">
        <strong>Your All-in-One Solution for Effortless Invoice Management</strong>  
      </p>

      <p className="text-lg mb-6">
        <strong>EzyInvoice01</strong> was built with one goal in mind: to simplify invoicing for businesses of all sizes.  
        Whether you&apos;re a freelancer, a small business owner, or a growing enterprise, our platform provides  
        a seamless way to create, manage, and track invoices efficiently.
      </p>

      <p className="text-lg mb-6">
        This project was founded and developed by <span className="font-bold">Monwabisi Ndlovu</span>, a passionate software developer  
        dedicated to building user-friendly tools that empower businesses to succeed.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-500">Special Acknowledgment</h2>
      <p className="text-lg mb-6">
        A heartfelt thank you to <span className="font-bold">David Sampson</span> for his incredible support, guidance, and encouragement throughout this journey.  
        Your contributions have been invaluable in shaping EzyInvoice01 into what it is today.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-500">Why Choose EzyInvoice01?</h2>
      <ul className="list-disc list-inside text-lg mb-6">
        <li><span className="font-bold">Fast & Intuitive:</span> Create invoices in seconds with an easy-to-use interface.</li>
        <li><span className="font-bold">Secure & Reliable:</span> Your data is safely stored and always accessible.</li>
        <li><span className="font-bold">Customizable:</span> Add your logo, business details, and personalize your invoices.</li>
        <li><span className="font-bold">Real-Time Tracking:</span> Stay on top of payments and outstanding balances effortlessly.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-500">Get in Touch</h2>
      <p className="text-lg">
        Thank you for visiting! If you have any questions, feedback, or just want to say hello,  
        feel free to connect with us through our social media channels below.
      </p>
    </div>
  );
};

export default About;
