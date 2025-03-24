import React, { useState, useEffect } from 'react';

interface TotalsSectionProps {
    items: { quantity: number; rate: number; amount: number }[];
    currencySymbol: string;
    subtotal: number;
    vat: number;
    total: number;
    amountPaid: number;
    onDiscountChange: (discountPercent: string) => void;
    onShippingChange: (shipping: string) => void;
    onTaxChange: (taxName: string, taxPercent: string) => void;
    taxList: { name: string; percent: number; amount: number }[];
    onRemoveTax: (index: number) => void;
}

const TotalsSection: React.FC<TotalsSectionProps> = ({
    items,
    currencySymbol,
    subtotal,
    vat,
    total,
    amountPaid,
    onDiscountChange,
    onShippingChange,
    onTaxChange,
    taxList,
    onRemoveTax
}) => {
    const [discountPercent, setDiscountPercent] = useState('');
    const [shipping, setShipping] = useState('');
    const [amountPaidInput, setAmountPaidInput] = useState(amountPaid);

    const [taxName, setTaxName] = useState('');
    const [taxPercent, setTaxPercent] = useState('');
    const [activeInput, setActiveInput] = useState<string | null>(null);

    useEffect(() => {
        // Update parent component with discount and shipping
        onDiscountChange(discountPercent);
        onShippingChange(shipping);
    }, [discountPercent, shipping, onDiscountChange, onShippingChange]);

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + item.amount, 0).toFixed(2);
    };

    const calculateTotal = () => {
        const subtotalAmount = parseFloat(calculateSubtotal());
        const totalTax = taxList.reduce((acc, taxItem) => acc + taxItem.amount, 0);
        const totalDiscount = (parseFloat(discountPercent) || 0) * subtotalAmount / 100;
        const totalShipping = parseFloat(shipping) || 0;
        const totalAmount = subtotalAmount + totalTax - totalDiscount + totalShipping;
        return totalAmount.toFixed(2);
    };

    const handleAddTax = () => {
        const parsedTaxPercent = parseFloat(taxPercent);
        if (taxName && !isNaN(parsedTaxPercent)) {
            onTaxChange(taxName, taxPercent);
            setTaxName('');
            setTaxPercent('');
            setActiveInput(null);
        }
    };

    // Handle adding shipping
    const handleAddShipping = () => {
        const shippingAmount = parseFloat(shipping);
        if (!isNaN(shippingAmount) && shippingAmount >= 0) {
            setShipping(shippingAmount.toString());
            setActiveInput(null);
        }
    };

    // Handle adding discount
    const handleAddDiscount = () => {
        const discountAmount = parseFloat(discountPercent);
        if (!isNaN(discountAmount) && discountAmount >= 0 && discountAmount <= 100) {
            setDiscountPercent(discountPercent);
            setActiveInput(null);
        }
    };

    // Handle removing discount
    const handleRemoveDiscount = () => {
        setDiscountPercent('');
    };

    // Handle removing shipping
    const handleRemoveShipping = () => {
        setShipping('');
    };

    return (
        <div className="mt-4 border rounded-md p-2">
            {/* Subtotal Section */}
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs">Subtotal</span>
                <span className="text-xs">{currencySymbol}{parseFloat(calculateSubtotal()).toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-start space-x-4 mb-2">
                {!activeInput && taxList.length === 0 && (
                    <button
                        onClick={() => setActiveInput('tax')}
                        className="bg-green-500 text-white rounded-full p-0.5 text-xs"
                    >
                        + Tax
                    </button>
                )}
                {!activeInput && !discountPercent && (
                    <button
                        onClick={() => setActiveInput('discount')}
                        className="bg-green-500 text-white rounded-full p-0.5 text-xs"
                    >
                        + Discount
                    </button>
                )}
                {!activeInput && !shipping && (
                    <button
                        onClick={() => setActiveInput('shipping')}
                        className="bg-green-500 text-white rounded-full p-0.5 text-xs"
                    >
                        + Shipping
                    </button>
                )}
            </div>

            {/* Inputs Section */}
            {activeInput === 'discount' && (
                <div className="flex items-center mb-2 relative group">
                    <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        placeholder="Discount %"
                        className="border rounded-md p-0.5 w-16 text-xs"
                    />
                    <button
                        onClick={handleAddDiscount}
                        className="bg-blue-500 text-white rounded-md p-0.5 text-xs ml-2"
                    >
                        +
                    </button>
                    <button
                        onClick={() => setActiveInput(null)}
                        className="absolute right-0 bg-red-500 text-white rounded-md p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>
                </div>
            )}

            {activeInput === 'tax' && (
                <div className="flex items-center mb-2 relative group">
                    <input
                        type="text"
                        value={taxName}
                        onChange={(e) => setTaxName(e.target.value)}
                        placeholder="Tax Name"
                        className="border rounded-md p-0.5 w-20 text-xs"
                    />
                    <input
                        type="number"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(e.target.value)}
                        placeholder="%"
                        className="border rounded-md p-0.5 w-12 text-xs ml-2"
                    />
                    <button
                        onClick={handleAddTax}
                        className="bg-blue-500 text-white rounded-md p-0.5 text-xs ml-2"
                    >
                        +
                    </button>
                    <button
                        onClick={() => setActiveInput(null)}
                        className="absolute right-0 bg-red-500 text-white rounded-md p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>
                </div>
            )}

            {activeInput === 'shipping' && (
                <div className="flex items-center mb-2 relative group">
                    <input
                        type="number"
                        value={shipping}
                        onChange={(e) => setShipping(e.target.value)}
                        placeholder="Shipping Amount"
                        className="border rounded-md p-0.5 w-16 text-xs"
                    />
                    <button
                        onClick={handleAddShipping}
                        className="bg-blue-500 text-white rounded-md p-0.5 text-xs ml-2"
                    >
                        +
                    </button>
                    <button
                        onClick={() => setActiveInput(null)}
                        className="absolute right-0 bg-red-500 text-white rounded-md p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* Tax List Display */}
            {taxList.map((taxItem, index) => (
                <div key={index} className="flex items-center justify-between mb-1 relative group">
                    <span className="text-xs">{taxItem.name} ({taxItem.percent}%)</span>
                    <span className="text-xs">{currencySymbol}{(parseFloat(calculateSubtotal()) * taxItem.percent / 100).toFixed(2)}</span>
                    <button
                        onClick={() => onRemoveTax(index)}
                        className="absolute right-0 bg-red-500 text-white rounded-md p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>
                </div>
            ))}

            {/* Discount Amount Display */}
            {discountPercent && (
                <div className="flex items-center justify-between mb-1 relative group">
                    <span className="text-xs">Discount {discountPercent}%</span>
                    <span className="text-xs">-{currencySymbol}{(parseFloat(discountPercent) * parseFloat(calculateSubtotal()) / 100).toFixed(2)}</span>
                    <button
                        onClick={handleRemoveDiscount}
                        className="absolute right-0 bg-red-500 text-white rounded-md p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* Shipping Amount Display */}
            {shipping && (
                <div className="flex items-center justify-between mb-1 relative group">
                    <span className="text-xs">Shipping</span>
                    <span className="text-xs">{currencySymbol}{parseFloat(shipping).toFixed(2)}</span>
                    <button
                        onClick={handleRemoveShipping}
                        className="absolute right-0 bg-red-500 text-white rounded-md p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* Total Section */}
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Total</span>
                <span className="text-xs">{currencySymbol}{calculateTotal()}</span>
            </div>

            {/* Amount Paid Display - Matches Subtotal, Total, and Due Balance */}
<div className="flex items-center justify-between mb-1">
    <span className="text-xs font-bold">Amount Paid</span>
    <span className="text-xs">{currencySymbol}{amountPaidInput.toFixed(2)}</span>
</div>

{/* Editable Input Field (Optional) - Place it separately if needed */}
<input
    type="number"
    value={amountPaidInput}
    onChange={(e) => setAmountPaidInput(parseFloat(e.target.value))}
    placeholder="Enter Amount Paid"
    className="border rounded-md p-0.5 w-full text-xs mt-2"
/>
            {/* Due Balance */}
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Due Balance</span>
                <span className="text-xs">{currencySymbol}{(parseFloat(calculateTotal()) - amountPaidInput).toFixed(2)}</span>
            </div>
        </div>
    );
};

export default TotalsSection;