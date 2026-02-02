import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BankDetails {
  accountName: string;
  bank: string;
  accountType: string;
  accountNumber: string;
  branchCode: string;
}

export function loadBankDetails(): BankDetails {
  const filePath = path.join(process.cwd(), 'content', 'bankdetails.md');

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      accountName: data.accountName || '',
      bank: data.bank || '',
      accountType: data.accountType || '',
      accountNumber: data.accountNumber || '',
      branchCode: data.branchCode || '',
    };
  } catch (error) {
    console.error('Error loading bank details:', error);
    return {
      accountName: '',
      bank: '',
      accountType: '',
      accountNumber: '',
      branchCode: '',
    };
  }
}
