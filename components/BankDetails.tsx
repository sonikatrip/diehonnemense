import { BankDetails as BankDetailsType } from '@/lib/bankDetails';

interface BankDetailsProps {
  bankDetails: BankDetailsType;
  reference?: string;
}

export default function BankDetails({ bankDetails, reference }: BankDetailsProps) {
  if (!bankDetails) {
    return null;
  }

  return (
    <div className="bank-details">
      <div className="bank-details-row">
        <span className="bank-details-label">Account Name:</span>
        <span className="bank-details-value">{bankDetails.accountName}</span>
      </div>
      <div className="bank-details-row">
        <span className="bank-details-label">Bank:</span>
        <span className="bank-details-value">{bankDetails.bank}</span>
      </div>
      <div className="bank-details-row">
        <span className="bank-details-label">Account Type:</span>
        <span className="bank-details-value">{bankDetails.accountType}</span>
      </div>
      <div className="bank-details-row">
        <span className="bank-details-label">Account Number:</span>
        <span className="bank-details-value">{bankDetails.accountNumber}</span>
      </div>
      <div className="bank-details-row">
        <span className="bank-details-label">Branch Code:</span>
        <span className="bank-details-value">{bankDetails.branchCode}</span>
      </div>
      {reference && (
        <div className="bank-details-row bank-details-reference">
          <span className="bank-details-label">Reference:</span>
          <span className="bank-details-value">{reference}</span>
        </div>
      )}
    </div>
  );
}
