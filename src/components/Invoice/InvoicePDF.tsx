import React from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatCurrency } from '../../utils/currency';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica',
        lineHeight: 1.5,
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
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        width: '40%',
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
    },
    invoiceRight: {
        flexDirection: 'column',
        width: '50%',
        textAlign: 'right',
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
        backgroundColor: '#f2f2f2',
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: 1,
        fontWeight: 'bold',
    },
    tableCol: {
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 8,
    },
    tableCell: {
        margin: 'auto',
        marginTop: 5,
        fontSize: 10,
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
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalValue: {
        fontWeight: 'bold',
    },
    signature: {
        marginTop: 50,
        textAlign: 'right',
    },
    terms: {
        marginTop: 30,
        fontSize: 10,
        borderTopWidth: 1,
        borderTopColor: '#bfbfbf',
        paddingTop: 10,
    },
});

interface ItemData {
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
    logo: string | null; // Base64 string or URL
    items: ItemData[];
    showTax: boolean;
    dueDate?: string;
    subtotal: number;
    vat: number;
    total: number;
    vatPercentage: number;
    termsConditions: string;
    signature: string | null; // Base64 string or URL
    currencySymbol: string; // Add this field for the currency symbol
}

interface InvoiceDocumentProps {
    invoiceData: InvoiceData;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoiceData }) => {
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
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
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
                        <Text>Invoice #: {invoiceData.invoiceNumber}</Text>
                        <Text>Invoice Date: {invoiceData.invoiceDate}</Text>
                        <Text>Due Date: {invoiceData.dueDate || 'N/A'}</Text>
                        {invoiceData.poNumber && (
                            <Text>PO #: {invoiceData.poNumber}</Text>
                        )}
                    </View>
                </View>

                {/* Items Table */}
                <View style={[styles.table, { marginTop: 30 }]}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCol, { width: '10%' }]}>Qty</Text>
                        <Text style={[styles.tableCol, { width: '50%' }]}>Description</Text>
                        <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>Unit Price</Text>
                        <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>Amount</Text>
                    </View>
                    {/* Table Rows */}
                    {invoiceData.items.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.tableCol, { width: '10%' }]}>{item.qty}</Text>
                            <Text style={[styles.tableCol, { width: '50%' }]}>{item.description}</Text>
                            <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>
                                {formatCurrency(parseFloat(item.unitPrice), invoiceData.currencySymbol)}
                            </Text>
                            <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>
                                {formatCurrency(parseFloat(item.amount), invoiceData.currencySymbol)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.totals}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal:</Text>
                        <Text>{formatCurrency(invoiceData.subtotal, invoiceData.currencySymbol)}</Text>
                    </View>
                    {invoiceData.vat > 0 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>VAT ({invoiceData.vatPercentage}%):</Text>
                            <Text>{formatCurrency(invoiceData.vat, invoiceData.currencySymbol)}</Text>
                        </View>
                    )}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL:</Text>
                        <Text style={styles.totalValue}>
                            {formatCurrency(invoiceData.total, invoiceData.currencySymbol)}
                        </Text>
                    </View>
                </View>

                {/* Signature */}
                {invoiceData.signature && (
                    <View style={styles.signature}>
                        <Image src={invoiceData.signature} style={{ width: 100, height: 50 }} />
                        <Text>Authorized Signature</Text>
                    </View>
                )}

                {/* Terms and Conditions */}
                {invoiceData.termsConditions && (
                    <View style={styles.terms}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Terms and Conditions:</Text>
                        <Text>{invoiceData.termsConditions}</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default InvoiceDocument;
