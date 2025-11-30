"use client";

import { useState, useEffect } from "react";
import { AddKnowledgeBaseModal } from "../../../components/modals/knowledge/AddKnowledgeBaseModal";
import { KnowledgeBaseTable } from "../../../components/tables/KnowledgeBaseTable";
import { Button } from "../../../components/shadcn/ButtonWrapper";
import { SelectInput } from "../../../forms/form-controls/SelectInput";
import { TextInput } from "../../../forms/form-controls/TextInput";
import { Plus, Search } from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllQuestions,
  fetchAllAnswers,
  fetchAllDocuments,
  deleteAnswer,
} from "../../../lib/store/slices/knowledgeSlice";
import { fetchAllBusinesses } from "../../../lib/store/slices/businessSlice";

export default function KnowledgeBasePage() {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { questions, allAnswers, documents, loading, error } = useSelector(
    (state) => state.knowledge
  );
  const { businesses } = useSelector((state) => state.business);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState("all");
  const [filterInputType, setFilterInputType] = useState("all");
  const [filterRequired, setFilterRequired] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch questions and businesses on mount
  useEffect(() => {
    dispatch(fetchAllQuestions({ ordering: "order_index" }));
    if (businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch]);

  // Refetch questions when filters change
  useEffect(() => {
    const params = { ordering: "order_index" };
    if (filterInputType && filterInputType !== "all") {
      params.input_type = filterInputType;
    }
    if (filterRequired && filterRequired !== "all") {
      params.required = filterRequired === "true";
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    dispatch(fetchAllQuestions(params));
  }, [filterInputType, filterRequired, searchQuery, dispatch]);

  // Fetch answers and documents when business is selected
  useEffect(() => {
    if (selectedBusinessId && selectedBusinessId !== "all") {
      dispatch(fetchAllAnswers({ business: selectedBusinessId }));
      dispatch(fetchAllDocuments({ business: selectedBusinessId }));
    } else {
      dispatch(fetchAllAnswers({}));
      dispatch(fetchAllDocuments({}));
    }
  }, [selectedBusinessId, dispatch]);

  const handleSaveSuccess = (data) => {
    // Refresh questions, answers, and documents
    dispatch(fetchAllQuestions({ ordering: "order_index" }));
    if (selectedBusinessId && selectedBusinessId !== "all") {
      dispatch(fetchAllAnswers({ business: selectedBusinessId }));
      dispatch(fetchAllDocuments({ business: selectedBusinessId }));
    } else {
      dispatch(fetchAllAnswers({}));
      dispatch(fetchAllDocuments({}));
    }
  };

  const inputTypeOptions = [
    { value: "all", label: t("knowledge.allTypes") || "All Types" },
    { value: "text", label: t("knowledge.text") || "Text" },
    { value: "textarea", label: t("knowledge.textarea") || "Textarea" },
    { value: "boolean", label: t("knowledge.boolean") || "Boolean" },
  ];

  const requiredOptions = [
    { value: "all", label: t("knowledge.all") || "All" },
    { value: "true", label: t("knowledge.required") || "Required" },
    { value: "false", label: t("knowledge.optional") || "Optional" },
  ];

  const businessOptions = [
    { value: "all", label: t("knowledge.allBusinesses") || "All Businesses" },
    ...businesses.map((business) => ({
      value: String(business.id),
      label:
        locale === "ar" && business.name_ar
          ? business.name_ar
          : business.name_en || `Business #${business.id}`,
    })),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          isRTL && "sm:flex-row"
        )}
      >
        <div className={cn(isRTL && "text-left")}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("knowledge.pageTitle") || "Knowledge Base"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t("knowledge.description") ||
              "Answer questions and upload files for your business"}
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm sm:text-base h-10 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          {t("buttons.addKnowledgeBase") || "Add Knowledge Base"}
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg",
            isRTL && "sm:flex-row-reverse"
          )}
        >
          <SelectInput
            label={t("labels.business") || "Business"}
            name="business_filter"
            placeholder={t("placeholders.chooseBusiness") || "Choose business"}
            options={businessOptions}
            value={selectedBusinessId || "all"}
            onChange={(value) => {
              const businessValue = value === "all" || !value ? "all" : value;
              setSelectedBusinessId(businessValue);
            }}
            className="flex-1"
          />
          <SelectInput
            label={t("knowledge.inputType") || "Input Type"}
            name="input_type_filter"
            placeholder={t("knowledge.allTypes") || "All Types"}
            options={inputTypeOptions}
            value={filterInputType}
            onChange={(value) => setFilterInputType(value || "all")}
            className="flex-1"
          />
          <SelectInput
            label={t("knowledge.required") || "Required"}
            name="required_filter"
            placeholder={t("knowledge.all") || "All"}
            options={requiredOptions}
            value={filterRequired}
            onChange={(value) => setFilterRequired(value || "all")}
            className="flex-1"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {typeof error === "string"
            ? error
            : error?.detail || "An error occurred"}
        </div>
      )}

      {/* Loading State */}
      {loading && questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {t("messages.loading") || "Loading..."}
        </div>
      )}

      {/* Knowledge Base Table */}
      {!loading && (
        <KnowledgeBaseTable
          questions={questions}
          answers={allAnswers}
          documents={documents}
          businesses={businesses}
          onEditAnswer={() => {
            // Refresh answers after edit
            if (selectedBusinessId && selectedBusinessId !== "all") {
              dispatch(fetchAllAnswers({ business: selectedBusinessId }));
            } else {
              dispatch(fetchAllAnswers({}));
            }
          }}
          onDeleteAnswer={async (answerId) => {
            try {
              await dispatch(deleteAnswer(answerId)).unwrap();
              // Refresh answers after delete
              if (selectedBusinessId && selectedBusinessId !== "all") {
                dispatch(fetchAllAnswers({ business: selectedBusinessId }));
              } else {
                dispatch(fetchAllAnswers({}));
              }
            } catch (err) {
              alert(
                t("messages.deleteFailed") ||
                  "Failed to delete answer. Please try again."
              );
            }
          }}
        />
      )}

      {/* Empty State */}
      {!loading && questions.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          {t("messages.noQuestions") || "No questions found"}
        </div>
      )}

      {/* Add Knowledge Base Modal */}
      <AddKnowledgeBaseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSaveSuccess}
        businessId={
          selectedBusinessId && selectedBusinessId !== "all"
            ? selectedBusinessId
            : undefined
        }
      />
    </div>
  );
}
