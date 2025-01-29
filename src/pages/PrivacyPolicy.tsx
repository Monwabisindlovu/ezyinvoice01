import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-lg mb-4">
        EzyInvoice01 is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.
      </p>
      <h2 className="text-2xl font-bold mb-2">Information We Collect</h2>
      <p className="text-lg mb-4">
        When you register on our platform, we collect the following information:
      </p>
      <ul className="list-disc list-inside mb-4 text-lg">
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Country</li>
        <li>Google Account Information (if you register via Google)</li>
      </ul>
      <h2 className="text-2xl font-bold mb-2">How We Use Your Information</h2>
      <p className="text-lg mb-4">
        The information we collect is used to:
      </p>
      <ul className="list-disc list-inside mb-4 text-lg">
        <li>Create and manage your account</li>
        <li>Provide access to our invoice generator services</li>
        <li>Communicate with you regarding your account or our services</li>
        <li>Improve our platform and user experience</li>
        <li>Ensure compliance with legal requirements</li>
      </ul>
      <h2 className="text-2xl font-bold mb-2">Data Protection</h2>
      <p className="text-lg mb-4">
        Your personal data is securely stored and protected against unauthorized access, alteration, disclosure, or destruction. We implement industry-standard security measures to safeguard your information.
      </p>
      <h2 className="text-2xl font-bold mb-2">Sharing Your Information</h2>
      <p className="text-lg mb-4">
        We do not share your personal information with third parties except in the following circumstances:
      </p>
      <ul className="list-disc list-inside mb-4 text-lg">
        <li>To comply with legal obligations</li>
        <li>To protect and defend our rights or property</li>
        <li>With your explicit consent</li>
      </ul>
      <h2 className="text-2xl font-bold mb-2">Your Rights</h2>
      <p className="text-lg mb-4">
        You have the right to access, update, or delete your personal information at any time. If you wish to exercise these rights, please contact us.
      </p>
      <h2 className="text-2xl font-bold mb-2">Changes to This Policy</h2>
      <p className="text-lg mb-4">
        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We encourage you to review this page periodically.
      </p>
      <p className="text-lg">
        If you have any questions about our Privacy Policy, please contact us.
      </p>
    </div>
  );
};

export default PrivacyPolicy;