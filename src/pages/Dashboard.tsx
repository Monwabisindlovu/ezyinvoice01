import React, { useState } from 'react';

import InvoiceForm from '../components/Invoice/InvoiceForm';
import NewInvoiceTemplate from '../components/Invoice01/NewInvoiceTemplate';

const Dashboard: React.FC = () => {
    // State to track the selected template
    const [selectedTemplate, setSelectedTemplate] = useState<'template01' | 'template02'>('template01');

    return (
        <div className="p-6 space-y-4">
            {/* Template Selector Links */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setSelectedTemplate('template01')}
                    className={`${
                        selectedTemplate === 'template01' ? 'text-blue-500' : 'text-gray-500'
                    } hover:underline`}
                >
                    Template 01
                </button>
                <button
                    onClick={() => setSelectedTemplate('template02')}
                    className={`${
                        selectedTemplate === 'template02' ? 'text-blue-500' : 'text-gray-500'
                    } hover:underline`}
                >
                    Template 02
                </button>
            </div>

            {/* Render the selected template */}
            {selectedTemplate === 'template01' ? <InvoiceForm /> : null}
            {selectedTemplate === 'template02' ? <NewInvoiceTemplate /> : null}
        </div>
    );
};

export default Dashboard;
