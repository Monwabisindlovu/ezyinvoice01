import React, { ChangeEvent } from 'react';
import InputField from './InputField';

interface ItemData {
    qty: string;
    description: string;
    unitPrice: string;
    amount: string;
    taxName: string;
    taxPercentage: string;
    showTax: boolean;
}

interface InvoiceItemsProps {
    items: ItemData[];
    onItemChange: (
        index: number,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onOpenTaxModal: (index: number) => void;
    onRemoveItem: (index: number) => void;
    onAddNewItem: () => void;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
    items,
    onItemChange,
    onOpenTaxModal,
    onRemoveItem,
    onAddNewItem,
}) => {
    return (
        <div>
            {items.map((item, index) => (
                <div key={index} className="flex flex-row items-center space-x-2 mb-4">
                    <div className="flex-1">
                        <div className="flex flex-row items-center space-x-2">
                            <InputField
                                label="Description"
                                name="description"
                                value={item.description}
                                onChange={(e) => onItemChange(index, e)}
                                rows={2}
                                className="flex-2"
                                style={{ resize: 'vertical' }}
                            />
                            <InputField
                                label="Qty"
                                name="qty"
                                value={item.qty}
                                onChange={(e) => onItemChange(index, e)}
                                className="flex-1"
                            />
                            <InputField
                                label="Unit Price"
                                name="unitPrice"
                                value={item.unitPrice}
                                onChange={(e) => onItemChange(index, e)}
                                className="flex-1"
                            />
                            <InputField
                                label="Amount"
                                name="amount"
                                value={item.amount}
                                onChange={(e) => onItemChange(index, e)}
                                className="flex-1"
                            />
                            <div className="flex-none">
                                <button
                                    type="button"
                                    onClick={() => onOpenTaxModal(index)}
                                    className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
                                >
                                    {item.taxName ? `${item.taxName} ${item.taxPercentage}%` : 'Add Tax'}
                                </button>
                            </div>
                            <div className="flex-none">
                                <button
                                    type="button"
                                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                    title="Remove Item"
                                    onClick={() => onRemoveItem(index)}
                                >
                                    <span className="text-xl">×</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add New Item Button */}
            <div className="flex flex-col space-y-4 flex-1">
                <button
                    onClick={onAddNewItem}
                    className="py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 w-full"
                >
                    Add New Item
                </button>
            </div>
        </div>
    );
};

export default InvoiceItems;
