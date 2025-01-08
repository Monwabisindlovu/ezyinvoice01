import React, { ChangeEvent } from 'react';
import InputField from './InputField';
import ImageUploader from './ImageUploader';

interface InvoiceHeaderProps {
    from: string;
    onFromChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    logo: string | null;
    onLogoChange: (file: File | null) => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
                                                         from,
                                                         onFromChange,
                                                         logo,
                                                         onLogoChange,
                                                     }) => {
    return (
        <div className="flex flex-row space-x-4">
            <div className="flex-1 mr-4">
                {/* From Section */}
                <InputField
                    label="From"
                    name="from"
                    value={from}
                    onChange={onFromChange}
                    placeholder="Your company name or address"
                    rows={4}
                    type="textarea"
                    style={{ maxWidth: '520px' }}
                />
            </div>

            {/* Logo Section */}
            <div className="flex-none" style={{ maxWidth: '250px' }}>
                <ImageUploader
                    label="Logo"
                    image={logo}
                    onChange={onLogoChange}
                    className="mb-4"
                />
            </div>
        </div>
    );
};

export default InvoiceHeader;