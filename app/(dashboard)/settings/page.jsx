"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/shadcn/CardWrapper";
import { Button } from "../../../components/shadcn/ButtonWrapper";
import { TextInput } from "../../../forms/form-controls/TextInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/shadcn/SelectWrapper";
import {
  User,
  Lock,
  Bell,
  Globe,
  Save,
  Mail,
  Phone,
  Building,
  Shield,
  Key,
  Eye,
  EyeOff,
  Download,
  Trash2,
} from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";
import {
  changeSuperuserPassword,
  getSuperuserMe,
  updateSuperuserMe,
} from "../../../lib/api/authApi";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/shadcn/AvatarWrapper";

export default function SettingsPage() {
  const { t, isRTL, locale, setLocale, formatDate } = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [settings, setSettings] = useState({
    // Profile
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    profileImage: null, // For file upload

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Account status
    isActive: true,
    dateJoined: null,
    lastLogin: null,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (section) => {
    console.log(`Saving ${section} settings:`, settings);
    // Add save logic here
  };

  const handleProfileSave = async () => {
    if (isSavingProfile) {
      return;
    }

    if (!settings.username || !settings.email) {
      alert(
        t("messages.fillRequiredFields") || "Please fill in all required fields"
      );
      return;
    }

    setIsSavingProfile(true);
    try {
      // Prepare form data for file upload if profile image is selected
      const formData = new FormData();
      formData.append("first_name", settings.firstName || "");
      formData.append("last_name", settings.lastName || "");
      formData.append("username", settings.username);
      formData.append("email", settings.email);

      // Add profile image if a new file is selected
      if (settings.profileImage instanceof File) {
        formData.append("profile_image", settings.profileImage);
      }

      const result = await updateSuperuserMe(formData);

      if (result.success) {
        const data = result.data || {};
        setSettings((prev) => ({
          ...prev,
          firstName: data.first_name ?? prev.firstName,
          lastName: data.last_name ?? prev.lastName,
          username: data.username ?? prev.username,
          email: data.email ?? prev.email,
          avatar: data.profile_image || prev.avatar,
          profileImage: null, // Reset file input
        }));
        alert(
          t("messages.profileUpdated") || "Profile updated successfully"
        );
        // Reload account info to get latest data
        const refreshResult = await getSuperuserMe();
        if (refreshResult.success) {
          const refreshData = refreshResult.data || {};
          const derivedName =
            [refreshData.first_name, refreshData.last_name]
              .filter(Boolean)
              .join(" ") ||
            refreshData.username ||
            "Admin";
          setSettings((prev) => ({
            ...prev,
            firstName: refreshData.first_name || "",
            lastName: refreshData.last_name || "",
            username: refreshData.username || "",
            email: refreshData.email || "",
            avatar:
              refreshData.profile_image ||
              prev.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                derivedName
              )}`,
          }));
        }
        return;
      }

      const err = result.error;
      let errorMessage =
        t("messages.profileUpdateFailed") || "Failed to update profile";

      if (err?.username) {
        errorMessage = Array.isArray(err.username)
          ? err.username.join(", ")
          : err.username;
      } else if (err?.email) {
        errorMessage = Array.isArray(err.email)
          ? err.email.join(", ")
          : err.email;
      } else if (err?.first_name) {
        errorMessage = Array.isArray(err.first_name)
          ? err.first_name.join(", ")
          : err.first_name;
      } else if (err?.last_name) {
        errorMessage = Array.isArray(err.last_name)
          ? err.last_name.join(", ")
          : err.last_name;
      } else if (err?.profile_image) {
        errorMessage = Array.isArray(err.profile_image)
          ? err.profile_image.join(", ")
          : err.profile_image;
      } else if (err?.detail) {
        errorMessage =
          typeof err.detail === "string"
            ? err.detail
            : Array.isArray(err.detail)
            ? err.detail.join(", ")
            : JSON.stringify(err.detail);
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(t("messages.profileUpdateFailed") || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadAccountInfo = async () => {
      const result = await getSuperuserMe();
      if (!isMounted) {
        return;
      }

      if (!result.success) {
        const err = result.error;
        let errorMessage = "Failed to load account info";

        if (err?.detail) {
          errorMessage =
            typeof err.detail === "string"
              ? err.detail
              : Array.isArray(err.detail)
              ? err.detail.join(", ")
              : JSON.stringify(err.detail);
        } else if (typeof err === "string") {
          errorMessage = err;
        } else if (err?.message) {
          errorMessage = err.message;
        }

        alert(errorMessage);
        return;
      }

      const data = result.data || {};
      const derivedName =
        [data.first_name, data.last_name].filter(Boolean).join(" ") ||
        data.username ||
        "Admin";

      setSettings((prev) => ({
        ...prev,
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        username: data.username || "",
        email: data.email || "",
        isActive: Boolean(data.is_active),
        dateJoined: data.date_joined || null,
        lastLogin: data.last_login || null,
        avatar:
          data.profile_image ||
          prev.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            derivedName
          )}`,
      }));
    };

    loadAccountInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePasswordUpdate = async () => {
    if (isUpdatingPassword) {
      return;
    }

    if (
      !settings.currentPassword ||
      !settings.newPassword ||
      !settings.confirmPassword
    ) {
      alert(
        t("messages.fillRequiredFields") || "Please fill in all required fields"
      );
      return;
    }

    if (settings.newPassword !== settings.confirmPassword) {
      alert(
        t("messages.passwordsDoNotMatch") ||
          "New password and confirmation do not match"
      );
      return;
    }

    if (settings.newPassword.length < 6) {
      alert(
        t("messages.passwordMinLength") ||
          "Password must be at least 6 characters"
      );
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const result = await changeSuperuserPassword({
        oldPassword: settings.currentPassword,
        newPassword: settings.newPassword,
        confirmNewPassword: settings.confirmPassword,
      });

      if (result.success) {
        alert(
          t("messages.passwordUpdated") || "Password updated successfully"
        );
        setSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        return;
      }

      const err = result.error;
      let errorMessage =
        t("messages.passwordUpdateFailed") || "Failed to update password";

      if (err?.old_password) {
        errorMessage = Array.isArray(err.old_password)
          ? err.old_password.join(", ")
          : err.old_password;
      } else if (err?.new_password) {
        errorMessage = Array.isArray(err.new_password)
          ? err.new_password.join(", ")
          : err.new_password;
      } else if (err?.confirm_new_password) {
        errorMessage = Array.isArray(err.confirm_new_password)
          ? err.confirm_new_password.join(", ")
          : err.confirm_new_password;
      } else if (err?.detail) {
        errorMessage =
          typeof err.detail === "string"
            ? err.detail
            : Array.isArray(err.detail)
            ? err.detail.join(", ")
            : JSON.stringify(err.detail);
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    } catch (error) {
      console.error("Error updating password:", error);
      alert(
        t("messages.passwordUpdateFailed") || "Failed to update password"
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLanguageChange = (newLocale) => {
    setLocale(newLocale);
    // Match sidebar behavior to fully apply language changes
    setTimeout(() => {
      router.refresh();
      window.location.reload();
    }, 100);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      // Store the file for upload
      handleChange("profileImage", file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName =
    [settings.firstName, settings.lastName].filter(Boolean).join(" ") ||
    settings.username ||
    "Admin";
  const inactiveLabel = locale === "ar" ? "غير نشط" : "Inactive";
  const formatAccountDate = (value) => {
    const formatted = formatDate(value);
    return formatted || "-";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(isRTL && "text-left")}>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("navigation.settings")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("settings.pageDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div
                className={cn("flex items-center gap-3", isRTL && "flex-row")}
              >
                <div className="p-2 bg-primary-default/10 rounded-lg">
                  <User className="h-5 w-5 text-primary-default" />
                </div>
                <div>
                  <CardTitle>{t("settings.profile.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.profile.description")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div
                className={cn("flex items-center gap-4", isRTL && "flex-row")}
              >
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.avatar} alt={displayName} />
                  <AvatarFallback className="bg-primary-default text-white text-xl">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-2"
                    type="button"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    {t("settings.profile.changeAvatar")}
                  </Button>
                  <p className="text-xs text-gray-500">
                    {t("settings.profile.avatarHint")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label={t("settings.profile.firstName")}
                  name="firstName"
                  value={settings.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
                <TextInput
                  label={t("settings.profile.lastName")}
                  name="lastName"
                  value={settings.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
                <TextInput
                  label={t("settings.profile.username")}
                  name="username"
                  value={settings.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  required
                />
                <TextInput
                  label={t("settings.profile.emailAddress")}
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div
                className={cn(
                  "flex justify-end pt-4",
                  isRTL && "justify-start"
                )}
              >
                <Button
                  onClick={handleProfileSave}
                  className="flex items-center gap-2"
                  disabled={isSavingProfile}
                >
                  <Save className="h-4 w-4" />
                  {isSavingProfile
                    ? t("buttons.saving") || "Saving..."
                    : t("settings.profile.saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div
                className={cn("flex items-center gap-3", isRTL && "flex-row")}
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>{t("settings.security.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.security.description")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <TextInput
                    label={t("settings.security.currentPassword")}
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) =>
                      handleChange("currentPassword", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute bottom-2 text-gray-500 hover:text-gray-700",
                      isRTL ? "left-3" : "right-3"
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <TextInput
                    label={t("settings.security.newPassword")}
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={settings.newPassword}
                    onChange={(e) =>
                      handleChange("newPassword", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={cn(
                      "absolute bottom-2 text-gray-500 hover:text-gray-700",
                      isRTL ? "left-3" : "right-3"
                    )}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <TextInput
                    label={t("settings.security.confirmPassword")}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={settings.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={cn(
                      "absolute bottom-2 text-gray-500 hover:text-gray-700",
                      isRTL ? "left-3" : "right-3"
                    )}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className={cn(
                  "flex justify-end pt-4",
                  isRTL && "justify-start"
                )}
              >
                <Button
                  onClick={handlePasswordUpdate}
                  className="flex items-center gap-2"
                  disabled={isUpdatingPassword}
                >
                  <Save className="h-4 w-4" />
                  {isUpdatingPassword
                    ? t("settings.security.updatingPassword")
                    : t("settings.security.updatePassword")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          {/* <Card>
            <CardHeader>
              <div
                className={cn("flex items-center gap-3", isRTL && "flex-row")}
              >
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <CardTitle>{t("settings.notifications.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.notifications.description")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  {
                    key: "emailNotifications",
                    label: t("settings.notifications.emailNotifications"),
                    icon: Mail,
                  },
                  {
                    key: "pushNotifications",
                    label: t("settings.notifications.pushNotifications"),
                    icon: Bell,
                  },
                  {
                    key: "smsNotifications",
                    label: t("settings.notifications.smsNotifications"),
                    icon: Phone,
                  },
                  {
                    key: "marketingEmails",
                    label: t("settings.notifications.marketingEmails"),
                    icon: Building,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={cn(
                      "flex items-center justify-between py-2",
                      isRTL && "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        isRTL && "flex-row"
                      )}
                    >
                      <item.icon className="h-5 w-5 text-gray-400" />
                      <label
                        htmlFor={item.key}
                        className="text-sm font-medium text-gray-700"
                      >
                        {item.label}
                      </label>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id={item.key}
                        checked={settings[item.key]}
                        onChange={(e) =>
                          handleChange(item.key, e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-default rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-default"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  "flex justify-end pt-4",
                  isRTL && "justify-start"
                )}
              >
                <Button
                  onClick={() => handleSave("notifications")}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {t("settings.notifications.savePreferences")}
                </Button>
              </div>
            </CardContent>
          </Card> */}

          {/* General Settings */}
          <Card>
            <CardHeader>
              <div
                className={cn("flex items-center gap-3", isRTL && "flex-row")}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>{t("settings.general.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.general.description")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  className={cn(
                    "block text-sm font-medium text-gray-700",
                    isRTL ? "text-right" : "text-left"
                  )}
                >
                  {t("settings.general.language")}
                </label>
                <Select value={locale} onValueChange={handleLanguageChange}>
                  <SelectTrigger
                    className={cn(isRTL ? "text-right" : "text-right")}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                className={cn(
                  "flex justify-end pt-4",
                  isRTL && "justify-start"
                )}
              >
                <Button
                  onClick={() => handleSave("general")}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {t("settings.general.saveSettings")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle className={cn("text-lg", isRTL && "text-left")}>
                {t("settings.quickActions.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className={cn(
                  "w-full flex items-center",
                  isRTL ? "justify-start flex-row" : "justify-start flex-row"
                )}
                size="sm"
              >
                <Key className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t("settings.quickActions.generateApiKey")}
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "w-full flex items-center",
                  isRTL ? "justify-start flex-row" : "justify-start flex-row"
                )}
                size="sm"
              >
                <Download className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t("settings.quickActions.exportData")}
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "w-full flex items-center",
                  isRTL ? "justify-start flex-row" : "justify-start flex-row"
                )}
                size="sm"
              >
                <Trash2 className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t("settings.quickActions.deleteAccount")}
              </Button>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle className={cn("text-lg", isRTL && "text-left")}>
                {t("settings.accountStatus.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row"
                )}
              >
                <span className="text-sm text-gray-600">
                  {t("settings.accountStatus.status")}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    settings.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {settings.isActive
                    ? t("settings.accountStatus.active")
                    : inactiveLabel}
                </span>
              </div>
              <div
                className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row"
                )}
              >
                <span className="text-sm text-gray-600">
                  {t("settings.accountStatus.memberSince")}
                </span>
                <span className="text-sm font-medium">
                  {formatAccountDate(settings.dateJoined)}
                </span>
              </div>
              <div
                className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row"
                )}
              >
                <span className="text-sm text-gray-600">
                  {t("settings.accountStatus.lastLogin")}
                </span>
                <span className="text-sm font-medium">
                  {formatAccountDate(settings.lastLogin)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
