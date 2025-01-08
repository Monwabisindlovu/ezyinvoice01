import React, { ChangeEvent } from 'react';
import ImageUploader from './ImageUploader';
import InputField from 'components/Invoice/InputField';

interface TermsAndConditionsWithSignatureProps {
    termsConditions: string;
    onTermsConditionsChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    signature: string | null;
    onSignatureChange: (file: File | null) => void;
}

const TermsAndConditionsWithSignature: React.FC<TermsAndConditionsWithSignatureProps> = ({
    termsConditions,
    onTermsConditionsChange,
    signature,
    onSignatureChange,
}) => {
    return (
        <div className="flex flex-row justify-between mt-4">
            {/* Terms and Conditions Section */}
            <div className="terms flex-1 mr-2">
                <label className="block text-sm font-semibold mb-1">Terms and Conditions</label>
                <textarea
                    value={termsConditions}
                    onChange={onTermsConditionsChange}
                    placeholder="Terms and Conditions (optional)"
                    className="border rounded-md p-0.5 w-full text-xs resize-none"
                    style={{ 
                        maxWidth: 'calc(100% - 10px)',  // Almost touch the signature section
                        width: 'calc(100% - 10px)',      // Increase width to touch the signature section
                        height: 'calc(1.25rem * 3 + 20px)', // Make it 2 lines smaller than Notes field
                    }}
                />
            </div>
            {/* Signature Section */}
            <div className="signature flex-1 ml-2">
                <label className="block text-sm font-semibold mb-1">Signature</label>
                <ImageUploader
                    image={signature}
                    onChange={onSignatureChange}
                    className="mt-1"
                    style={{ maxWidth: '270px', width: '100%' }} 
                    label={''} 
                />
            </div>
        </div>
    );
};

export default TermsAndConditionsWithSignature;
