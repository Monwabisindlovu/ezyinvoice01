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
    color: 'purple',
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
    color: '#2E3B4E',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#1E3A5F',
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
    color: 'black',
  },
  termsHeader: {
    backgroundColor: '#2E3B4E',
    padding: 8,
    fontWeight: 'bold',
    color: 'white',
  },
});

interface ItemData {
  item: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
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
  items: {
    item: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  currencySymbol: string;
  subtotal: number;
  vat?: number;
  total: number;
  vatPercentage?: number;
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
}

interface InvoiceDocumentProps {
  invoiceData: InvoiceData;
}

const NewInvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoiceData }) => {
  const { currencySymbol } = invoiceData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {invoiceData.logo && <Image src={invoiceData.logo} style={styles.logo} />}
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
                {formatCurrency(item.rate, currencySymbol)}
              </Text>
              <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>
                {formatCurrency(item.amount, currencySymbol)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text>{formatCurrency(invoiceData.subtotal, currencySymbol)}</Text>
          </View>
          {invoiceData.vat && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>VAT ({invoiceData.vatPercentage || 0}%):</Text>
              <Text>{formatCurrency(invoiceData.vat, currencySymbol)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoiceData.total, currencySymbol)}
            </Text>
          </View>
        </View>
{/* Signature Section */}
{invoiceData.signature && (
  <View style={styles.signature}>
    <Image src={invoiceData.signature} style={{ width: 100, height: 50 }} />
    <Text>Authorized Signature</Text>
  </View>
)}

{/* Notes and Terms */}
{(invoiceData.notesContent || invoiceData.termsContent) && (
  <View style={styles.terms}>
    {/* Bank Details Section */}
    {invoiceData.notesContent && (
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 10 }}>Bank Details</Text>
        <View style={{ marginLeft: 10 }}>
          <Text>Account Name: {invoiceData.notesContent.accountName || 'N/A'}</Text>
          <Text>Bank Name: {invoiceData.notesContent.bankName || 'N/A'}</Text>
          <Text>Branch Code: {invoiceData.notesContent.branchCode || 'N/A'}</Text>
          <Text>Account Number: {invoiceData.notesContent.accountNumber || 'N/A'}</Text>
        </View>
      </View>
    )}

    {/* Conditional rendering for Terms and Conditions */}
    {invoiceData.termsContent && (
      <View style={styles.termsHeader}>
        <Text>Terms and Conditions</Text>
      </View>
    )}
    {invoiceData.termsContent && <Text>{invoiceData.termsContent}</Text>}
  </View>
)}
   </Page>
    </Document>
  );
};

export default NewInvoiceDocument;
