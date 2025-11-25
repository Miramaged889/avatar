"use client";

import { useState } from "react";
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
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/shadcn/AvatarWrapper";

export default function SettingsPage() {
  const { t, isRTL } = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [settings, setSettings] = useState({
    // Profile
    fullName: "Admin User",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    company: "Company Name",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,

    // General
    language: "en",
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (section) => {
    console.log(`Saving ${section} settings:`, settings);
    // Add save logic here
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
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
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
                  <AvatarImage src={settings.avatar} alt={settings.fullName} />
                  <AvatarFallback className="bg-primary-default text-white text-xl">
                    {settings.fullName.charAt(0)}
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
                  label={t("settings.profile.fullName")}
                  name="fullName"
                  value={settings.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
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
                <TextInput
                  label={t("settings.profile.phoneNumber")}
                  name="phone"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                <TextInput
                  label={t("settings.profile.company")}
                  name="company"
                  value={settings.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </div>

              <div
                className={cn(
                  "flex justify-end pt-4",
                  isRTL && "justify-start"
                )}
              >
                <Button
                  onClick={() => handleSave("profile")}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {t("settings.profile.saveChanges")}
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
                  onClick={() => handleSave("security")}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {t("settings.security.updatePassword")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
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
          </Card>

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
                <Select
                  value={settings.language}
                  onValueChange={(v) => handleChange("language", v)}
                >
                  <SelectTrigger
                    className={cn(isRTL ? "text-right" : "text-left")}
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
          <Card>
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
          </Card>

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
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {t("settings.accountStatus.active")}
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
                <span className="text-sm font-medium">Jan 2024</span>
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
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
