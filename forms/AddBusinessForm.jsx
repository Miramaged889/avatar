"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { TextareaInput } from "./form-controls/TextareaInput";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { cn } from "../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import {
  addBusiness,
  editBusiness,
  fetchBusinessDetails,
  fetchAllBusinesses,
} from "../lib/store/slices/businessSlice";
import { addClient, fetchAllClients } from "../lib/store/slices/clientSlice";
import { addAdmin, fetchAllAdmins } from "../lib/store/slices/adminSlice";
import { addPayment, fetchAllPayments } from "../lib/store/slices/paymentSlice";

const categories = [
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "manufacturing", label: "Manufacturing" },
];

export function AddBusinessForm({ businessId = null, onSuccess, onCancel }) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { currentBusiness, loading } = useSelector((state) => state.business);
  const { admins } = useSelector((state) => state.admin);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBusinessId, setCreatedBusinessId] = useState(null);

  // Business form data
  const [businessData, setBusinessData] = useState({
    name_en: "",
    name_ar: "",
    legal_name_en: "",
    legal_name_ar: "",
    tax_number: "",
    commercial_register_number: "",
    domain_url: "",
    country: "",
    city: "",
    address: "",
    category: "",
    max_admins: 10,
  });

  // Clients form data (array for multiple clients)
  const [clientsData, setClientsData] = useState([
    { name: "", email: "", phone: "" },
  ]);

  // Admins form data (array for multiple admins)
  const [adminsData, setAdminsData] = useState([
    { full_name: "", email: "", password: "" },
  ]);

  // Payments form data (array for multiple payments)
  const [paymentsData, setPaymentsData] = useState([
    { amount_paid: "", payment_method: "", payment_date: "", note: "" },
  ]);

  const [maxAdmins, setMaxAdmins] = useState(null);
  const [currentAdminsCount, setCurrentAdminsCount] = useState(0);

  const totalSteps = businessId ? 1 : 4; // If editing, only show business form

  // Load business data if editing
  useEffect(() => {
    if (businessId) {
      if (!currentBusiness || currentBusiness.id !== businessId) {
        dispatch(fetchBusinessDetails(businessId));
      }
    }
  }, [businessId, dispatch]);

  // Update form when business data is loaded
  useEffect(() => {
    if (
      businessId &&
      currentBusiness &&
      String(currentBusiness.id) === String(businessId)
    ) {
      setBusinessData({
        name_en: currentBusiness.name_en || "",
        name_ar: currentBusiness.name_ar || "",
        legal_name_en: currentBusiness.legal_name_en || "",
        legal_name_ar: currentBusiness.legal_name_ar || "",
        tax_number: currentBusiness.tax_number || "",
        commercial_register_number:
          currentBusiness.commercial_register_number || "",
        domain_url: currentBusiness.domain_url || "",
        country: currentBusiness.country || "",
        city: currentBusiness.city || "",
        address: currentBusiness.address || "",
        category: currentBusiness.category || "",
        max_admins: currentBusiness.max_admins || 10,
      });
      setMaxAdmins(currentBusiness.max_admins || null);
    }
  }, [businessId, currentBusiness]);

  // Fetch clients when business is created and we're on step 2
  useEffect(() => {
    if (createdBusinessId && currentStep === 2) {
      dispatch(fetchAllClients({ business_id: createdBusinessId }));
    }
  }, [createdBusinessId, currentStep, dispatch]);

  // Fetch admins count when business is created or when max_admins changes
  useEffect(() => {
    if (createdBusinessId && businessData.max_admins) {
      dispatch(fetchAllAdmins({ business: createdBusinessId }));
      setMaxAdmins(businessData.max_admins);
    }
  }, [createdBusinessId, businessData.max_admins, dispatch]);

  // Calculate current admins count
  useEffect(() => {
    if (createdBusinessId && admins.length > 0) {
      const count = admins.filter(
        (admin) => admin.business === Number(createdBusinessId)
      ).length;
      setCurrentAdminsCount(count);
    }
  }, [createdBusinessId, admins]);

  // Fetch payments when business is created and we're on step 4
  useEffect(() => {
    if (createdBusinessId && currentStep === 4) {
      dispatch(fetchAllPayments({ business: createdBusinessId }));
    }
  }, [createdBusinessId, currentStep, dispatch]);

  const handleBusinessChange = (field, value) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClientChange = (index, field, value) => {
    setClientsData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdminChange = (index, field, value) => {
    setAdminsData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addClientRow = () => {
    setClientsData((prev) => [...prev, { name: "", email: "", phone: "" }]);
  };

  const removeClientRow = (index) => {
    setClientsData((prev) => prev.filter((_, i) => i !== index));
  };

  const addAdminRow = () => {
    setAdminsData((prev) => [
      ...prev,
      { full_name: "", email: "", password: "" },
    ]);
  };

  const removeAdminRow = (index) => {
    setAdminsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (index, field, value) => {
    setPaymentsData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addPaymentRow = () => {
    setPaymentsData((prev) => [
      ...prev,
      { amount_paid: "", payment_method: "", payment_date: "", note: "" },
    ]);
  };

  const removePaymentRow = (index) => {
    setPaymentsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate business data - API requires at least name_en
      if (!businessData.name_en) {
        alert(
          t("messages.fillRequiredFields") || "Please fill all required fields"
        );
        return;
      }

      // If editing, save business and finish
      if (businessId) {
        await handleBusinessSubmit();
        return;
      }

      // If creating, save business first, then move to next step
      setIsSubmitting(true);
      try {
        // Create the business
        const createResult = await dispatch(addBusiness(businessData)).unwrap();

        // Check if API response includes the id
        let businessId = null;
        if (createResult && createResult.id) {
          businessId = createResult.id;
        } else {
          // Wait a bit to ensure the business is saved in the database
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Since API doesn't return id in response, we need to fetch the business list
          // and find the newly created business by matching name_en and name_ar
          const businessesResult = await dispatch(
            fetchAllBusinesses()
          ).unwrap();
          const businesses = Array.isArray(businessesResult)
            ? businessesResult
            : businessesResult?.results || [];

          // Find the newly created business by matching name_en and name_ar
          // Also match other unique fields to ensure we get the right business
          const newBusiness = businesses.find(
            (b) =>
              b.name_en === businessData.name_en &&
              b.name_ar === businessData.name_ar &&
              (businessData.tax_number
                ? b.tax_number === businessData.tax_number
                : true) &&
              (businessData.commercial_register_number
                ? b.commercial_register_number ===
                  businessData.commercial_register_number
                : true)
          );

          if (newBusiness && newBusiness.id) {
            businessId = newBusiness.id;
          } else if (businesses.length > 0) {
            // Fallback: Sort by created_at descending and take the first one
            // that matches name_en (most recent with same name)
            const sortedBusinesses = [...businesses]
              .filter(
                (b) =>
                  b.name_en === businessData.name_en &&
                  (!businessData.name_ar || b.name_ar === businessData.name_ar)
              )
              .sort((a, b) => {
                const dateA = new Date(a.created_at || 0);
                const dateB = new Date(b.created_at || 0);
                return dateB - dateA;
              });

            if (sortedBusinesses[0] && sortedBusinesses[0].id) {
              businessId = sortedBusinesses[0].id;
            } else {
              // Last resort: take the most recently created business
              const allSorted = [...businesses].sort((a, b) => {
                const dateA = new Date(a.created_at || 0);
                const dateB = new Date(b.created_at || 0);
                return dateB - dateA;
              });
              if (allSorted[0] && allSorted[0].id) {
                businessId = allSorted[0].id;
              }
            }
          }
        }

        if (!businessId) {
          throw new Error(
            t("messages.businessIdNotFound") ||
              "Could not find the created business. Please try again."
          );
        }

        // Ensure businessId is a number and store it for use in later steps
        const businessIdNum = Number(businessId);
        if (isNaN(businessIdNum)) {
          throw new Error("Business ID is not a valid number");
        }

        // Store business ID from step 1 to use in POST requests for clients, admins, and payments
        setCreatedBusinessId(businessIdNum);
        setCurrentStep(2);
      } catch (err) {
        console.error("Error creating business:", err);
        const errorMessage =
          err?.message ||
          err?.detail ||
          (typeof err === "string" ? err : JSON.stringify(err)) ||
          t("messages.saveFailed") ||
          "Failed to save business";
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 2) {
      // Validate that business was created before moving to admins step
      if (!createdBusinessId) {
        alert(
          t("messages.businessNotCreated") || "Business must be created first"
        );
        return;
      }
      // Validate clients (optional step - can skip)
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate that business was created before moving to payments step
      if (!createdBusinessId) {
        alert(
          t("messages.businessNotCreated") || "Business must be created first"
        );
        return;
      }
      // Validate admins (optional step - can skip)
      setCurrentStep(4);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBusinessSubmit = async () => {
    if (businessId) {
      // Update existing business
      setIsSubmitting(true);
      try {
        // Prepare data - API requires at least name_en
        // Send all fields that have values
        const submitData = {
          name_en: businessData.name_en, // Required
          ...(businessData.name_ar !== undefined &&
            businessData.name_ar !== null &&
            businessData.name_ar !== "" && { name_ar: businessData.name_ar }),
          ...(businessData.legal_name_en !== undefined &&
            businessData.legal_name_en !== null &&
            businessData.legal_name_en !== "" && {
              legal_name_en: businessData.legal_name_en,
            }),
          ...(businessData.legal_name_ar !== undefined &&
            businessData.legal_name_ar !== null &&
            businessData.legal_name_ar !== "" && {
              legal_name_ar: businessData.legal_name_ar,
            }),
          ...(businessData.tax_number !== undefined &&
            businessData.tax_number !== null &&
            businessData.tax_number !== "" && {
              tax_number: businessData.tax_number,
            }),
          ...(businessData.commercial_register_number !== undefined &&
            businessData.commercial_register_number !== null &&
            businessData.commercial_register_number !== "" && {
              commercial_register_number:
                businessData.commercial_register_number,
            }),
          ...(businessData.domain_url !== undefined &&
            businessData.domain_url !== null &&
            businessData.domain_url !== "" && {
              domain_url: businessData.domain_url,
            }),
          ...(businessData.country !== undefined &&
            businessData.country !== null &&
            businessData.country !== "" && { country: businessData.country }),
          ...(businessData.city !== undefined &&
            businessData.city !== null &&
            businessData.city !== "" && { city: businessData.city }),
          ...(businessData.address !== undefined &&
            businessData.address !== null &&
            businessData.address !== "" && { address: businessData.address }),
          ...(businessData.category !== undefined &&
            businessData.category !== null &&
            businessData.category !== "" && {
              category: businessData.category,
            }),
          ...(businessData.max_admins !== undefined &&
            businessData.max_admins !== null && {
              max_admins: businessData.max_admins,
            }),
        };

        const result = await dispatch(
          editBusiness({ businessId, businessData: submitData })
        ).unwrap();

        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        console.error("Error updating business:", err);
        const errorMessage =
          err?.message ||
          err?.detail ||
          (typeof err === "string" ? err : JSON.stringify(err)) ||
          t("messages.saveFailed") ||
          "Failed to update business";
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFinalSubmit = async () => {
    if (!createdBusinessId) {
      alert(
        t("messages.businessNotCreated") || "Business must be created first"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const businessIdNum = Number(createdBusinessId);

      if (isNaN(businessIdNum)) {
        throw new Error("Invalid business ID");
      }

      // Save all clients - Use stored business ID from step 1
      const validClients = clientsData.filter(
        (client) => client.name && client.email && client.phone
      );

      const clientPromises = validClients.map((client) => {
        const clientData = {
          name: client.name,
          email: client.email,
          phone: client.phone,
          business_id: businessIdNum, // Stored business ID from step 1
        };
        return dispatch(addClient(clientData)).unwrap();
      });

      // Save all admins - Use stored business ID from step 1
      const validAdmins = adminsData.filter(
        (admin) => admin.full_name && admin.email && admin.password
      );

      const adminPromises = validAdmins.map((admin) => {
        const adminData = {
          business: businessIdNum, // Stored business ID from step 1
          full_name: admin.full_name,
          email: admin.email,
          password: admin.password,
        };
        return dispatch(addAdmin(adminData)).unwrap();
      });

      // Save all payments - Use stored business ID from step 1
      const validPayments = paymentsData.filter(
        (payment) =>
          payment.amount_paid && payment.payment_method && payment.payment_date
      );

      const paymentPromises = validPayments.map((payment) => {
        // Use stored business ID from step 1
        if (isNaN(businessIdNum)) {
          throw new Error("Invalid business ID for payment");
        }

        const paymentData = {
          business_id: businessIdNum, // Stored business ID from step 1
          amount_paid: parseFloat(payment.amount_paid) || 0,
          payment_method: payment.payment_method,
          payment_date: payment.payment_date,
          note: payment.note || "",
        };

        return dispatch(addPayment(paymentData)).unwrap();
      });

      const results = await Promise.all([
        ...clientPromises,
        ...adminPromises,
        ...paymentPromises,
      ]);

      if (onSuccess) {
        onSuccess({ id: createdBusinessId });
      }
    } catch (err) {
      console.error("Error saving clients/admins:", err);
      alert(err?.message || t("messages.saveFailed") || "Failed to save data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = businessId
    ? [t("business.step1Title") || "Business Information"]
    : [
        t("business.step1Title") || "Business Information",
        t("business.step2Title") || "Add Clients",
        t("business.step3Title") || "Add Admins",
        t("business.step4Title") || "Add Payments",
      ];

  return (
    <div className="w-full max-w-4xl mx-auto px-1">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {businessId
                ? t("modals.editBusiness") || "Edit Business"
                : t("modals.addBusiness") || "Add Business"}
            </h2>
            <p className="text-sm text-gray-500">
              {businessId
                ? t("modals.editBusinessDescription") ||
                  "Update business information"
                : t("modals.addBusinessDescription") ||
                  "Fill the information below to add a new business"}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      {!businessId && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              const isLast = index === stepTitles.length - 1;

              return (
                <div key={stepNumber} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                        isCompleted
                          ? "bg-primary-DEFAULT border-primary-DEFAULT text-white"
                          : isActive
                          ? "bg-primary-dark border-primary-dark text-white"
                          : "bg-gray-200 border-gray-300 text-gray-500"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <span className="font-semibold">{stepNumber}</span>
                      )}
                    </div>
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
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // If editing, always use handleBusinessSubmit
          if (businessId) {
            handleBusinessSubmit();
          } else if (currentStep === totalSteps) {
            handleFinalSubmit();
          } else {
            handleNext();
          }
        }}
        className="space-y-6"
      >
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="space-y-6 pb-4">
            {/* Name - English */}
            <div className="space-y-4">
              <TextInput
                label={t("labels.nameEn") || "Name (English)"}
                name="name_en"
                placeholder={
                  t("placeholders.businessNameEn") ||
                  "Enter business name in English"
                }
                value={businessData.name_en}
                onChange={(e) =>
                  handleBusinessChange("name_en", e.target.value)
                }
                required
              />

              {/* Name - Arabic */}
              <TextInput
                label={t("labels.nameAr") || "Name (Arabic)"}
                name="name_ar"
                placeholder={
                  t("placeholders.businessNameAr") ||
                  "Enter business name in Arabic"
                }
                value={businessData.name_ar}
                onChange={(e) =>
                  handleBusinessChange("name_ar", e.target.value)
                }
                required
              />

              {/* Legal Name - English */}
              <TextInput
                label={t("labels.legalNameEn") || "Legal Name (English)"}
                name="legal_name_en"
                placeholder={
                  t("placeholders.legalNameEn") || "Enter legal name in English"
                }
                value={businessData.legal_name_en}
                onChange={(e) =>
                  handleBusinessChange("legal_name_en", e.target.value)
                }
              />

              {/* Legal Name - Arabic */}
              <TextInput
                label={t("labels.legalNameAr") || "Legal Name (Arabic)"}
                name="legal_name_ar"
                placeholder={
                  t("placeholders.legalNameAr") || "Enter legal name in Arabic"
                }
                value={businessData.legal_name_ar}
                onChange={(e) =>
                  handleBusinessChange("legal_name_ar", e.target.value)
                }
              />

              {/* Tax Number and Commercial Register Number */}
              <div className="flex gap-4 pt-2">
                <div className="flex-1">
                  <TextInput
                    label={t("labels.taxNumber") || "Tax Number"}
                    name="tax_number"
                    placeholder={
                      t("placeholders.taxNumber") || "Enter tax number"
                    }
                    value={businessData.tax_number}
                    onChange={(e) =>
                      handleBusinessChange("tax_number", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    label={
                      t("labels.commercialRegister") ||
                      "Commercial Register Number"
                    }
                    name="commercial_register_number"
                    placeholder={
                      t("placeholders.commercialRegister") ||
                      "Enter commercial register number"
                    }
                    value={businessData.commercial_register_number}
                    onChange={(e) =>
                      handleBusinessChange(
                        "commercial_register_number",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* Domain URL */}
              <TextInput
                label={t("labels.domainUrl") || "Domain URL"}
                name="domain_url"
                type="url"
                placeholder={
                  t("placeholders.domainUrl") || "https://www.example.com"
                }
                value={businessData.domain_url}
                onChange={(e) =>
                  handleBusinessChange("domain_url", e.target.value)
                }
              />

              {/* Country and City */}
              <div className="flex gap-4 pt-2">
                <div className="flex-1">
                  <TextInput
                    label={t("labels.country") || "Country"}
                    name="country"
                    placeholder={t("placeholders.country") || "Enter country"}
                    value={businessData.country}
                    onChange={(e) =>
                      handleBusinessChange("country", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    label={t("labels.city") || "City"}
                    name="city"
                    placeholder={t("placeholders.city") || "Enter city"}
                    value={businessData.city}
                    onChange={(e) =>
                      handleBusinessChange("city", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Address */}
              <TextInput
                label={t("labels.address") || "Address"}
                name="address"
                placeholder={t("placeholders.address") || "Enter full address"}
                value={businessData.address}
                onChange={(e) =>
                  handleBusinessChange("address", e.target.value)
                }
              />

              {/* Category and Max Admins */}
              <div className="flex gap-4 pt-2">
                <div className="flex-1">
                  <SelectInput
                    label={t("labels.category") || "Category"}
                    name="category"
                    placeholder={
                      t("placeholders.chooseCategory") || "Choose category"
                    }
                    options={categories.map((cat) => ({
                      value: cat.value,
                      label: t(`business.categories.${cat.value}`) || cat.label,
                    }))}
                    value={businessData.category}
                    onChange={(value) =>
                      handleBusinessChange("category", value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    <label
                      htmlFor="max_admins"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      {t("labels.maxAdmins") || "Max Admins"}
                    </label>
                    <input
                      id="max_admins"
                      name="max_admins"
                      type="number"
                      min="1"
                      max="100"
                      value={businessData.max_admins}
                      onChange={(e) => {
                        const v = e.target.value;
                        const num = Math.max(1, Math.min(100, Number(v || 1)));
                        handleBusinessChange(
                          "max_admins",
                          isNaN(num) ? 1 : num
                        );
                      }}
                      placeholder={
                        t("placeholders.maxAdmins") || "Enter max admins"
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Add Clients */}
        {currentStep === 2 && !businessId && (
          <div className="space-y-6 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("business.step2Title") || "Add Clients"}
              </h3>
              <p className="text-sm text-gray-500">
                {t("business.step2Description") ||
                  "Add clients for this business (optional)"}
              </p>
              {createdBusinessId && (
                <p className="text-xs text-gray-600 mt-2">
                  {t("business.businessIdInfo", {
                    id: createdBusinessId,
                  }) ||
                    `Business ID: ${createdBusinessId} - Clients will be added to this business`}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {clientsData.map((client, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-700">
                      {t("business.client") || "Client"} {index + 1}
                    </h4>
                    {clientsData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeClientRow(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        {t("buttons.remove") || "Remove"}
                      </button>
                    )}
                  </div>

                  <TextInput
                    label={t("labels.clientName") || "Client Name"}
                    name={`client_name_${index}`}
                    placeholder={
                      t("placeholders.clientName") || "Enter client name"
                    }
                    value={client.name}
                    onChange={(e) =>
                      handleClientChange(index, "name", e.target.value)
                    }
                  />

                  <TextInput
                    label={t("labels.email") || "Email"}
                    name={`client_email_${index}`}
                    type="email"
                    placeholder={
                      t("placeholders.email") || "Enter email address"
                    }
                    value={client.email}
                    onChange={(e) =>
                      handleClientChange(index, "email", e.target.value)
                    }
                  />

                  <TextInput
                    label={t("labels.phone") || "Phone"}
                    name={`client_phone_${index}`}
                    type="tel"
                    placeholder={
                      t("placeholders.phoneExample") || "Enter phone number"
                    }
                    value={client.phone}
                    onChange={(e) =>
                      handleClientChange(index, "phone", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addClientRow}
              className="w-full"
            >
              {t("buttons.addClient") || "Add Another Client"}
            </Button>
          </div>
        )}

        {/* Step 3: Add Admins */}
        {currentStep === 3 && !businessId && (
          <div className="space-y-6 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("business.step3Title") || "Add Admins"}
              </h3>
              <p className="text-sm text-gray-500">
                {t("business.step3Description") ||
                  "Add admins for this business (optional)"}
              </p>
              {createdBusinessId && (
                <p className="text-xs text-gray-600 mt-2">
                  {t("business.businessIdInfo", {
                    id: createdBusinessId,
                  }) ||
                    `Business ID: ${createdBusinessId} - Admins will be added to this business`}
                </p>
              )}
              {maxAdmins !== null && (
                <p className="text-xs text-gray-600 mt-2">
                  {t("admin.maxAdminsInfo", {
                    max: maxAdmins,
                    current: currentAdminsCount,
                    remaining:
                      maxAdmins - currentAdminsCount - adminsData.length,
                  }) ||
                    `Max admins: ${maxAdmins}, Current: ${currentAdminsCount}, Remaining: ${
                      maxAdmins - currentAdminsCount - adminsData.length
                    }`}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {adminsData.map((admin, index) => {
                const canAddMore =
                  maxAdmins === null ||
                  currentAdminsCount + adminsData.length <= maxAdmins;
                const isDisabled =
                  !canAddMore && index >= maxAdmins - currentAdminsCount;

                return (
                  <div
                    key={index}
                    className={cn(
                      "border rounded-lg p-4 space-y-4",
                      isDisabled
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">
                        {t("business.admin") || "Admin"} {index + 1}
                      </h4>
                      {adminsData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAdminRow(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          {t("buttons.remove") || "Remove"}
                        </button>
                      )}
                    </div>

                    {isDisabled && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">
                        {t("messages.maxAdminsReached", { max: maxAdmins }) ||
                          `Maximum number of admins (${maxAdmins}) will be reached.`}
                      </div>
                    )}

                    <TextInput
                      label={t("labels.fullName") || "Full Name"}
                      name={`admin_name_${index}`}
                      placeholder={
                        t("placeholders.fullName") || "Enter full name"
                      }
                      value={admin.full_name}
                      onChange={(e) =>
                        handleAdminChange(index, "full_name", e.target.value)
                      }
                      disabled={isDisabled}
                    />

                    <TextInput
                      label={t("labels.email") || "Email"}
                      name={`admin_email_${index}`}
                      type="email"
                      placeholder={
                        t("placeholders.email") || "Enter email address"
                      }
                      value={admin.email}
                      onChange={(e) =>
                        handleAdminChange(index, "email", e.target.value)
                      }
                      disabled={isDisabled}
                    />

                    <TextInput
                      label={t("labels.password") || "Password"}
                      name={`admin_password_${index}`}
                      type="password"
                      placeholder={
                        t("placeholders.password") || "Enter password"
                      }
                      value={admin.password}
                      onChange={(e) =>
                        handleAdminChange(index, "password", e.target.value)
                      }
                      disabled={isDisabled}
                      minLength={6}
                    />
                  </div>
                );
              })}
            </div>

            {maxAdmins === null ||
            currentAdminsCount + adminsData.length < maxAdmins ? (
              <Button
                type="button"
                variant="outline"
                onClick={addAdminRow}
                className="w-full"
              >
                {t("buttons.addAdmin") || "Add Another Admin"}
              </Button>
            ) : null}
          </div>
        )}

        {/* Step 4: Add Payments */}
        {currentStep === 4 && !businessId && (
          <div className="space-y-6 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("business.step4Title") || "Add Payments"}
              </h3>
              <p className="text-sm text-gray-500">
                {t("business.step4Description") ||
                  "Add payments for this business (optional)"}
              </p>
              {createdBusinessId ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-800 font-medium">
                    {t("business.businessIdInfo", {
                      id: createdBusinessId,
                    }) ||
                      `Business ID: ${createdBusinessId} - Payments will be added to this business`}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {t("business.paymentBusinessIdWarning") ||
                      "All payments will be associated with the business created in step 1"}
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <p className="text-xs text-red-800 font-medium">
                    {t("messages.businessNotCreated") ||
                      "Business must be created first"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {paymentsData.map((payment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-700">
                      {t("payment.payment") || "Payment"} {index + 1}
                    </h4>
                    {paymentsData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePaymentRow(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        {t("buttons.remove") || "Remove"}
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <TextInput
                        label={t("labels.amountPaid") || "Amount Paid"}
                        name={`payment_amount_${index}`}
                        type="number"
                        placeholder={
                          t("placeholders.amountPaid") || "Enter amount"
                        }
                        value={payment.amount_paid}
                        onChange={(e) =>
                          handlePaymentChange(
                            index,
                            "amount_paid",
                            e.target.value
                          )
                        }
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="flex-1">
                      <SelectInput
                        label={t("labels.paymentMethod") || "Payment Method"}
                        name={`payment_method_${index}`}
                        placeholder={
                          t("placeholders.paymentMethod") ||
                          "Select payment method"
                        }
                        options={[
                          {
                            value: "cash",
                            label: t("payment.methods.cash") || "Cash",
                          },
                          {
                            value: "credit_card",
                            label: t("payment.methods.card") || "Credit Card",
                          },
                          {
                            value: "bank_transfer",
                            label:
                              t("payment.methods.bankTransfer") ||
                              "Bank Transfer",
                          },
                        ]}
                        value={payment.payment_method}
                        onChange={(value) =>
                          handlePaymentChange(index, "payment_method", value)
                        }
                      />
                    </div>
                  </div>

                  <TextInput
                    label={t("labels.paymentDate") || "Payment Date"}
                    name={`payment_date_${index}`}
                    type="date"
                    placeholder={t("placeholders.paymentDate") || "Select date"}
                    value={payment.payment_date}
                    onChange={(e) =>
                      handlePaymentChange(index, "payment_date", e.target.value)
                    }
                  />

                  <TextareaInput
                    label={t("labels.note") || "Note (Optional)"}
                    name={`payment_note_${index}`}
                    placeholder={t("placeholders.note") || "Enter note"}
                    value={payment.note}
                    onChange={(e) =>
                      handlePaymentChange(index, "note", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addPaymentRow}
              className="w-full"
            >
              {t("buttons.addPayment") || "Add Another Payment"}
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-8 mt-8 border-t border-gray-200">
          {currentStep > 1 && !businessId && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 font-medium py-3"
              disabled={isSubmitting || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("buttons.previous") || "Previous"}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="font-medium py-3 px-4"
            disabled={isSubmitting || loading}
          >
            {t("buttons.cancel") || "Cancel"}
          </Button>
          <Button
            type="submit"
            variant="dark"
            className="flex-1 font-medium py-3"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading
              ? t("buttons.saving") || "Saving..."
              : currentStep === totalSteps
              ? t("buttons.save") || "Save"
              : t("buttons.next") || "Next"}
            {currentStep < totalSteps && (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
