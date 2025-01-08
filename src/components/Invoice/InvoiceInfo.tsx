import React, { ChangeEvent } from 'react';
import InputField from './InputField';

interface InvoiceInfoProps {
    invoiceNumber: string;
    invoiceDate: string;
    poNumber: string;
    dueDate: string;
    onInvoiceNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onInvoiceDateChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onPoNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDueDateChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({
                                                     invoiceNumber,
                                                     invoiceDate,
                                                     poNumber,
                                                     dueDate,
                                                     onInvoiceNumberChange,
                                                     onInvoiceDateChange,
                                                     onPoNumberChange,
                                                     onDueDateChange,
                                                 }) => {
    return (
        <div>
            <InputField
                label="Invoice #"
                name="invoiceNumber"
                value={invoiceNumber}
                onChange={onInvoiceNumberChange}
            />
            <InputField
                label="Invoice Date"
                name="invoiceDate"
                value={invoiceDate}
                onChange={onInvoiceDateChange}
                type="date"
            />
            <InputField
                label="PO #"
                name="poNumber"
                value={poNumber}
                onChange={onPoNumberChange}
                placeholder="(Optional)"
            />
            <InputField
                label="Due Date"
                name="dueDate" // Ensure 'name' is consistent and matches the parent state key
                value={dueDate}
                onChange={onDueDateChange} // Ensure this handler correctly updates the state
                type="date"
            />
        </div>
    );
};

export default InvoiceInfo;
