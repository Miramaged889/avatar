"use client";

import { useState } from "react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";
import { File, Download, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { EditAnswerModal } from "../modals/knowledge/EditAnswerModal";

export function KnowledgeBaseTable({
  questions,
  answers,
  documents,
  businesses,
  onEditAnswer,
  onDeleteAnswer,
}) {
  const { t, isRTL, locale } = useLocale();
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getQuestionLabel = (question) => {
    return locale === "ar" && question.label_ar
      ? question.label_ar
      : question.label_en || "";
  };

  const getAnswerText = (questionId) => {
    const answer = answers.find((a) => a.question === questionId);
    if (!answer) return "-";

    if (answer.answer_boolean !== null) {
      return answer.answer_boolean
        ? t("labels.yes") || "Yes"
        : t("labels.no") || "No";
    }

    return answer.answer_text || "-";
  };

  const getBusinessName = (businessId) => {
    const business = businesses.find((b) => b.id === businessId);
    if (!business) return `Business #${businessId}`;

    return locale === "ar" && business.name_ar
      ? business.name_ar
      : business.name_en || `Business #${businessId}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (question, answer) => {
    setEditingAnswer({ question, answer });
    setIsEditModalOpen(true);
  };

  const handleDelete = (answer) => {
    if (
      confirm(
        t("messages.confirmDeleteAnswer") ||
          "Are you sure you want to delete this answer?"
      )
    ) {
      if (onDeleteAnswer) {
        onDeleteAnswer(answer.id);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingAnswer(null);
    if (onEditAnswer) {
      onEditAnswer();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Questions and Answers Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t("knowledge.questionsAndAnswers") || "Questions & Answers"}
        </h2>
        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t("messages.noQuestions") || "No questions found"}
            </p>
          ) : (
            questions.map((question) => {
              const answer = answers.find((a) => a.question === question.id);
              return (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {question.input_type}
                        </span>
                        {question.required && (
                          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                            {t("knowledge.required") || "Required"}
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        {getQuestionLabel(question)}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">
                          {t("table.answer") || "Answer"}:{" "}
                        </span>
                        <span>{getAnswerText(question.id)}</span>
                      </div>
                      {answer && (
                        <div className="text-xs text-gray-500 mt-1">
                          {t("table.business") || "Business"}:{" "}
                          {getBusinessName(answer.business)}
                        </div>
                      )}
                    </div>
                    {answer && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(question, answer)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          title={t("aria.editAnswer") || "Edit answer"}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(answer)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title={t("aria.deleteAnswer") || "Delete answer"}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Documents Section */}
      {documents && documents.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t("knowledge.documents") || "Documents"}
          </h2>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                      {doc.business && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                          {getBusinessName(doc.business)}
                        </span>
                      )}
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                      <span className="capitalize">{doc.file_type}</span>
                      <span>{formatDate(doc.created_at)}</span>
                      {doc.status && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded",
                            doc.status === "ready"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          )}
                        >
                          {doc.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.file_url && (
                    <>
                      <Link
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-primary-DEFAULT hover:bg-gray-100 rounded transition-colors"
                        title={t("aria.viewDocument") || "View document"}
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        href={doc.file_url}
                        download
                        className="p-2 text-gray-600 hover:text-primary-DEFAULT hover:bg-gray-100 rounded transition-colors"
                        title={
                          t("aria.downloadDocument") || "Download document"
                        }
                      >
                        <Download className="h-5 w-5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Answer Modal */}
      {editingAnswer && (
        <EditAnswerModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={handleEditSuccess}
          answerId={editingAnswer.answer?.id}
          question={editingAnswer.question}
          answer={editingAnswer.answer}
        />
      )}
    </div>
  );
}
