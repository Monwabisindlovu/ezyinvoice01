import { useState, useEffect, ChangeEvent } from 'react';
import currencyCodes from 'currency-codes';
import currencySymbolMap from 'currency-symbol-map';

interface ItemData {
    [x: string]: any;
    qty: string;
    description: string;
    unitPrice: string;
    amount: string;
    taxName: string;
    taxPercentage: string;
    showTax: boolean;
}

interface InvoiceData {
    from: string;
    billTo: string;
    shipTo: string;
    invoiceNumber: string;
    invoiceDate: string;
    poNumber: string;
    DueDate: string;
    logo: string | null;
    items: ItemData[];
    showTax: boolean;
    dueDate?: string;
    subtotal: number;
    vat: number;
    total: number;
    vatPercentage: number;
    termsConditions: string;
    signature: string | null;
}

export const useInvoiceForm = () => {
    const [currency, setCurrency] = useState('USD');
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [vatPercentage, setVatPercentage] = useState(0.0);
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        from: '',
        billTo: '',
        shipTo: '',
        invoiceNumber: '',
        invoiceDate: '',
        poNumber: '',
        DueDate: '',
        logo: null,
        items: [
            {
                qty: '',
                description: '',
                unitPrice: '',
                amount: '',
                taxName: '',
                taxPercentage: '',
                showTax: false,
            },
        ],
        showTax: false,
        subtotal: 0,
        vat: 0,
        total: 0,
        vatPercentage: 0,
        termsConditions: '',
        signature: null,
    });

    const [termsConditions, setTermsConditions] = useState('');
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('R'); 

    // Get the list of all currencies
    const currencyList = currencyCodes.data.map((currency) => ({
        code: currency.code,
        name: currency.currency,
    }));

    // Calculate subtotal, VAT, and total
    const calculateTotals = () => {
        let subtotal = 0;
        let vat = 0;

        invoiceData.items.forEach((item) => {
            const qty = parseFloat(item.qty || '0');
            const unitPrice = parseFloat(item.unitPrice || '0');
            const amount = qty * unitPrice;
            item.amount = amount.toFixed(2);

            subtotal += amount;

            if (item.showTax) {
                const taxPercentage = parseFloat(item.taxPercentage || '0');
                vat += (taxPercentage / 100) * amount;
            }
        });

        setInvoiceData((prevData) => ({
            ...prevData,
            subtotal,
            vat,
            total: subtotal + vat,
            vatPercentage: vat > 0 && subtotal > 0 ? (vat / subtotal) * 100 : 0,
        }));
    };

    useEffect(() => {
        calculateTotals();
    }, [invoiceData.items, vatPercentage]);

    // Handle changes in item fields
    const handleItemChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [event.target.name as keyof ItemData]: event.target.value,
        };
        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    // Handle changes in invoice data fields
    const handleInvoiceDataChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setInvoiceData({ ...invoiceData, [name]: value });
    };

    // Handle file uploads (logo and signature)
    const handleFileChangeOrDrop = (file: File | null, field: 'logo' | 'signature') => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setInvoiceData((prevData) => ({
                    ...prevData,
                    [field]: reader.result as string, // Base64 string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setInvoiceData((prevData) => ({ ...prevData, [field]: null }));
        }
    };

    // Modal Controls
    const openTaxModal = (index: number) => {
        setCurrentItemIndex(index);
        setIsTaxModalOpen(true);
    };
    const closeTaxModal = () => setIsTaxModalOpen(false);

    // Save Tax Details from Modal
    const saveTaxDetails = (
        index: number,
        taxName: string,
        enteredTaxPercentage: string
    ) => {
        const taxPercentageValue = parseFloat(enteredTaxPercentage) || 0;

        setInvoiceData((prevData) => {
            const updatedItems = [...prevData.items];
            updatedItems[index] = {
                ...updatedItems[index],
                taxName,
                taxPercentage: enteredTaxPercentage,
                showTax: true,
            };
            return { ...prevData, items: updatedItems };
        });

        setVatPercentage(taxPercentageValue);
        calculateTotals();
    };

    // Remove an item from the invoice
    const removeItem = (index: number) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: prevData.items.filter((_, i) => i !== index),
        }));
    };

    // Add a new empty item
    const addNewItem = () => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: [
                ...prevData.items,
                {
                    qty: '',
                    description: '',
                    unitPrice: '',
                    amount: '',
                    taxName: '',
                    taxPercentage: '',
                    showTax: false,
                },
            ],
        }));
    };

    // Handle currency change
    const handleCurrencyChange = (currencyCode: string): void => {
        setCurrency(currencyCode);
        const symbol = currencySymbolMap(currencyCode) || currencyCode;
        setCurrencySymbol(symbol);
    };

    return {
        currency,
        currencySymbol,
        vatPercentage,
        invoiceData,
        termsConditions,
        isTaxModalOpen,
        currentItemIndex,
        currencyList,
        setTermsConditions,
        openTaxModal,
        closeTaxModal,
        handleItemChange,
        handleInvoiceDataChange,
        handleFileChangeOrDrop,
        saveTaxDetails,
        removeItem,
        addNewItem,
        handleCurrencyChange,
    };
};