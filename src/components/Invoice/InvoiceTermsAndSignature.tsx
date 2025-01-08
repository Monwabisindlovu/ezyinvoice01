import React, { ChangeEvent } from 'react';
import InputField from './InputField';
import ImageUploader from './ImageUploader';

interface InvoiceTermsAndSignatureProps {
    termsConditions: string;
    onTermsConditionsChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    signature: string | null;
    onSignatureChange: (file: File | null) => void;
}

const InvoiceTermsAndSignature: React.FC<InvoiceTermsAndSignatureProps> = ({
                                                                               termsConditions,
                                                                               onTermsConditionsChange,
                                                                               signature,
                                                                               onSignatureChange,
                                                                           }) => {
    return (
        <div className="flex flex-row justify-between mt-4">
            <div className="terms flex-1 mr-4">
                <InputField
                    label="Terms and Conditions"
                    name="termsConditions"
                    value={termsConditions}
                    onChange={onTermsConditionsChange}
                    placeholder="Terms and conditions"
                    rows={3}
                    type="textarea"
                    style={{ maxWidth: '570px' }}
                />
            </div>
            {/* Signature Section */}
            <div className="signature flex-2">
                <ImageUploader
                    label="Signature"
                    image={signature}
                    onChange={onSignatureChange}
                    className="mt-1"
                    style={{ maxWidth: '270px' }}
                />
            </div>
        </div>
    );
};

export default InvoiceTermsAndSignature;