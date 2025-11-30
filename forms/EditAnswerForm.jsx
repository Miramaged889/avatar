"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { TextareaInput } from "./form-controls/TextareaInput";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { useLocale } from "../components/utils/useLocale";
import { useDispatch } from "react-redux";
import { editAnswer } from "../lib/store/slices/knowledgeSlice";

export function EditAnswerForm({
  answerId,
  question,
  answer,
  onSuccess,
  onCancel,
}) {
  const { t, locale } = useLocale();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    answer_text: "",
    answer_boolean: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (answer) {
      setFormData({
        answer_text: answer.answer_text || "",
        answer_boolean:
          answer.answer_boolean !== null ? answer.answer_boolean : null,
      });
    }
  }, [answer]);

  const handleChange = (value) => {
    if (question.input_type === "boolean") {
      setFormData({
        answer_text: "",
        answer_boolean: value === "true",
      });
    } else {
      setFormData({
        answer_text: value,
        answer_boolean: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const answerData =
        question.input_type === "boolean"
          ? { answer_boolean: formData.answer_boolean }
          : { answer_text: formData.answer_text };

      await dispatch(
        editAnswer({
          answerId,
          answerData,
        })
      ).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      let errorMessage = t("messages.saveFailed") || "Failed to save";
      if (err?.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionLabel = () => {
    return locale === "ar" && question?.label_ar
      ? question.label_ar
      : question?.label_en || "";
  };

  const booleanOptions = [
    { value: "true", label: t("labels.yes") || "Yes" },
    { value: "false", label: t("labels.no") || "No" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {getQuestionLabel()}
        </h3>
        <p className="text-sm text-gray-500">
          {question?.input_type === "boolean"
            ? t("knowledge.boolean") || "Boolean"
            : question?.input_type === "textarea"
            ? t("knowledge.textarea") || "Textarea"
            : t("knowledge.text") || "Text"}
        </p>
      </div>

      {question?.input_type === "textarea" ? (
        <TextareaInput
          label={t("labels.answer") || "Answer"}
          name="answer_text"
          placeholder={t("placeholders.enterAnswer") || "Enter your answer"}
          value={formData.answer_text}
          onChange={(e) => handleChange(e.target.value)}
          required
          rows={6}
        />
      ) : question?.input_type === "boolean" ? (
        <SelectInput
          label={t("labels.answer") || "Answer"}
          name="answer_boolean"
          placeholder={t("placeholders.selectYesNo") || "Select Yes or No"}
          options={booleanOptions}
          value={
            formData.answer_boolean !== null
              ? String(formData.answer_boolean)
              : ""
          }
          onChange={(val) => handleChange(val)}
          required
        />
      ) : (
        <TextInput
          label={t("labels.answer") || "Answer"}
          name="answer_text"
          placeholder={t("placeholders.enterAnswer") || "Enter your answer"}
          value={formData.answer_text}
          onChange={(e) => handleChange(e.target.value)}
          required
        />
      )}

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="font-medium py-3"
            disabled={isSubmitting}
          >
            {t("buttons.cancel") || "Cancel"}
          </Button>
        )}
        <Button
          type="submit"
          variant="dark"
          className="font-medium py-3 ml-auto"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("buttons.saving") || "Saving..."
            : t("buttons.save") || "Save"}
        </Button>
      </div>
    </form>
  );
}
