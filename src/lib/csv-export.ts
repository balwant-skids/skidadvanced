/**
 * CSV Export Utilities
 * Handles CSV generation, streaming, and browser downloads
 */

export interface ExportOptions {
  filename: string;
  headers: string[];
  data: Record<string, any>[];
  onProgress?: (progress: number) => void;
}

export interface CSVGenerator {
  generateCSV(options: ExportOptions): Promise<Blob>;
  downloadCSV(blob: Blob, filename: string): void;
  streamCSV(data: AsyncIterable<Record<string, any>>): AsyncGenerator<string>;
}

/**
 * Escape CSV field value
 */
function escapeCSVField(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If the value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(headers: string[], data: Record<string, any>[]): string {
  const rows: string[] = [];
  
  // Add header row
  rows.push(headers.map(escapeCSVField).join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => escapeCSVField(row[header]));
    rows.push(values.join(','));
  }
  
  return rows.join('\n');
}

/**
 * Generate CSV blob from data
 */
export async function generateCSV(options: ExportOptions): Promise<Blob> {
  const { headers, data, onProgress } = options;
  
  const chunkSize = 1000;
  const chunks: string[] = [];
  
  // Add header
  chunks.push(headers.map(escapeCSVField).join(','));
  
  // Process data in chunks
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    
    for (const row of chunk) {
      const values = headers.map(header => escapeCSVField(row[header]));
      chunks.push(values.join(','));
    }
    
    // Report progress
    if (onProgress) {
      const progress = Math.min(100, Math.round(((i + chunkSize) / data.length) * 100));
      onProgress(progress);
    }
  }
  
  const csvContent = chunks.join('\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Trigger browser download of CSV blob
 */
export function downloadCSV(blob: Blob, filename: string): void {
  // Add timestamp to filename if not present
  const timestamp = new Date().toISOString().split('T')[0];
  const finalFilename = filename.includes(timestamp) 
    ? filename 
    : filename.replace('.csv', `_${timestamp}.csv`);
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Stream CSV generation for very large datasets
 * (For future use with streaming APIs)
 */
export async function* streamCSV(
  headers: string[],
  data: AsyncIterable<Record<string, any>>
): AsyncGenerator<string> {
  // Yield header
  yield headers.map(escapeCSVField).join(',') + '\n';
  
  // Yield data rows
  for await (const row of data) {
    const values = headers.map(header => escapeCSVField(row[header]));
    yield values.join(',') + '\n';
  }
}

/**
 * Export data to CSV and trigger download
 */
export async function exportToCSV(options: ExportOptions): Promise<void> {
  const blob = await generateCSV(options);
  downloadCSV(blob, options.filename);
}

/**
 * Validate filename has .csv extension
 */
export function ensureCSVExtension(filename: string): string {
  return filename.endsWith('.csv') ? filename : `${filename}.csv`;
}

/**
 * Generate timestamped filename
 */
export function generateTimestampedFilename(base: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
  return ensureCSVExtension(`${base}_${timestamp}`);
}
