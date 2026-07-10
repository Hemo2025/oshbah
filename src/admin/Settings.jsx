import { useState } from "react";
import { FaSave, FaUndo, FaCheck } from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useSettings } from "../hooks/useSettings";
import { DEFAULT_SETTINGS } from "../context/default-settings";

function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "هل أنت متأكد من إرجاع كل الإعدادات للوضع الافتراضي؟",
    );
    if (!confirmReset) return;
    resetSettings();
    setForm(DEFAULT_SETTINGS);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          {/* بيانات المتجر */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              بيانات المتجر
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="info@oshbah.com"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-700">
                  العنوان
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-700">
                  وصف المتجر
                </label>
                <textarea
                  value={form.storeDescription}
                  onChange={(e) =>
                    handleChange("storeDescription", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                />
              </div>
            </div>
          </div>

          {/* الشحن */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold text-gray-800">الشحن</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  رسوم الشحن (ر.س)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.shippingFee}
                  onChange={(e) =>
                    handleChange("shippingFee", Number(e.target.value))
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  حد الشحن المجاني (ر.س)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.freeShippingThreshold}
                  onChange={(e) =>
                    handleChange(
                      "freeShippingThreshold",
                      Number(e.target.value),
                    )
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                />
                <p className="mt-1 text-xs text-gray-400">
                  الطلبات فوق هذا المبلغ توصيلها مجاني
                </p>
              </div>
            </div>
          </div>

          {/* التواصل الاجتماعي */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              التواصل الاجتماعي
            </h2>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  انستقرام
                </label>
                <input
                  type="text"
                  value={form.socialLinks.instagram}
                  onChange={(e) =>
                    handleSocialChange("instagram", e.target.value)
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  تويتر / X
                </label>
                <input
                  type="text"
                  value={form.socialLinks.twitter}
                  onChange={(e) =>
                    handleSocialChange("twitter", e.target.value)
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="https://x.com/..."
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  سناب شات
                </label>
                <input
                  type="text"
                  value={form.socialLinks.snapchat}
                  onChange={(e) =>
                    handleSocialChange("snapchat", e.target.value)
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="https://snapchat.com/add/..."
                />
              </div>
            </div>
          </div>

          {/* وضع الصيانة */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">وضع الصيانة</h2>
                <p className="mt-1 text-sm text-gray-500">
                  عند التفعيل، يظهر إشعار صيانة للزوار بدل المتجر
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleChange("maintenanceMode", !form.maintenanceMode)
                }
                className={`relative h-8 w-14 rounded-full transition ${
                  form.maintenanceMode ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                    form.maintenanceMode ? "right-1" : "right-7"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-white transition ${
                saved ? "bg-green-800" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {saved ? (
                <>
                  <FaCheck /> تم الحفظ
                </>
              ) : (
                <>
                  <FaSave /> حفظ الإعدادات
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-300"
            >
              <FaUndo /> استعادة الافتراضي
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Settings;
