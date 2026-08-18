import React, { useState } from 'react';
import { UploadCloud, FileText, X, Check, Eye } from 'lucide-react';

interface DocumentUploadStepProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  files: { [key: string]: File | null };
  setFiles: (files: { [key: string]: File | null }) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, onChange, files, setFiles }) => {
  // Track confirmation status of each document type
  const [confirmed, setConfirmed] = useState<{ [key: string]: boolean }>({
    identityProofFile: false,
    addressProofFile: false,
    incomeProofFile: false
  });

  // Track preview status
  const [previewing, setPreviewing] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles({ ...files, [field]: e.target.files[0] });
      setConfirmed({ ...confirmed, [field]: false }); // Reset confirmation on new upload
      setPreviewing(field); // Automatically show preview after upload
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, field: string) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles({ ...files, [field]: e.dataTransfer.files[0] });
      setConfirmed({ ...confirmed, [field]: false });
      setPreviewing(field);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (field: string) => {
    setFiles({ ...files, [field]: null });
    setConfirmed({ ...confirmed, [field]: false });
    if (previewing === field) setPreviewing(null);
  };

  const confirmFile = (field: string) => {
    setConfirmed({ ...confirmed, [field]: true });
    setPreviewing(null);
  };

  const getObjectUrl = (file: File | null) => {
    if (!file) return '';
    return URL.createObjectURL(file);
  };

  const renderDocumentSection = (title: string, selectName: string, selectValue: string, options: string[], fileField: string) => {
    const file = files[fileField];
    const isConfirmed = confirmed[fileField];

    return (
      <div className={`document-section ${isConfirmed ? 'confirmed' : ''}`}>
        <div className="doc-section-header">
          <label>{title} <span className="required-asterisk">*</span></label>
          {isConfirmed && <span className="status-badge success"><Check size={12} /> Confirmed</span>}
        </div>
        
        <select name={selectName} value={selectValue} onChange={onChange} className="form-select" style={{marginBottom: '1rem'}} disabled={isConfirmed}>
          <option value="">Select document type</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        {!file ? (
          <div className="file-dropzone" onDrop={(e) => handleDrop(e, fileField)} onDragOver={handleDragOver} onClick={() => document.getElementById(`${fileField}Input`)?.click()}>
            <UploadCloud size={24} color="var(--brand-blue)" />
            <p>Drag and drop or <span>click to upload</span></p>
            <input type="file" id={`${fileField}Input`} style={{ display: 'none' }} accept=".pdf,image/*" onChange={(e) => handleFileChange(e, fileField)} />
          </div>
        ) : (
          <div className="file-preview-card">
            <div className="file-info">
              <FileText size={20} color="var(--brand-blue)" />
              <div className="file-details">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
            
            <div className="file-actions">
              {!isConfirmed && (
                <button type="button" className="btn-icon" title="Preview" onClick={() => setPreviewing(previewing === fileField ? null : fileField)}>
                  <Eye size={18} />
                </button>
              )}
              <button type="button" className="btn-icon danger" title={isConfirmed ? "Re-upload" : "Remove"} onClick={() => removeFile(fileField)}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {previewing === fileField && file && !isConfirmed && (
          <div className="document-preview-pane">
            <div className="preview-header">
              <h3>Preview: {file.name}</h3>
              <button type="button" className="btn-icon" onClick={() => setPreviewing(null)}><X size={16}/></button>
            </div>
            <div className="preview-content">
              {file.type.startsWith('image/') ? (
                <img src={getObjectUrl(file)} alt="Document preview" />
              ) : file.type === 'application/pdf' ? (
                <iframe src={getObjectUrl(file)} title="PDF Preview" width="100%" height="400px" style={{border: 'none'}}></iframe>
              ) : (
                <div className="unsupported-preview">
                  <FileText size={48} color="#cbd5e1" />
                  <p>Preview not available for this file type.</p>
                </div>
              )}
            </div>
            <div className="preview-footer">
              <button type="button" className="btn-secondary" onClick={() => document.getElementById(`${fileField}Input`)?.click()}>
                Re-upload
              </button>
              <button type="button" className="btn-primary" onClick={() => confirmFile(fileField)}>
                <Check size={16} /> Confirm & Save
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="form-section-title">Documents</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '14px' }}>
        Please upload clear, legible copies of your documents. You must preview and confirm each document before proceeding.
      </p>
      
      <div className="form-grid">
        {renderDocumentSection(
          "Identity Proof", 
          "identityProof", 
          formData.identityProof, 
          ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License"], 
          "identityProofFile"
        )}

        {renderDocumentSection(
          "Address Proof", 
          "addressProof", 
          formData.addressProof, 
          ["Aadhaar Card", "Passport", "Voter ID", "Utility Bill", "Rental Agreement"], 
          "addressProofFile"
        )}

        {renderDocumentSection(
          "Income Proof", 
          "incomeProof", 
          formData.incomeProof, 
          ["Salary Slip", "Income Tax Return (ITR)", "Bank Statement", "Form 16"], 
          "incomeProofFile"
        )}
      </div>
    </div>
  );
};
