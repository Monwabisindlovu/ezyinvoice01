import React, { useEffect } from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatCurrency } from '../../utils/currency';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica',
        lineHeight: 1.5,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    companyInfo: {
        flexDirection: 'column',
        width: '60%',
    },
    logo: {
        width: 120,
        height: 60,
    },
    invoiceTitleContainer: {
        width: '40%',
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'purple',
    },
    invoiceNumber: {
        fontSize: 12,
    },
    section: {
        marginBottom: 20,
    },
    invoiceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    invoiceLeft: {
        flexDirection: 'column',
        width: '50%',
        color: '#2E3B4E',
    },
    invoiceRight: {
        flexDirection: 'column',
        width: '50%',
        textAlign: 'right',
        color: '#2E3B4E',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#2E3B4E',
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: 1,
        fontWeight: 'bold',
        color: 'white',
    },
    tableCol: {
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 8,
    },
    totals: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginBottom: 5,
        color: '#2E3B4E',
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalValue: {
        fontWeight: 'bold',
        color: '#1E3A5F',
    },
    signatureContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 50,
    },
    signatureImage: {
        width: 100,
        height: 50,
    },
    signatureLabel: {
        marginLeft: 10,
        alignSelf: 'flex-end',
    },
    terms: {
        marginTop: 30,
        fontSize: 10,
        color: 'black',
    },
    bankDetailsSection: {
        marginBottom: 20,
    },
    bankDetailLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        width: 90,
    },
    dottedUnderline: {
        borderBottomWidth: 1,
        borderBottomStyle: 'dotted',
        paddingBottom: 2,
        fontSize: 10,
    },
    doubleDottedHeader: {
        borderBottomWidth: 2,
        borderBottomStyle: 'dotted',
        paddingBottom: 5,
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 10,
    },
});

interface ItemData {
    item: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface TaxData {
    name: string;
    percent: number;
}

interface InvoiceData {
    from: string;
    billTo: string;
    shipTo?: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate?: string;
    poNumber?: string;
    logo?: string;
    items: ItemData[];
    currencySymbol: string;
    subtotal: number;
    vat: number;
    total: number;
    notesHeader?: string;
    notesContent?: {
        accountName: string;
        bankName: string;
        branchCode: string;
        accountNumber: string;
    };
    termsContent?: string;
    amountPaid: number;
    signature?: string;
    discountPercent?: string;
    shipping?: string;
    taxList?: TaxData[];
}

interface InvoiceDocumentProps {
    invoiceData: InvoiceData;
}

const NewInvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoiceData }) => {
    const { currencySymbol, discountPercent, shipping, taxList } = invoiceData;

    const formatCurrencySafe = (value: number, symbol?: string) => {
        return formatCurrency(value, symbol || "$"); // Provide default currency symbol if undefined
    };

    const calculateTaxAmount = (subtotal: number, taxPercent: number) => {
        return (subtotal * taxPercent) / 100;
    };

    const calculateDiscountAmount = () => {
        return discountPercent ? (parseFloat(discountPercent) / 100) * invoiceData.subtotal : 0;
    };

    const calculateTotal = () => {
        let total = invoiceData.subtotal;

        if (taxList && taxList.length > 0) {
            taxList.forEach(tax => {
                total += calculateTaxAmount(invoiceData.subtotal, tax.percent);
            });
        }

        total -= calculateDiscountAmount();
        total += parseFloat(shipping ?? '0') || 0;


        return total;
    };

    const renderTaxDetails = () => {
        return taxList?.map((tax, index) => (
            <View style={styles.totalRow} key={index}>
                <Text style={styles.totalLabel}>{tax.name} ({tax.percent}%):</Text>
                <Text>
                    {formatCurrencySafe(calculateTaxAmount(invoiceData.subtotal, tax.percent), currencySymbol || "$")}
                </Text>
            </View>
        )) || null;
    };

    const renderDiscountDetails = () => {
        const discountAmount = calculateDiscountAmount();
        return discountPercent ? (
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount ({discountPercent}%):</Text>
                <Text>{formatCurrencySafe(-discountAmount, currencySymbol || "$")}</Text>
            </View>
        ) : null;
    };

    const renderShippingDetails = () => {
        if (shipping) {
            return (
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Shipping:</Text>
                    <Text>{formatCurrencySafe(parseFloat(shipping), currencySymbol || "$")}</Text>
                </View>
            );
        }
        return null;
    };

    // Logs for debugging
    useEffect(() => {
        console.log("Invoice Data before rendering:", invoiceData);
    }, [invoiceData]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.companyInfo}>
                        {invoiceData.logo && (
                            <Image src={invoiceData.logo} style={styles.logo} />
                        )}
                        <Text>{invoiceData.from}</Text>
                    </View>
                    <View style={styles.invoiceTitleContainer}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={styles.invoiceNumber}>#{invoiceData.invoiceNumber}</Text>
                    </View>
                </View>

                {/* Invoice Info */}
                <View style={styles.invoiceInfo}>
                    <View style={styles.invoiceLeft}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Bill To:</Text>
                        <Text>{invoiceData.billTo}</Text>
                        {invoiceData.shipTo && (
                            <>
                                <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Ship To:</Text>
                                <Text>{invoiceData.shipTo}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.invoiceRight}>
                        <Text>Invoice Date: {invoiceData.invoiceDate}</Text>
                        <Text>Due Date: {invoiceData.dueDate || 'N/A'}</Text>
                        {invoiceData.poNumber && <Text>PO #: {invoiceData.poNumber}</Text>}
                    </View>
                </View>

                {/* Items Table */}
                <View style={[styles.table, { marginTop: 30 }]}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCol, { width: '50%' }]}>Description</Text>
                        <Text style={[styles.tableCol, { width: '10%' }]}>Qty</Text>
                        <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>Unit Price</Text>
                        <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>Amount</Text>
                    </View>
                    {invoiceData.items.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.tableCol, { width: '50%' }]}>{item.description}</Text>
                            <Text style={[styles.tableCol, { width: '10%' }]}>{item.quantity}</Text>
                            <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>
                                {formatCurrencySafe(item.rate, currencySymbol || "$")} {/* Safe fallback */}
                            </Text>
                            <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>
                                {formatCurrencySafe(item.amount, currencySymbol || "$")} {/* Safe fallback */}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals Section */}
                <View style={styles.totals}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal:</Text>
                        <Text>{formatCurrencySafe(invoiceData.subtotal, currencySymbol || "$")}</Text> {/* Safeguarding currencySymbol */}
                    </View>
                    {renderTaxDetails()}
                    {renderDiscountDetails()}
                    {renderShippingDetails()}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>{formatCurrencySafe(calculateTotal(), currencySymbol || "$")}</Text> {/* Safeguarding currencySymbol */}
                    </View>
                </View>

                {/* Signature Section */}
                {invoiceData.signature && (
                    <View style={styles.signatureContainer}>
                        <Image src={invoiceData.signature} style={styles.signatureImage} />
                        <Text style={styles.signatureLabel}>Authorized Signature</Text>
                    </View>
                )}

                {/* Notes and Terms */}
                {(invoiceData.notesContent || invoiceData.termsContent) && (
                    <View style={styles.terms}>
                        {/* Bank Details Section */}
                        {invoiceData.notesContent && (
                            <View style={styles.bankDetailsSection}>
                                <Text style={[styles.doubleDottedHeader]}>Bank Details</Text>
                                <View style={{ marginLeft: 10 }}>
                                    {/* Account Name */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                        <Text style={styles.bankDetailLabel}>Account Name:</Text>
                                        <Text style={styles.dottedUnderline}>
                                            {invoiceData.notesContent.accountName || 'N/A'}
                                        </Text>
                                    </View>

                                    {/* Bank Name */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                        <Text style={styles.bankDetailLabel}>Bank Name:</Text>
                                        <Text style={styles.dottedUnderline}>
                                            {invoiceData.notesContent.bankName || 'N/A'}
                                        </Text>
                                    </View>

                                    {/* Branch Code */}
                                    {invoiceData.notesContent.branchCode && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                            <Text style={styles.bankDetailLabel}>Branch Code:</Text>
                                            <Text style={styles.dottedUnderline}>
                                                {invoiceData.notesContent.branchCode}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Account Number */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                        <Text style={styles.bankDetailLabel}>Account Number:</Text>
                                        <Text style={styles.dottedUnderline}>
                                            {invoiceData.notesContent.accountNumber || 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        {/* Conditional rendering for Terms and Conditions */}
                        {invoiceData.termsContent && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={[styles.doubleDottedHeader]}>Terms and Conditions</Text>
                                <Text style={{ fontSize: 11 }}>{invoiceData.termsContent}</Text>
                            </View>
                        )}
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default NewInvoiceDocument;