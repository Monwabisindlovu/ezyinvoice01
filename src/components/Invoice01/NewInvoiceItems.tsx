import React from 'react';
import currencySymbolMap from 'currency-symbol-map';

interface ItemData {
    item: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface Currency {
    symbol: string;
    code: string;
}

interface NewInvoiceItemsProps {
    items: ItemData[];
    currency: Currency;
    onItemChange: (index: number, field: keyof ItemData, value: string | number) => void;
    onRemoveItem: (index: number) => void;
    onAddNewItem: () => void;
}

const NewInvoiceItems: React.FC<NewInvoiceItemsProps> = ({
    items,
    currency,
    onItemChange,
    onRemoveItem,
    onAddNewItem
}) => {
    const currencySymbol = currency.symbol || currencySymbolMap(currency.code) || currency.code;

    return (
        <div className="mb-1">
            <table className="min-w-full border mb-1 text-xs">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="border px-1 py-0.5 w-1/2 text-left">Item</th>
                        <th className="border px-1 py-0.5 w-1/6 text-left">Quantity</th>
                        <th className="border px-1 py-0.5 w-1/6 text-left">Rate</th>
                        <th className="border px-1 py-0.5 w-1/6 text-center">Amount</th>
                        <th className="border px-1 py-0.5 w-1/6 text-center"></th>
                    </tr>
                </thead>
                <tbody className="bg-lime-100">
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-1 py-0.5">
                                <textarea
                                    placeholder="Item Description/Services..."
                                    value={item.description}
                                    onChange={(e) => onItemChange(index, 'description', e.target.value)}
                                    className="border rounded-md p-0.5 w-full text-xs mb-2 placeholder:font-bold"
                                    style={{ height: '40px' }}
                                />
                            </td>
                            <td className="border px-1 py-0.5">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => onItemChange(index, 'quantity', parseFloat(e.target.value))}
                                    className="border rounded-md p-0.5 w-full text-xs"
                                    style={{ height: '34px' }}
                                />
                            </td>
                            <td className="border px-1 py-0.5 relative">
                                <input
                                    type="number"
                                    placeholder="Rate"
                                    value={item.rate}
                                    onChange={(e) => onItemChange(index, 'rate', parseFloat(e.target.value))}
                                    className="border rounded-md p-0.5 w-full text-xs pl-6"
                                    style={{ height: '34px' }}
                                />
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs">
                                    {currencySymbol}
                                </span>
                            </td>
                            <td className="border px-1 py-0.5 text-right">
                                <div className="flex flex-col items-center">
                                    <span>
                                        {currencySymbol}
                                        {(item.amount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </td>
                            <td className="border px-1 py-0.5 text-center">
                                <button
                                    type="button"
                                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                    title="Remove Item"
                                    onClick={() => onRemoveItem(index)}
                                >
                                    <span className="text-xl">×</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={onAddNewItem}
                className="bg-gray-800 text-white px-2 py-0.5 rounded-md text-xs"
            >
                Add Item
            </button>
        </div>
    );
};

export default NewInvoiceItems;
