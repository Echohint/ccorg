import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  Check,
  Eye
} from 'lucide-react';

export const DocumentUploadStep = ({
  formData,
  onChange,
  files,
  setFiles
}) => {
  // Track confirmation status of each document
  const [confirmed, setConfirmed] = useState({
    identityProofFile: false,
    addressProofFile: false,
    incomeProofFile: false
  });

  // Track which document is being previewed
  const [previewing, setPreviewing] = useState(null);

  // =========================
  // File Upload
  // =========================

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      setFiles({
        ...files,
        [field]: selectedFile
      });

      // Reset confirmation when new file is uploaded
      setConfirmed({
        ...confirmed,
        [field]: false
      });

      // Automatically show preview
      setPreviewing(field);
    }
  };

  // =========================
  // Drag & Drop
  // =========================

  const handleDrop = (e, field) => {
    e.preventDefault();

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      const droppedFile = e.dataTransfer.files[0];

      setFiles({
        ...files,
        [field]: droppedFile
      });

      setConfirmed({
        ...confirmed,
        [field]: false
      });

      setPreviewing(field);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // =========================
  // Remove File
  // =========================

  const removeFile = (field) => {
    setFiles({
      ...files,
      [field]: null
    });

    setConfirmed({
      ...confirmed,
      [field]: false
    });

    if (previewing === field) {
      setPreviewing(null);
    }
  };

  // =========================
  // Confirm File
  // =========================

  const confirmFile = (field) => {
    setConfirmed({
      ...confirmed,
      [field]: true
    });

    setPreviewing(null);
  };

  // =========================
  // Create Preview URL
  // =========================

  const getObjectUrl = (file) => {
    if (!file) {
      return '';
    }

    return URL.createObjectURL(file);
  };

  // =========================
  // Render Document Section
  // =========================

  const renderDocumentSection = (
    title,
    selectName,
    selectValue,
    options,
    fileField
  ) => {
    const file = files[fileField];
    const isConfirmed = confirmed[fileField];

    return (
      <div
        className={`document-section ${
          isConfirmed ? 'confirmed' : ''
        }`}
      >
        {/* Document Header */}
        <div className="doc-section-header">
          <label>
            {title}
            <span className="required-asterisk">
              *
            </span>
          </label>

          {isConfirmed && (
            <span className="status-badge success">
              <Check size={12} />
              Confirmed
            </span>
          )}
        </div>

        {/* Document Type */}
        <select
          name={selectName}
          value={selectValue}
          onChange={onChange}
          className="form-select"
          style={{
            marginBottom: '1rem'
          }}
          disabled={isConfirmed}
        >
          <option value="">
            Select document type
          </option>

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        {/* Upload Section */}
        {!file ? (
          <div
            className="file-dropzone"
            onDrop={(e) =>
              handleDrop(e, fileField)
            }
            onDragOver={handleDragOver}
            onClick={() =>
              document
                .getElementById(
                  `${fileField}Input`
                )
                ?.click()
            }
          >
            <UploadCloud
              size={24}
              color="var(--brand-blue)"
            />

            <p>
              Drag and drop or{' '}
              <span>
                click to upload
              </span>
            </p>

            <input
              type="file"
              id={`${fileField}Input`}
              style={{
                display: 'none'
              }}
              accept=".pdf,image/*"
              onChange={(e) =>
                handleFileChange(
                  e,
                  fileField
                )
              }
            />
          </div>
        ) : (
          /* File Preview Card */
          <div className="file-preview-card">
            <div className="file-info">
              <FileText
                size={20}
                color="var(--brand-blue)"
              />

              <div className="file-details">
                <span className="file-name">
                  {file.name}
                </span>

                <span className="file-size">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            {/* File Actions */}
            <div className="file-actions">
              {!isConfirmed && (
                <button
                  type="button"
                  className="btn-icon"
                  title="Preview"
                  onClick={() =>
                    setPreviewing(
                      previewing === fileField
                        ? null
                        : fileField
                    )
                  }
                >
                  <Eye size={18} />
                </button>
              )}

              <button
                type="button"
                className="btn-icon danger"
                title={
                  isConfirmed
                    ? 'Re-upload'
                    : 'Remove'
                }
                onClick={() =>
                  removeFile(fileField)
                }
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Document Preview */}
        {previewing === fileField &&
          file &&
          !isConfirmed && (
            <div className="document-preview-pane">

              {/* Preview Header */}
              <div className="preview-header">
                <h3>
                  Preview: {file.name}
                </h3>

                <button
                  type="button"
                  className="btn-icon"
                  onClick={() =>
                    setPreviewing(null)
                  }
                >
                  <X size={16} />
                </button>
              </div>

              {/* Preview Content */}
              <div className="preview-content">
                {file.type.startsWith(
                  'image/'
                ) ? (
                  <img
                    src={getObjectUrl(file)}
                    alt="Document preview"
                  />
                ) : file.type ===
                  'application/pdf' ? (
                  <iframe
                    src={getObjectUrl(file)}
                    title="PDF Preview"
                    width="100%"
                    height="400px"
                    style={{
                      border: 'none'
                    }}
                  />
                ) : (
                  <div className="unsupported-preview">
                    <FileText
                      size={48}
                      color="#cbd5e1"
                    />

                    <p>
                      Preview not available
                      for this file type.
                    </p>
                  </div>
                )}
              </div>

              {/* Preview Footer */}
              <div className="preview-footer">

                {/* Re-upload */}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    document
                      .getElementById(
                        `${fileField}Input`
                      )
                      ?.click()
                  }
                >
                  Re-upload
                </button>

                {/* Confirm */}
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    confirmFile(fileField)
                  }
                >
                  <Check size={16} />
                  Confirm & Save
                </button>

              </div>
            </div>
          )}
      </div>
    );
  };

  // =========================
  // Component UI
  // =========================

  return (
    <div>
      <h2 className="form-section-title">
        Documents
      </h2>

      <p
        style={{
          color: '#64748b',
          marginBottom: '1.5rem',
          fontSize: '14px'
        }}
      >
        Please upload clear, legible copies
        of your documents. You must preview
        and confirm each document before
        proceeding.
      </p>

      <div className="form-grid">

        {/* Identity Proof */}
        {renderDocumentSection(
          'Identity Proof',
          'identityProof',
          formData.identityProof,
          [
            'Aadhaar Card',
            'PAN Card',
            'Passport',
            'Voter ID',
            'Driving License'
          ],
          'identityProofFile'
        )}

        {/* Address Proof */}
        {renderDocumentSection(
          'Address Proof',
          'addressProof',
          formData.addressProof,
          [
            'Aadhaar Card',
            'Passport',
            'Voter ID',
            'Utility Bill',
            'Rental Agreement'
          ],
          'addressProofFile'
        )}

        {/* Income Proof */}
        {renderDocumentSection(
          'Income Proof',
          'incomeProof',
          formData.incomeProof,
          [
            'Salary Slip',
            'Income Tax Return (ITR)',
            'Bank Statement',
            'Form 16'
          ],
          'incomeProofFile'
        )}

      </div>
    </div>
  );
};

export default DocumentUploadStep;
