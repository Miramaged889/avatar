"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { TextareaInput } from "./form-controls/TextareaInput";
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
  fetchAllQuestions,
  fetchQuestionDetails,
  editAnswer,
  createBulkAnswers,
  uploadFiles,
  setAnswer,
  fetchAllAnswers,
} from "../lib/store/slices/knowledgeSlice";
import { fetchAllBusinesses } from "../lib/store/slices/businessSlice";

export function KnowledgeBaseForm({ businessId, onSuccess, onCancel }) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { questions, answers, allAnswers, files, loading } = useSelector(
    (state) => state.knowledge
  );
  const { businesses } = useSelector((state) => state.business);

  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    businessId ? String(businessId) : undefined
  );

  // Calculate total steps
  const totalSteps = businessId ? 2 : 3; // If businessId is provided, skip step 1
  const startStep = businessId ? 2 : 1; // Start from step 1 or 2

  // Fetch businesses and questions on mount
  useEffect(() => {
    if (!businesses || businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
    dispatch(fetchAllQuestions({ ordering: "order_index" }));
  }, [dispatch]);

  // Fetch existing answers when business is selected
  useEffect(() => {
    const business = selectedBusinessId || businessId;
    if (business) {
      dispatch(fetchAllAnswers({ business: String(business) }));
    }
  }, [selectedBusinessId, businessId, dispatch]);

  // Initialize form data from questions and existing answers
  // This prevents uncontrolled/controlled switching in Select components
  useEffect(() => {
    if (questions && Array.isArray(questions) && questions.length > 0) {
      const business = selectedBusinessId || businessId;
      const initialData = {};

      questions.forEach((question) => {
        // Find existing answer for this question and business
        const existingAnswer =
          Array.isArray(allAnswers) && business
            ? allAnswers.find(
                (a) =>
                  a.question === question.id &&
                  String(a.business) === String(business)
              )
            : answers[question.id];

        if (existingAnswer) {
          if (question.input_type === "boolean") {
            initialData[question.id] = existingAnswer.answer_boolean
              ? "true"
              : "false";
          } else {
            initialData[question.id] = existingAnswer.answer_text || "";
          }
        } else {
          // Initialize empty values - use empty string for all types to ensure controlled state
          // SelectInput will handle conversion internally
          initialData[question.id] = "";
        }
      });

      // Update formData only if it's empty or structure has changed
      const formDataKeys = Object.keys(formData).sort();
      const initialDataKeys = Object.keys(initialData).sort();
      const keysMatch =
        formDataKeys.length === initialDataKeys.length &&
        formDataKeys.length > 0 &&
        formDataKeys.every((key, idx) => key === initialDataKeys[idx]);

      if (!keysMatch) {
        setFormData(initialData);
      }
    }
  }, [questions, allAnswers, answers, selectedBusinessId, businessId]);

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

  const handleChange = (questionId, value) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
    // Update Redux store immediately
    dispatch(
      setAnswer({
        questionId,
        answer: {
          question: questionId,
          answer_text: value,
          answer_boolean: null,
        },
      })
    );
  };

  const handleBooleanChange = (questionId, value) => {
    const boolValue = value === "true";
    setFormData((prev) => ({ ...prev, [questionId]: value }));
    dispatch(
      setAnswer({
        questionId,
        answer: {
          question: questionId,
          answer_text: "",
          answer_boolean: boolValue,
        },
      })
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getQuestionLabel = (question) => {
    return locale === "ar" && question.label_ar
      ? question.label_ar
      : question.label_en || "";
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

      // Prepare answers array for Bulk Create Answers API
      // POST /api/dashboard/knowledge/answers/
      // Format: { "business": "1", "answers": [{"question": 1, "answer_text": "..."}, ...] }
      const answersArray = questions
        .map((question) => {
          const value = formData[question.id];

          // Skip empty optional fields
          if (
            !question.required &&
            (value === undefined || value === null || value === "")
          ) {
            return null;
          }

          if (question.input_type === "boolean") {
            // Boolean questions - only include if value is set
            if (value !== "true" && value !== "false") {
              return null;
            }
            return {
              question: question.id,
              answer_boolean: value === "true",
            };
          } else {
            // Text/Textarea questions - only include if has value
            const textValue = value ? String(value).trim() : "";
            if (!textValue) {
              return null;
            }
            return {
              question: question.id,
              answer_text: textValue,
            };
          }
        })
        .filter((answer) => answer !== null); // Remove null entries

      // Upload files - REQUIRED in step 3
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

      // Handle answers - Update existing ones or create new ones
      if (
        answersArray &&
        Array.isArray(answersArray) &&
        answersArray.length > 0
      ) {
        // Get answers for this business from allAnswers
        const businessAnswers = Array.isArray(allAnswers)
          ? allAnswers.filter((a) => String(a.business) === String(business))
          : [];

        // Separate answers into existing (to update) and new (to create)
        const answersToUpdate = [];
        const answersToCreate = [];

        answersArray.forEach((answerData) => {
          // Find existing answer for this question and business
          const existingAnswer = businessAnswers.find(
            (a) => a.question === answerData.question
          );

          if (existingAnswer && existingAnswer.id) {
            // Answer exists - prepare for update (PATCH)
            const updateData =
              answerData.answer_boolean !== undefined
                ? { answer_boolean: answerData.answer_boolean }
                : { answer_text: answerData.answer_text };
            answersToUpdate.push({
              answerId: existingAnswer.id,
              answerData: updateData,
            });
          } else {
            // Answer doesn't exist - prepare for create (POST)
            answersToCreate.push(answerData);
          }
        });

        // Update existing answers using PATCH
        for (const { answerId, answerData } of answersToUpdate) {
          await dispatch(editAnswer({ answerId, answerData })).unwrap();
        }

        // Create new answers if any using POST
        if (answersToCreate.length > 0) {
          await dispatch(
            createBulkAnswers({
              business: String(business),
              answers: answersToCreate,
            })
          ).unwrap();
        }

        // Refresh answers after update/create
        dispatch(fetchAllAnswers({ business: String(business) }));
      }

      if (onSuccess) {
        onSuccess({ answers: answersArray, files: selectedFiles });
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

  const booleanOptions = [
    { value: "true", label: t("labels.yes") || "Yes" },
    { value: "false", label: t("labels.no") || "No" },
  ];

  // Initialize current step based on businessId
  useEffect(() => {
    setCurrentStep(businessId ? 2 : 1);
  }, [businessId]);

  // Step navigation handlers
  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !selectedBusinessId) {
      alert(t("messages.selectBusiness") || "Please select a business");
      return;
    }
    // Validate step 2 (answers) - at least one answer should be provided
    if (currentStep === 2 || (businessId && currentStep === 1)) {
      const hasAtLeastOneAnswer = questions.some((question) => {
        const value = formData[question.id];
        if (!value || value === "") return false;
        if (question.input_type === "boolean") {
          return value === "true" || value === "false";
        }
        return String(value).trim().length > 0;
      });

      if (!hasAtLeastOneAnswer) {
        alert(
          t("messages.answerAtLeastOne") ||
            "Please answer at least one question before proceeding"
        );
        return;
      }
    }
    // Validate step 3 (files) - files are required
    if (currentStep === (businessId ? 2 : 2) && totalSteps === 3) {
      const nextStep = currentStep + 1;
      if (nextStep === 3) {
        // This is the last step before submission, files will be validated on submit
      }
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

  // Step titles
  const stepTitles = businessId
    ? [
        t("knowledge.step2Title") || "Answer Questions",
        t("knowledge.step3Title") || "Upload Files",
      ]
    : [
        t("knowledge.step1Title") || "Select Business",
        t("knowledge.step2Title") || "Answer Questions",
        t("knowledge.step3Title") || "Upload Files",
      ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stepper Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {stepTitles.map((title, index) => {
            const stepNumber = businessId ? index + 2 : index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const isLast = index === stepTitles.length - 1;

            return (
              <div key={stepNumber} className="flex items-center flex-1">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("knowledge.step1Title") || "Select Business"}
              </h2>
              <p className="text-gray-600">
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

        {/* Step 2: Answer Questions */}
        {currentStep === (businessId ? 1 : 2) && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("knowledge.step2Title") || "Answer Questions"}
              </h2>
              <p className="text-gray-600">
                {t("knowledge.step2Description") ||
                  "Please answer the following questions"}
              </p>
            </div>
            {questions.map((question) => {
              const questionLabel = getQuestionLabel(question);
              // Ensure value is always defined - use empty string as fallback
              // SelectInput will handle the conversion to empty string for controlled state
              const value = formData.hasOwnProperty(question.id)
                ? formData[question.id]
                : "";

              return (
                <div key={question.id} className="space-y-2">
                  {question.input_type === "textarea" ? (
                    <TextareaInput
                      label={questionLabel}
                      name={`question-${question.id}`}
                      placeholder={
                        t("placeholders.enterAnswer") || "Enter your answer"
                      }
                      value={value}
                      onChange={(e) =>
                        handleChange(question.id, e.target.value)
                      }
                      required={question.required}
                      rows={6}
                    />
                  ) : question.input_type === "boolean" ? (
                    <SelectInput
                      label={questionLabel}
                      name={`question-${question.id}`}
                      placeholder={
                        t("placeholders.selectYesNo") || "Select Yes or No"
                      }
                      options={booleanOptions}
                      value={value}
                      onChange={(val) => handleBooleanChange(question.id, val)}
                      required={question.required}
                    />
                  ) : (
                    <TextInput
                      label={questionLabel}
                      name={`question-${question.id}`}
                      placeholder={
                        t("placeholders.enterAnswer") || "Enter your answer"
                      }
                      value={value}
                      onChange={(e) =>
                        handleChange(question.id, e.target.value)
                      }
                      required={question.required}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Step 3: File Upload */}
        {currentStep === (businessId ? 2 : 3) && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("knowledge.step3Title") || "Upload Files"}
              </h2>
              <p className="text-gray-600">
                {t("knowledge.step3Description") ||
                  "Upload relevant files (required)"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-left">
                {t("labels.uploadFiles") || "Upload Files"}{" "}
                <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">
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
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <File className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
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
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="font-medium py-3"
              disabled={isSubmitting || loading}
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            {currentStep > startStep && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="font-medium py-3 flex items-center gap-2"
                disabled={isSubmitting || loading}
              >
                <ChevronLeft className="w-4 h-4" />
                {t("buttons.previous") || "Previous"}
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                type="button"
                variant="dark"
                onClick={handleNext}
                className="font-medium py-3 flex items-center gap-2"
                disabled={isSubmitting || loading}
              >
                {t("buttons.next") || "Next"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="dark"
                className="font-medium py-3"
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
