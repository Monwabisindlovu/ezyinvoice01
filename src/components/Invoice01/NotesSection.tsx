import React, { Dispatch, SetStateAction } from 'react';

interface NotesSectionProps {
  notesHeader: string;
  notesContent: { 
    accountName: string; 
    bankName: string; 
    branchCode: string; 
    accountNumber: string; 
  }; // Expecting an object with specific fields
  termsContent: string;
  onNotesHeaderChange: Dispatch<SetStateAction<string>>;
  onNotesContentChange: Dispatch<SetStateAction<{
    accountName: string;
    bankName: string;
    branchCode: string;
    accountNumber: string;
  }>>; // Accepting an object with the fields as value
  onTermsContentChange: Dispatch<SetStateAction<string>>;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notesHeader,
  notesContent,
  termsContent,
  onNotesHeaderChange,
  onNotesContentChange,
  onTermsContentChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Banking Details Outer Container */}
      <div className="border rounded-md p-4 h-auto">
        {/* Header for Banking Details */}
        <input
          type="text"
          value={notesHeader || 'Banking Details'}
          onChange={(e) => onNotesHeaderChange(e.target.value)}
          className="border rounded-md p-0.5 w-full text-xs mb-2 font-bold"
          placeholder="Banking Details"
        />

        {/* Account Name */}
        <div className="mb-2 flex items-center">
          <label className="text-xs mr-2 w-36">Account Name:</label>
          <input
            type="text"
            value={notesContent.accountName}
            onChange={(e) => onNotesContentChange({ ...notesContent, accountName: e.target.value })}
            className="border rounded-md p-0.5 w-full text-xs"
            placeholder="Sparks and Clicks Electrical Services"
          />
        </div>

        {/* Bank Name */}
        <div className="mb-2 flex items-center">
          <label className="text-xs mr-2 w-36">Bank Name:</label>
          <input
            type="text"
            value={notesContent.bankName}
            onChange={(e) => onNotesContentChange({ ...notesContent, bankName: e.target.value })}
            className="border rounded-md p-0.5 w-full text-xs"
            placeholder="First National Bank"
          />
        </div>

        {/* Branch Code */}
        <div className="mb-2 flex items-center">
          <label className="text-xs mr-2 w-36">Branch Code:</label>
          <input
            type="text"
            value={notesContent.branchCode}
            onChange={(e) => onNotesContentChange({ ...notesContent, branchCode: e.target.value })}
            className="border rounded-md p-0.5 w-full text-xs"
            placeholder="211113"
          />
        </div>

        {/* Account Number */}
        <div className="mb-2 flex items-center">
          <label className="text-xs mr-2 w-36">Account Number:</label>
          <input
            type="text"
            value={notesContent.accountNumber}
            onChange={(e) => onNotesContentChange({ ...notesContent, accountNumber: e.target.value })}
            className="border rounded-md p-0.5 w-full text-xs"
            placeholder="22222557688"
          />
        </div>
      </div>

      {/* Space between Banking and Terms */}
      <div className="mb-4"></div> {/* Add space */}

      {/* Terms and Conditions Header */}
      <div className="font-bold text-xs mb-2">Terms and Conditions</div>

      {/* Terms and Conditions Content */}
      <textarea
        value={termsContent}
        onChange={(e) => onTermsContentChange(e.target.value)}
        placeholder="Terms and Conditions (optional)..."
        className="border rounded-md p-0.5 w-full text-xs resize-none"
        style={{ maxWidth: '570px', height: 'calc(1.25rem * 4 + 18px)' }} // 4 visible lines and max width of 570px
      />
    </div>
  );
};

export default NotesSection;
