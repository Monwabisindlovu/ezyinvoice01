import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer'; // Removed PDFViewer import
import TaxModal from './TaxModal';
import InvoiceHeader from './InvoiceHeader';
import InvoiceAddresses from './InvoiceAddresses';
import InvoiceInfo from './InvoiceInfo';
import InvoiceItems from './InvoiceItems';
import InvoiceTotals from './InvoiceTotals';
import InvoiceTermsAndSignature from './InvoiceTermsAndSignature';
import { useInvoiceForm } from '../../hooks/useInvoiceForm';
import InvoiceDocumentPDF from './InvoicePDF';

interface InvoiceFormProps {
  isAuthenticated: boolean;
  promptLogin: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ isAuthenticated, promptLogin }) => {
  const {
    currency,
    currencySymbol,
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
  } = useInvoiceForm();

  const handleGeneratePDF = () => {
    if (!isAuthenticated) {
      promptLogin();
      return;
    }
    // Logic to generate or download PDF
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:space-x-6">
      {/* Invoice Form Section */}
      <div className="py-8 px-6 my-6 flex min-h-screen shadow-2xl rounded-2xl max-w-4xl flex-col mx-auto border-4 border-gray-100">
        {/* Header Section */}
        <InvoiceHeader
          from={invoiceData.from}
          onFromChange={handleInvoiceDataChange}
          logo={invoiceData.logo}
          onLogoChange={(file) => handleFileChangeOrDrop(file, 'logo')}
        />

        {/* Addresses and Invoice Info */}
        <div className="flex flex-row">
          <InvoiceAddresses
            billTo={invoiceData.billTo}
            shipTo={invoiceData.shipTo}
            onBillToChange={handleInvoiceDataChange}
            onShipToChange={handleInvoiceDataChange}
          />
          <InvoiceInfo
                        invoiceNumber={invoiceData.invoiceNumber}
                        invoiceDate={invoiceData.invoiceDate}
                        poNumber={invoiceData.poNumber}
                        dueDate={invoiceData.DueDate}
                        onInvoiceNumberChange={handleInvoiceDataChange}
                        onInvoiceDateChange={handleInvoiceDataChange}
                        onPoNumberChange={handleInvoiceDataChange}
                        onDueDateChange={handleInvoiceDataChange}
          />
        </div>

        {/* Items Section */}
        <InvoiceItems
          items={invoiceData.items}
          onItemChange={handleItemChange}
          onOpenTaxModal={openTaxModal}
          onRemoveItem={removeItem}
          onAddNewItem={addNewItem}
        />

        {/* Totals Section */}
        <div className="flex flex-row justify-between mt-4 space-x-4">
          <InvoiceTotals
            subtotal={invoiceData.subtotal}
            vat={invoiceData.vat}
            total={invoiceData.total}
            vatPercentage={invoiceData.vatPercentage}
            currency={currency}
            currencySymbol={currencySymbol}
            currencyList={currencyList}
            onCurrencyChange={handleCurrencyChange}
            items={invoiceData.items}
          />
        </div>

        {/* Terms and Signature Section */}
        <InvoiceTermsAndSignature
          termsConditions={termsConditions}
          onTermsConditionsChange={(e) => setTermsConditions(e.target.value)}
          signature={invoiceData.signature}
          onSignatureChange={(file) => handleFileChangeOrDrop(file, 'signature')}
        />

        {/* Tax Modal */}
        {currentItemIndex !== null && (
          <TaxModal
            isOpen={isTaxModalOpen}
            onClose={closeTaxModal}
            onSave={(taxName, taxPercentage) =>
              saveTaxDetails(currentItemIndex, taxName, taxPercentage)
            }
          />
        )}

        {/* Generate PDF Button */}
        <div className="my-4 justify-center flex">
          <PDFDownloadLink
            document={
              <InvoiceDocumentPDF
                invoiceData={{
                  ...invoiceData,
                  termsConditions,
                  currencySymbol: currencySymbol,
                }}
              />
            }
            fileName={`invoice_${invoiceData.invoiceNumber || Date.now()}.pdf`}
            className="py-2 shadow-2xl bg-gray-800 text-white rounded-md hover:bg-gray-800 w-full text-center"
            onClick={handleGeneratePDF} // Ensure promptLogin is called
          >
            {({ loading }: { loading: boolean }) =>
              loading ? 'Generating PDF...' : 'Generate PDF'
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
