import { useState } from "react";
import {
  FaStore,
  FaPalette,
  FaBox,
  FaTruck,
  FaBell,
  FaSave,
  FaUndo,
  FaCog,
} from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

import { useSettings } from "../hooks/useSettings";
import { DEFAULT_SETTINGS } from "../context/default-settings";

function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();

  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("general");

  const save = async () => {
    await updateSettings(form);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const restore = async () => {
    if (!window.confirm("استعادة جميع الإعدادات ؟")) return;

    await resetSettings();
    setForm(DEFAULT_SETTINGS);
  };

  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const tabs = [
    {
      id: "general",
      label: "عام",
      icon: <FaStore />,
    },
    {
      id: "theme",
      label: "التصميم",
      icon: <FaPalette />,
    },
    {
      id: "products",
      label: "المنتجات",
      icon: <FaBox />,
    },
    {
      id: "shipping",
      label: "الشحن",
      icon: <FaTruck />,
    },
    {
      id: "notifications",
      label: "الإشعارات",
      icon: <FaBell />,
    },
    {
      id: "advanced",
      label: "متقدمة",
      icon: <FaCog />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* القائمة */}

          <div className="rounded-3xl bg-white p-4 shadow">
            <h2 className="mb-6 text-xl font-bold">إعدادات المتجر</h2>

            <div className="flex flex-col gap-2">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    tab === item.id
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* المحتوى */}

          <div className="rounded-3xl bg-white p-6 shadow">
            {/* عام */}

            {tab === "general" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">البيانات العامة</h2>

                <input
                  className="w-full rounded-xl border p-3"
                  placeholder="اسم المتجر"
                  value={form.storeName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      storeName: e.target.value,
                    })
                  }
                />

                <textarea
                  rows={4}
                  className="w-full rounded-xl border p-3"
                  placeholder="وصف المتجر"
                  value={form.storeDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      storeDescription: e.target.value,
                    })
                  }
                />

                <input
                  className="w-full rounded-xl border p-3"
                  placeholder="رقم الواتساب"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      whatsapp: e.target.value,
                    })
                  }
                />

                <label className="flex items-center justify-between rounded-xl border p-4">
                  <span>وضع الصيانة</span>

                  <input
                    type="checkbox"
                    checked={form.maintenanceMode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maintenanceMode: e.target.checked,
                      })
                    }
                  />
                </label>
              </div>
            )}

            {/* التصميم */}

            {tab === "theme" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">التصميم</h2>

                <div>
                  <label>اللون الرئيسي</label>

                  <input
                    type="color"
                    value={form.theme?.primaryColor}
                    onChange={(e) =>
                      updateNested("theme", "primaryColor", e.target.value)
                    }
                  />
                </div>

                <label className="flex justify-between rounded-xl border p-4">
                  الوضع الداكن
                  <input
                    type="checkbox"
                    checked={form.theme?.darkMode}
                    onChange={(e) =>
                      updateNested("theme", "darkMode", e.target.checked)
                    }
                  />
                </label>
              </div>
            )}

            {/* المنتجات */}

            {tab === "products" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">المنتجات</h2>

                <label className="flex justify-between rounded-xl border p-4">
                  إخفاء المنتجات المنتهية
                  <input
                    type="checkbox"
                    checked={form.products?.hideOutOfStock}
                    onChange={(e) =>
                      updateNested(
                        "products",
                        "hideOutOfStock",
                        e.target.checked,
                      )
                    }
                  />
                </label>

                <label className="flex justify-between rounded-xl border p-4">
                  عرض المفضلة
                  <input
                    type="checkbox"
                    checked={form.products?.showFavorites}
                    onChange={(e) =>
                      updateNested(
                        "products",
                        "showFavorites",
                        e.target.checked,
                      )
                    }
                  />
                </label>
              </div>
            )}

            {/* الشحن */}

            {tab === "shipping" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">الشحن</h2>

                <input
                  type="number"
                  className="w-full rounded-xl border p-3"
                  placeholder="رسوم الشحن"
                  value={form.shipping?.shippingFee}
                  onChange={(e) =>
                    updateNested(
                      "shipping",
                      "shippingFee",
                      Number(e.target.value),
                    )
                  }
                />

                <input
                  type="number"
                  className="w-full rounded-xl border p-3"
                  placeholder="الشحن المجاني بعد"
                  value={form.shipping?.freeShippingThreshold}
                  onChange={(e) =>
                    updateNested(
                      "shipping",
                      "freeShippingThreshold",
                      Number(e.target.value),
                    )
                  }
                />
              </div>
            )}

            {/* الإشعارات */}

            {tab === "notifications" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">الإشعارات</h2>

                <label className="flex justify-between rounded-xl border p-4">
                  صوت الطلبات
                  <input
                    type="checkbox"
                    checked={form.notifications?.orderSound}
                    onChange={(e) =>
                      updateNested(
                        "notifications",
                        "orderSound",
                        e.target.checked,
                      )
                    }
                  />
                </label>

                <label className="flex justify-between rounded-xl border p-4">
                  إشعارات المخزون
                  <input
                    type="checkbox"
                    checked={form.notifications?.lowStockNotification}
                    onChange={(e) =>
                      updateNested(
                        "notifications",
                        "lowStockNotification",
                        e.target.checked,
                      )
                    }
                  />
                </label>
              </div>
            )}

            {/* متقدمة */}

            {tab === "advanced" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">خيارات متقدمة</h2>

                <button
                  className="rounded-xl bg-red-100 px-5 py-3 text-red-600"
                  onClick={restore}
                >
                  <FaUndo className="inline ml-2" />
                  استعادة الإعدادات
                </button>
              </div>
            )}

            {/* أزرار */}

            <div className="mt-10 border-t pt-6">
              <button
                onClick={save}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-white ${
                  saved ? "bg-green-800" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <FaSave />

                {saved ? "تم الحفظ" : "حفظ الإعدادات"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
