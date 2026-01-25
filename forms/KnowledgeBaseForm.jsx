"use client";

import { useState, useEffect } from "react";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import {
  Upload,
  X,
  File,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { cn } from "../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFiles,
} from "../lib/store/slices/knowledgeSlice";
import { fetchAllBusinesses } from "../lib/store/slices/businessSlice";

export function KnowledgeBaseForm({ businessId, onSuccess, onCancel }) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { files, loading } = useSelector(
    (state) => state.knowledge
  );
  const { businesses } = useSelector((state) => state.business);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    businessId ? String(businessId) : undefined
  );

  // Calculate total steps (removed step 2 - Answer Questions)
  const totalSteps = businessId ? 1 : 2; // If businessId is provided, only step 1 (Upload Files), otherwise step 1 (Select Business) and step 2 (Upload Files)
  const startStep = 1; // Always start from step 1

  // Fetch businesses on mount
  useEffect(() => {
    if (!businesses || businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch]);


  // Business options
  const businessOptions = (
    businesses && Array.isArray(businesses) ? businesses : []
  ).map((business) => ({
    value: String(business.id),
    label:
      locale === "ar" && business.name_ar
        ? business.name_ar
        : business.name_en || `Business #${business.id}`,
  }));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    // Allowed text file extensions
    const allowedExtensions = ['.txt', '.text', '.pdf'];
    const allowedMimeTypes = ['text/plain', 'text/txt', 'application/pdf'];
    
    // Filter and validate files
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach((file) => {
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      const fileType = file.type.toLowerCase();
      
      // Check if file is a text file
      const isValidExtension = allowedExtensions.includes(fileExtension);
      const isValidMimeType = allowedMimeTypes.includes(fileType) || fileType.startsWith('text/');
      
      if (isValidExtension || isValidMimeType) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    // Show error if any invalid files
    if (invalidFiles.length > 0) {
      alert(
        t("messages.invalidFileType") ||
          `The following files are not text files and cannot be uploaded:\n${invalidFiles.join('\n')}\n\nPlease upload only .txt files.`
      );
    }
    
    // Add only valid files
    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
    
    // Reset input to allow selecting the same file again if needed
    e.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const business = selectedBusinessId || businessId;
      if (!business) {
        alert(t("messages.selectBusiness") || "Please select a business");
        setIsSubmitting(false);
        return;
      }

      // Upload files - REQUIRED
      if (
        !selectedFiles ||
        !Array.isArray(selectedFiles) ||
        selectedFiles.length === 0
      ) {
        alert(
          t("messages.filesRequired") ||
            "Please upload at least one file before saving"
        );
        setIsSubmitting(false);
        return;
      }

      await dispatch(
        uploadFiles({ files: selectedFiles, businessId: parseInt(business) })
      ).unwrap();

      if (onSuccess) {
        onSuccess({ files: selectedFiles });
      }
    } catch (err) {
      // Better error handling
      let errorMessage = t("messages.saveFailed") || "Failed to save";

      if (err?.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === "object") {
          const errors = [];
          Object.keys(errorData).forEach((key) => {
            const fieldErrors = Array.isArray(errorData[key])
              ? errorData[key]
              : [errorData[key]];
            const errorText = fieldErrors
              .filter((e) => e !== null && e !== undefined)
              .join(", ");
            if (errorText) {
              errors.push(
                key === "non_field_errors" ? errorText : `${key}: ${errorText}`
              );
            }
          });
          errorMessage = errors.length > 0 ? errors.join("\n") : errorMessage;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData?.detail) {
          errorMessage = errorData.detail;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.detail) {
        errorMessage = err.detail;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize current step based on businessId
  useEffect(() => {
    setCurrentStep(1);
  }, [businessId]);

  // Step navigation handlers
  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !businessId && !selectedBusinessId) {
      alert(t("messages.selectBusiness") || "Please select a business");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > startStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step titles (removed step 2 - Answer Questions)
  const stepTitles = businessId
    ? [
        t("knowledge.step3Title") || "Upload Files",
      ]
    : [
        t("knowledge.step1Title") || "Select Business",
        t("knowledge.step3Title") || "Upload Files",
      ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stepper Indicator */}
      <div className="mb-8">
        <div className={cn("flex items-center justify-between mb-4", isRTL ? "flex-row" : "flex-row")}>
          {stepTitles.map((title, index) => {
            const stepNumber = businessId ? (index === 0 ? 1 : index + 1) : (index === 0 ? 1 : 2);
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const isLast = index === stepTitles.length - 1;

            return (
              <div key={stepNumber} className={cn("flex items-center flex-1", isRTL ? "flex-row" : "flex-row")}>
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      isCompleted
                        ? "bg-primary-default border-primary-default text-white"
                        : isActive
                        ? "bg-primary-dark border-primary-dark text-white"
                        : "bg-primary-dark border-primary-dark text-white"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold text-white">
                        {stepNumber}
                      </span>
                    )}
                  </div>
                  {/* Step Title */}
                  <div
                    className={cn(
                      "mt-2 text-sm font-medium text-center max-w-[120px]",
                      isActive || isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    )}
                  >
                    {title}
                  </div>
                </div>
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 -mt-5 transition-colors",
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Business Selection */}
        {currentStep === 1 && !businessId && (
          <div className="space-y-6">
            <div>
              <h2 className={cn("text-2xl font-bold text-gray-900 mb-2", isRTL ? "text-left" : "text-left")}>
                {t("knowledge.step1Title") || "Select Business"}
              </h2>
              <p className={cn("text-gray-600", isRTL ? "text-left" : "text-left")}>
                {t("knowledge.step1Description") ||
                  "Please select a business to continue"}
              </p>
            </div>
            <SelectInput
              label={t("labels.business") || "Business"}
              name="business_id"
              placeholder={
                !businesses || businesses.length === 0
                  ? t("messages.loading") || "Loading..."
                  : t("placeholders.chooseBusiness") || "Choose business"
              }
              options={businessOptions}
              value={selectedBusinessId}
              onChange={(value) => setSelectedBusinessId(value)}
              required
            />
          </div>
        )}

        {/* Step 2: File Upload (was Step 3, now Step 2 when businessId is provided, or Step 2 when businessId is not provided) */}
        {currentStep === (businessId ? 1 : 2) && (
          <div className="space-y-6">
            <div>
              <h2 className={cn("text-2xl font-bold text-gray-900 mb-2", isRTL ? "text-left" : "text-left")}>
                {t("knowledge.step3Title") || "Upload Files"}
              </h2>
              <p className={cn("text-gray-600", isRTL ? "text-left" : "text-left")}>
                {t("knowledge.step3Description") ||
                  "Upload text files only (.txt) (required)"}
              </p>
              <p className={cn("text-sm text-gray-500 mt-1", isRTL ? "text-left" : "text-left")}>
                {t("knowledge.step3FileTypeNote") ||
                  "Only .txt text files are allowed. Images and other file types are not permitted."}
              </p>
            </div>
            <div className="space-y-2">
              <label className={cn("block text-sm font-medium text-gray-700", isRTL ? "text-left" : "text-left")}>
                {t("labels.uploadFiles") || "Upload Files"}{" "}
                <span className="text-red-500">*</span>
                <span className={cn("text-gray-500 text-xs", isRTL ? "mr-1" : "ml-1")}>
                  ({t("labels.required") || "Required"})
                </span>
              </label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 transition-colors",
                  selectedFiles &&
                    Array.isArray(selectedFiles) &&
                    selectedFiles.length > 0
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                )}
              >
                <input
                  type="file"
                  multiple
                  accept=".txt,.text ,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="knowledge-files"
                />
                <label
                  htmlFor="knowledge-files"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <Upload
                    className={cn(
                      "h-10 w-10 transition-colors",
                      selectedFiles &&
                        Array.isArray(selectedFiles) &&
                        selectedFiles.length > 0
                        ? "text-green-500"
                        : "text-gray-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      selectedFiles &&
                        Array.isArray(selectedFiles) &&
                        selectedFiles.length > 0
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    )}
                  >
                    {selectedFiles &&
                    Array.isArray(selectedFiles) &&
                    selectedFiles.length > 0
                      ? `${selectedFiles.length} ${
                          t("messages.filesSelected") ||
                          "file(s) selected. Click to change."
                        }`
                      : t("messages.chooseFilesOrDrag") ||
                        "Choose files or drag and drop"}
                  </span>
                </label>
              </div>

              {/* Selected Files List */}
              {selectedFiles &&
              Array.isArray(selectedFiles) &&
              selectedFiles.length > 0 ? (
                <div className="space-y-2 mt-4">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className={cn("flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors", isRTL ? "flex-row-reverse" : "flex-row")}
                    >
                      <div className={cn("flex items-center gap-3 flex-1 min-w-0", isRTL ? "flex-row" : "flex-row")}>
                        <File className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title={t("buttons.remove") || "Remove"}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  {t("messages.noFilesSelected") ||
                    "No files selected. Please upload at least one file."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={cn("flex gap-3 pt-6 border-t border-gray-200 mt-1", isRTL ? "flex-row" : "flex-row")}>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="font-medium py-3 px-4 mt-2"
              disabled={isSubmitting || loading}
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>
          )}
          <div className={cn("flex gap-3", isRTL ? "mr-auto" : "ml-auto")}>
            {currentStep > startStep && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className={cn("font-medium py-3 flex items-center gap-2 px-4 mt-2", isRTL ? "flex-row" : "flex-row")}
                disabled={isSubmitting || loading}
              >
                <ChevronLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
                {t("buttons.previous") || "Previous"}
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                type="button"
                variant="dark"
                onClick={handleNext}
                className={cn("font-medium py-3 flex items-center gap-2 px-4 mt-2", isRTL ? "flex-row" : "flex-row")}
                disabled={isSubmitting || loading}
              >
                {t("buttons.next") || "Next"}
                <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="dark"
                className="font-medium py-3 px-4 mt-2"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading
                  ? t("buttons.saving") || "Saving..."
                  : t("buttons.save") || "Save"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
