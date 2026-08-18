import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import api from '../api';
import './CreateApplication.css';

// Import step components
import { CustomerDetailsStep } from '../components/application-steps/CustomerDetailsStep';
import { AddressDetailsStep } from '../components/application-steps/AddressDetailsStep';
import { EmploymentIncomeStep } from '../components/application-steps/EmploymentIncomeStep';
import { DocumentUploadStep } from '../components/application-steps/DocumentUploadStep';
import { ReviewSubmitStep } from '../components/application-steps/ReviewSubmitStep';

export const CreateApplication = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  const [step, setStep] = useState(1);

  // Files
  const [files, setFiles] = useState({
    identityProofFile: null,
    addressProofFile: null,
    incomeProofFile: null
  });

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Customer Details
    fullName: '',
    dateOfBirth: '',
    mobileNumber: '',
    emailAddress: '',
    panNumber: '',
    aadhaarNumber: '',
    mothersFullName: '',
    maritalStatus: '',
    nationality: 'Indian (Resident)',

    // Step 2: Address
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',

    // Step 3: Employment
    occupation: '',
    companyName: '',
    annualIncome: '',

    // Step 4: Documents
    identityProof: '',
    addressProof: '',
    incomeProof: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Go to next step
  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 5));
  };

  // Go to previous step
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit / Save Draft
  const handleSubmit = async (e, isDraft) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        mobileNumber: formData.mobileNumber,
        emailAddress: formData.emailAddress,
        panNumber: formData.panNumber,
        aadhaarNumber: formData.aadhaarNumber,
        mothersFullName: formData.mothersFullName,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality,
        draft: isDraft
      };

      await api.post('/applications', payload);

      setMessage({
        type: 'success',
        text: isDraft
          ? 'Draft saved successfully!'
          : 'Application submitted successfully!'
      });

      // Redirect after successful submission
      if (!isDraft) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.error ||
          'An error occurred while saving.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CustomerDetailsStep
            formData={formData}
            onChange={handleChange}
          />
        );

      case 2:
        return (
          <AddressDetailsStep
            formData={formData}
            onChange={handleChange}
          />
        );

      case 3:
        return (
          <EmploymentIncomeStep
            formData={formData}
            onChange={handleChange}
          />
        );

      case 4:
        return (
          <DocumentUploadStep
            formData={formData}
            onChange={handleChange}
            files={files}
            setFiles={setFiles}
          />
        );

      case 5:
        return (
          <ReviewSubmitStep
            formData={formData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          height: '70px',
          backgroundColor: 'var(--brand-white)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Logo />

        <nav style={{ marginLeft: '2rem' }}>
          <Link
            to="/applications/new"
            style={{
              fontWeight: '600',
              color: 'var(--brand-blue)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(4, 115, 234, 0.1)',
              borderRadius: '6px'
            }}
          >
            CC Applications
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Page Header */}
        <div className="create-app-header">
          <div className="breadcrumb">
            <Link
              to="/dashboard"
              className="breadcrumb-link"
            >
              CC Applications
            </Link>

            <span className="breadcrumb-separator">
              &gt;
            </span>

            <span>
              Create New Application
            </span>
          </div>

          <h1 className="page-title">
            New Credit Card Application
          </h1>
        </div>

        {/* Form Card */}
        <div className="form-card">

          {/* Wizard Progress Tracker */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e2e8f0',
              position: 'relative'
            }}
          >
            {/* Progress Line */}
            <div
              style={{
                position: 'absolute',
                top: '15px',
                left: '10%',
                right: '10%',
                height: '2px',
                backgroundColor: '#e2e8f0',
                zIndex: 0
              }}
            >
              <div
                style={{
                  width: `${(step - 1) * 25}%`,
                  height: '100%',
                  backgroundColor: 'var(--brand-blue)',
                  transition: 'width 0.3s'
                }}
              />
            </div>

            {/* Steps */}
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  zIndex: 1
                }}
              >
                {/* Step Circle */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor:
                      step >= s
                        ? 'var(--brand-blue)'
                        : 'white',
                    border: `2px solid ${
                      step >= s
                        ? 'var(--brand-blue)'
                        : '#cbd5e1'
                    }`,
                    color:
                      step >= s
                        ? 'white'
                        : '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {step > s ? (
                    <Check size={16} />
                  ) : (
                    s
                  )}
                </div>

                {/* Step Label */}
                <span
                  className="wizard-step-text"
                  style={{
                    fontSize: '12px',
                    color:
                      step >= s
                        ? 'var(--brand-dark)'
                        : '#94a3b8',
                    fontWeight:
                      step === s
                        ? 'bold'
                        : 'normal',
                    textAlign: 'center'
                  }}
                >
                  {s === 1
                    ? 'Customer Details'
                    : s === 2
                    ? 'Address Details'
                    : s === 3
                    ? 'Employment'
                    : s === 4
                    ? 'Documents'
                    : 'Review & Submit'}
                </span>
              </div>
            ))}
          </div>

          {/* Success / Error Message */}
          {message && (
            <div
              className={`form-message ${message.type}`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) =>
              step === 5
                ? handleSubmit(e, false)
                : e.preventDefault()
            }
          >
            {/* Current Step */}
            {renderStep()}

            {/* Form Actions */}
            <div
              className="form-actions"
              style={{
                justifyContent: 'space-between',
                marginTop: '2rem'
              }}
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1 || loading}
                className="btn-secondary"
                style={{
                  opacity: step === 1 ? 0 : 1
                }}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {/* Right Side Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem'
                }}
              >
                {/* Save Draft */}
                <button
                  type="button"
                  onClick={(e) =>
                    handleSubmit(e, true)
                  }
                  disabled={loading}
                  className="btn-secondary"
                >
                  Save Draft
                </button>

                {/* Next / Submit */}
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading
                      ? 'Submitting...'
                      : 'Submit Application'}

                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateApplication;
