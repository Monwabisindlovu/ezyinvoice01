import React, { ChangeEvent } from 'react';

interface TaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taxName: string, taxPercentage: string) => void;
}

const TaxModal: React.FC<TaxModalProps> = ({ isOpen, onClose, onSave }) => {
  const [taxName, setTaxName] = React.useState('');
  const [taxPercentage, setTaxPercentage] = React.useState('');

  const handleSave = () => {
    // Ensure tax percentage is an integer
    const roundedTaxPercentage = Math.round(parseFloat(taxPercentage)).toString();
    onSave(taxName, roundedTaxPercentage);
    onClose();
  };

  const handleTaxPercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numeric input and handle invalid inputs gracefully
    if (/^\d*\.?\d*$/.test(value)) {
      setTaxPercentage(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Tax Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tax Name</label>
          <input
            type="text"
            value={taxName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTaxName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tax %</label>
          <input
            type="text"
            value={taxPercentage}
            onChange={handleTaxPercentageChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxModal;
