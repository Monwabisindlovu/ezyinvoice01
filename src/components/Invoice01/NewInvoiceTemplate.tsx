import React, { useState, useEffect } from 'react';
import NewInvoiceItems from './NewInvoiceItems';
import ImageUploader from './ImageUploader';
import NotesSection from './NotesSection';
import TotalsSection from './TotalsSection';
import CurrencySelector from './CurrencySelector';
import { CURRENCIES, Currency, formatCurrency } from '../../utils/currency';
import NewInvoiceDocument from './NewInvoiceDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

const NewInvoiceTemplate: React.FC = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [poNumber, setPoNumber] = useState('');
    const [from, setFrom] = useState('');
    const [billToHeader, setBillToHeader] = useState('Bill To');
    const [billTo, setBillTo] = useState('');
    const [shipToHeader, setShipToHeader] = useState('Ship To');
    const [shipTo, setShipTo] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [items, setItems] = useState([{ item: '', description: '', quantity: 0, rate: 0, amount: 0 }]);
    const [logo, setLogo] = useState<File | null>(null);
    const [notesHeader, setNotesHeader] = useState('Bank Details');
    const [notesContent, setNotesContent] = useState({
        accountName: '',
        bankName: '',
        branchCode: '',
        accountNumber: ''
    });
    const [termsContent, setTermsContent] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [signature, setSignature] = useState<File | null>(null);
    const [currency, setCurrency] = useState<Currency>({ name: 'USD', code: 'USD', symbol: '$' });
    const [discountPercent, setDiscountPercent] = useState('');
    const [shipping, setShipping] = useState('');
    const [taxList, setTaxList] = useState<{ name: string; percent: number; amount: number }[]>([]);

    // Currency change handler
    const handleCurrencyChange = (currency: Currency) => {
        setCurrency(currency);
        setCurrencySymbol(currency.symbol);
    };

    // Item change handler
    const handleItemChange = (index: number, field: 'item' | 'description' | 'quantity' | 'rate' | 'amount', value: string | number) => {
        const newItems = [...items];
        (newItems[index][field] as typeof value) = value;

        if (field === 'quantity' || field === 'rate') {
            const quantity = typeof newItems[index].quantity === 'number' ? newItems[index].quantity : 0;
            const rate = typeof newItems[index].rate === 'number' ? newItems[index].rate : 0;
            newItems[index].amount = quantity * rate;
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { item: '', description: '', quantity: 0, rate: 0, amount: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // Handlers for discount, shipping, and tax
    const handleDiscountChange = (discountPercent: string) => {
        setDiscountPercent(discountPercent);
    };

    const handleShippingChange = (shipping: string) => {
        setShipping(shipping);
    };

    const handleTaxChange = (taxName: string, taxPercent: string) => {
        const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
        const taxAmount = (subtotal * parseFloat(taxPercent)) / 100;
        setTaxList([...taxList, { name: taxName, percent: parseFloat(taxPercent), amount: taxAmount }]);
    };

    const handleRemoveTax = (index: number) => {
        setTaxList(taxList.filter((_, i) => i !== index));
    };

    const handleLogoChange = (file: File | null) => {
        setLogo(file);
    };

    const handleSignatureChange = (file: File | null) => {
        setSignature(file);
    };

    // Calculate subtotal and VAT in the parent component
    const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const totalTaxAmount = taxList.reduce((acc, tax) => acc + tax.amount, 0);
    const totalDiscountAmount = (parseFloat(discountPercent) / 100) * subtotal || 0; // Default to 0
    const totalShippingAmount = parseFloat(shipping) || 0; // Default to 0

    // Calculate the total
    const totalAmounts = {
        subtotal,
        shipping: totalShippingAmount,
        discount: totalDiscountAmount,
        taxes: totalTaxAmount,
    };

    const total = totalAmounts.subtotal + totalAmounts.shipping - totalAmounts.discount + totalAmounts.taxes;

    const invoiceData = {
        from,
        billTo,
        shipTo: shipTo || '',
        invoiceNumber,
        invoiceDate,
        dueDate,
        poNumber,
        logo: logo ? URL.createObjectURL(logo) : undefined,
        items,
        currencySymbol,
        subtotal,
        vat: totalTaxAmount,
        total,
        notesHeader,
        notesContent,
        termsContent,
        amountPaid: 0,
        signature: signature ? URL.createObjectURL(signature) : undefined,
        discountPercent,
        shipping,
        taxList
    };

    return (
        <div className="py-8 px-6 my-6 flex min-h-[127vh] shadow-2xl rounded-2xl max-w-4xl flex-col mx-auto">
            {/* Header and other sections */}
            <div className="flex justify-between mb-1">
                <div className="flex items-start mr-4">
                    <ImageUploader
                        label="Logo"
                        image={logo ? URL.createObjectURL(logo) : null}
                        onChange={handleLogoChange}
                        className="h-16 w-auto"
                    />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold uppercase self-start">Invoice</h3>
                    <input
                        type="text"
                        placeholder="Invoice Number"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="border rounded-md p-0.5 w-full text-xs mt-0.5 placeholder:font-bold"
                    />
                </div>
            </div>

            <div className="flex justify-between mb-2 mt-10">
                <div className="flex-none w-1/3 pr-4 mt-6">
                    <textarea
                        placeholder="From information..."
                        className="border rounded-md p-0.5 w-full h-10 text-xs mb-2 placeholder:font-bold"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        style={{ height: '50px' }}
                    />
                </div>

                <div className="flex-grow"></div>

                <div className="flex-none pl-10 w-1/4 mt-4">
                    <h3 className="text-xs font-semibold mb-0.5">Invoice Date</h3>
                    <input
                        type="text"
                        placeholder="Invoice Date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="border rounded-md p-0.5 w-full text-xs mb-2 placeholder:font-bold"
                        style={{ height: '34px', width: '100%' }}
                    />
                    <h3 className="text-xs font-semibold mb-0.5 mt-2">Due Date</h3>
                    <input
                        type="text"
                        placeholder="Due Date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border rounded-md p-0.5 w-full text-xs mb-2 placeholder:font-bold"
                        style={{ height: '34px', width: '100%' }}
                    />
                </div>
            </div>

            <div className="flex justify-between mb-2">
                <div className="flex-none w-1/3" style={{ marginRight: '-1px' }}>
                    <h3 className="text-xs mb-0.5">{billToHeader}</h3>
                    <textarea
                        value={billTo}
                        onChange={(e) => setBillTo(e.target.value)}
                        placeholder="Bill to information..."
                        className="border rounded-md p-0.5 w-full text-xs placeholder:font-bold"
                        style={{ height: '50px' }}
                    />
                </div>

                <div className="flex-none w-1/4" style={{ marginLeft: '-70px' }}>
                    <h3 className="text-xs mb-0.5">{shipToHeader}</h3>
                    <textarea
                        value={shipTo}
                        onChange={(e) => setShipTo(e.target.value)}
                        placeholder="Shipping information (optional)..."
                        className="border rounded-md p-0.5 w-full text-xs placeholder:font-bold"
                        style={{ height: '50px' }}
                    />
                </div>

                <div className="flex-none pl-10 w-1/4 mt-4">
                    <h3 className="text-xs mb-0.5">PO#</h3>
                    <input
                        type="text"
                        placeholder="PO# (optional)"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="border rounded-md p-0.5 w-full text-xs placeholder:font-bold"
                        style={{ height: '34px', width: '100%' }}
                    />
                </div>
            </div>

            <NewInvoiceItems
                items={items}
                currency={currency}
                onItemChange={handleItemChange}
                onRemoveItem={removeItem}
                onAddNewItem={addItem}
            />

            <div className="flex justify-between mt-6 mb-4">
                <div className="flex flex-col w-full sm:w-2/5">
                    <div className="flex-grow" style={{ height: 'calc(100% - 130px)' }}>
                        <NotesSection
                            notesHeader={notesHeader}
                            notesContent={notesContent}
                            termsContent={termsContent}
                            onNotesHeaderChange={setNotesHeader}
                            onNotesContentChange={setNotesContent}
                            onTermsContentChange={setTermsContent}
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full sm:w-1/3">
                    <div className="flex items-center justify-between mb-1">
                        <CurrencySelector
                            selectedCurrency={currency.code}
                            onCurrencyChange={handleCurrencyChange}
                            className="text-xs"
                        />
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                        <TotalsSection
                            items={items}
                            currencySymbol={currencySymbol}
                            subtotal={subtotal}
                            vat={totalTaxAmount}
                            total={total}
                            amountPaid={0}
                            onDiscountChange={handleDiscountChange}
                            onShippingChange={handleShippingChange}
                            onTaxChange={handleTaxChange}
                            taxList={taxList}
                            onRemoveTax={handleRemoveTax}
                        />
                    </div>

                    <div className="mt-6 flex flex-col justify-end flex-shrink-0">
                        <h3 className="text-xs font-semibold mb-1">Signature</h3>
                        <ImageUploader
                            image={signature ? URL.createObjectURL(signature) : null}
                            onChange={handleSignatureChange}
                            className="h-14,9 w-auto"
                            label=""
                        />
                    </div>
                </div>
            </div>

            <div className="my-4 max-w-4xl justify-center flex mx-auto">
                <PDFDownloadLink
                    document={<NewInvoiceDocument invoiceData={invoiceData} />}
                    fileName={`invoice_${invoiceData.invoiceNumber || Date.now()}.pdf`}
                    className="py-2 shadow-2xl bg-gray-800 text-white rounded-md hover:bg-gray-800 w-full text-center"
                >
                    {({ loading }: { loading: boolean }) =>
                        loading ? 'Generating PDF...' : 'Generate PDF'
                    }
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default NewInvoiceTemplate;