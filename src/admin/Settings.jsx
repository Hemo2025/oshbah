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
  FaBullhorn,
  FaImage,
  FaPlus,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";
import { useSettings } from "../hooks/useSettings";
import { DEFAULT_SETTINGS } from "../context/default-settings";
import { uploadToCloudinary } from "../services/cloudinary";

function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();

  const [form, setForm] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...settings,
    theme: { ...DEFAULT_SETTINGS.theme, ...settings.theme },
    heroSlider: {
      ...DEFAULT_SETTINGS.heroSlider,
      ...settings.heroSlider,
    },
    announcementBar: {
      ...DEFAULT_SETTINGS.announcementBar,
      ...settings.announcementBar,
    },
    banners: settings.banners || DEFAULT_SETTINGS.banners,
  }));

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("banners");
  const [uploadingBanner, setUploadingBanner] = useState(null);

  const save = async () => {
    try {
      setSaving(true);
      await updateSettings(form);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Settings save error:", error);
      window.alert("تعذر حفظ الإعدادات، حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const restore = async () => {
    if (!window.confirm("استعادة جميع الإعدادات؟")) return;

    try {
      await resetSettings();
      setForm({ ...DEFAULT_SETTINGS });
      setSaved(false);
    } catch (error) {
      console.error("Settings reset error:", error);
      window.alert("تعذرت استعادة الإعدادات.");
    }
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

  // إضافة بنر جديد
  const addBanner = () => {
    const newBanner = {
      id: `banner-${Date.now()}`,
      image: "",
      link: "/Products",
      active: true,
      alt: "",
    };

    setForm((prev) => ({
      ...prev,
      banners: [...(prev.banners || []), newBanner],
    }));
  };

  // تعديل بيانات بنر
  const updateBanner = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      banners: (prev.banners || []).map((banner) =>
        banner.id === id ? { ...banner, [field]: value } : banner,
      ),
    }));
  };

  // رفع صورة البنر إلى Cloudinary
  const handleBannerUpload = async (id, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("يرجى اختيار ملف صورة صالح.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert("حجم الصورة أكبر من 10 ميجابايت.");
      return;
    }

    try {
      setUploadingBanner(id);

      const imageUrl = await uploadToCloudinary(file);

      updateBanner(id, "image", imageUrl);
    } catch (error) {
      console.error("Banner upload error:", error);
      window.alert("فشل رفع الصورة. تحقق من الاتصال وحاول مجددًا.");
    } finally {
      setUploadingBanner(null);
    }
  };

  // حذف بنر
  const removeBanner = (id) => {
    if (!window.confirm("هل تريد حذف هذا البنر؟")) return;

    setForm((prev) => ({
      ...prev,
      banners: (prev.banners || []).filter((banner) => banner.id !== id),
    }));
  };

  const tabs = [
    {
      id: "banners",
      label: "البنرات الرئيسية",
      icon: <FaImage />,
    },
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
      id: "announcement",
      label: "الشريط الإعلاني",
      icon: <FaBullhorn />,
    },
    {
      id: "advanced",
      label: "متقدمة",
      icon: <FaCog />,
    },
  ];

  return (
    <AdminLayout>
      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* قائمة الإعدادات */}
        <aside className="h-fit rounded-3xl bg-white p-4 shadow">
          <h2 className="mb-6 text-xl font-bold">إعدادات المتجر</h2>

          <div className="flex flex-col gap-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-right transition ${
                  tab === item.id
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* محتوى الإعدادات */}
        <div className="min-w-0 rounded-3xl bg-white p-5 shadow sm:p-7">
          {/* البنرات الرئيسية */}
          {tab === "banners" && (
            <div className="space-y-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    البنرات الرئيسية
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    أضف صور البنرات وحدد الروابط التي ينتقل إليها الزائر عند
                    الضغط على كل صورة.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addBanner}
                  className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  <FaPlus />
                  إضافة بنر
                </button>
              </div>

              {/* إعدادات السلايدر */}
              <div className="space-y-4 rounded-2xl border border-green-100 bg-green-50/50 p-4">
                <h3 className="font-bold text-gray-900">إعدادات عرض البنرات</h3>

                <label className="flex items-center justify-between gap-4 rounded-xl bg-white p-4">
                  <span>تفعيل السلايدر الرئيسي</span>
                  <input
                    type="checkbox"
                    checked={form.heroSlider?.enabled ?? true}
                    onChange={(e) =>
                      updateNested("heroSlider", "enabled", e.target.checked)
                    }
                    className="h-5 w-5 accent-green-700"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-xl bg-white p-4">
                  <span>التبديل التلقائي بين الصور</span>
                  <input
                    type="checkbox"
                    checked={form.heroSlider?.autoplay ?? true}
                    onChange={(e) =>
                      updateNested("heroSlider", "autoplay", e.target.checked)
                    }
                    className="h-5 w-5 accent-green-700"
                  />
                </label>

                <div>
                  <label className="mb-2 block font-medium">
                    مدة الانتقال بين البنرات (مللي ثانية)
                  </label>
                  <input
                    type="number"
                    min="2000"
                    step="500"
                    className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-600"
                    value={form.heroSlider?.autoplayDelay ?? 5000}
                    onChange={(e) =>
                      updateNested(
                        "heroSlider",
                        "autoplayDelay",
                        Math.max(2000, Number(e.target.value) || 5000),
                      )
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    مثال: 5000 تعني 5 ثوانٍ.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center justify-between gap-3 rounded-xl bg-white p-4">
                    <span>إظهار أسهم التنقل</span>
                    <input
                      type="checkbox"
                      checked={form.heroSlider?.showArrows ?? true}
                      onChange={(e) =>
                        updateNested(
                          "heroSlider",
                          "showArrows",
                          e.target.checked,
                        )
                      }
                      className="h-5 w-5 accent-green-700"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 rounded-xl bg-white p-4">
                    <span>إظهار مؤشرات البنرات</span>
                    <input
                      type="checkbox"
                      checked={form.heroSlider?.showDots ?? true}
                      onChange={(e) =>
                        updateNested("heroSlider", "showDots", e.target.checked)
                      }
                      className="h-5 w-5 accent-green-700"
                    />
                  </label>
                </div>
              </div>

              {/* قائمة البنرات */}

              {(form.banners || []).length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 px-5 py-12 text-center">
                  <FaImage className="mx-auto mb-4 text-4xl text-gray-300" />
                  <h3 className="font-bold text-gray-700">
                    لا توجد بنرات حتى الآن
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    أضف أول بنر لعرضه في أعلى الصفحة الرئيسية.
                  </p>
                  <button
                    type="button"
                    onClick={addBanner}
                    className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
                  >
                    <FaPlus className="ml-2 inline" />
                    إضافة أول بنر
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {(form.banners || []).map((banner, index) => (
                    <div
                      key={banner.id || index}
                      className="overflow-hidden rounded-2xl border border-gray-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-gray-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 font-bold text-green-800">
                            {index + 1}
                          </span>
                          <h3 className="font-bold text-gray-800">
                            البنر {index + 1}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            استخدم 1920 × 600 لأفضل عرض على أجهزة الكمبيوتر،
                            و1080 × 600 لأجهزة الجوال.
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={Boolean(banner.active)}
                              onChange={(e) =>
                                updateBanner(
                                  banner.id,
                                  "active",
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 accent-green-700"
                            />
                            مفعّل
                          </label>

                          <button
                            type="button"
                            onClick={() => removeBanner(banner.id)}
                            className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                          >
                            <FaTrash />
                            حذف
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 p-4">
                        {/* معاينة الصورة */}
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.alt || `معاينة البنر ${index + 1}`}
                            className="max-h-72 w-full rounded-xl bg-gray-50 object-contain"
                          />
                        ) : (
                          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
                            <FaImage className="mb-3 text-4xl" />
                            <span className="text-sm">
                              لم يتم رفع صورة لهذا البنر
                            </span>
                          </div>
                        )}

                        {/* رفع الصورة */}
                        <div>
                          <label className="mb-2 block font-medium">
                            صورة البنر
                          </label>

                          <label
                            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-200 px-4 py-3 font-semibold text-green-800 transition hover:bg-green-50 ${
                              uploadingBanner === banner.id
                                ? "cursor-wait opacity-60"
                                : ""
                            }`}
                          >
                            {uploadingBanner === banner.id ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                جارٍ رفع الصورة...
                              </>
                            ) : (
                              <>
                                <FaImage />
                                {banner.image
                                  ? "تغيير الصورة"
                                  : "اختيار صورة ورفعها"}
                              </>
                            )}

                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingBanner !== null}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleBannerUpload(banner.id, file);
                                }
                                e.target.value = "";
                              }}
                            />
                          </label>

                          <p className="mt-2 text-xs text-gray-500">
                            الحد الأقصى 10 ميجابايت. يفضّل استخدام صورة عريضة
                            مناسبة لأجهزة الجوال والكمبيوتر.
                          </p>
                        </div>

                        {/* وصف الصورة */}
                        <div>
                          <label className="mb-2 block font-medium">
                            وصف الصورة (اختياري)
                          </label>
                          <input
                            type="text"
                            value={banner.alt || ""}
                            onChange={(e) =>
                              updateBanner(banner.id, "alt", e.target.value)
                            }
                            placeholder="مثال: عروض المنتجات الطبيعية"
                            className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-600"
                          />
                        </div>

                        {/* رابط البنر */}
                        <div>
                          <label className="mb-2 block font-medium">
                            رابط الوجهة عند الضغط على البنر
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            value={banner.link || ""}
                            onChange={(e) =>
                              updateBanner(banner.id, "link", e.target.value)
                            }
                            placeholder="/Products"
                            className="w-full rounded-xl border border-gray-200 p-3 text-left outline-none focus:border-green-600"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            مثال: /Products أو /Categories. اتركه فارغًا إذا لم
                            ترد جعل الصورة قابلة للضغط.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                تذكّر: بعد إضافة الصور أو تعديل الروابط، اضغط على «حفظ
                الإعدادات» أسفل الصفحة حتى تُحفظ التغييرات في إعدادات المتجر.
              </div>
            </div>
          )}

          {/* البيانات العامة */}
          {tab === "general" && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold">البيانات العامة</h2>

              <input
                className="w-full rounded-xl border p-3"
                placeholder="اسم المتجر"
                value={form.storeName || ""}
                onChange={(e) =>
                  setForm({ ...form, storeName: e.target.value })
                }
              />

              <textarea
                rows={4}
                className="w-full rounded-xl border p-3"
                placeholder="وصف المتجر"
                value={form.storeDescription || ""}
                onChange={(e) =>
                  setForm({ ...form, storeDescription: e.target.value })
                }
              />

              <input
                className="w-full rounded-xl border p-3"
                placeholder="البريد الإلكتروني"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="w-full rounded-xl border p-3"
                placeholder="رقم الهاتف"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                className="w-full rounded-xl border p-3"
                placeholder="رقم الواتساب"
                value={form.whatsapp || ""}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />

              <textarea
                rows={2}
                className="w-full rounded-xl border p-3"
                placeholder="عنوان المتجر"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <label className="flex items-center justify-between rounded-xl border p-4">
                <span>وضع الصيانة</span>
                <input
                  type="checkbox"
                  checked={Boolean(form.maintenanceMode)}
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
                <label className="mb-2 block">اللون الرئيسي</label>
                <input
                  type="color"
                  value={form.theme?.primaryColor || "#16a34a"}
                  onChange={(e) =>
                    updateNested("theme", "primaryColor", e.target.value)
                  }
                  className="h-12 w-20 cursor-pointer rounded-lg border p-1"
                />
              </div>

              <label className="flex justify-between rounded-xl border p-4">
                الوضع الداكن
                <input
                  type="checkbox"
                  checked={Boolean(form.theme?.darkMode)}
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
                  checked={Boolean(form.products?.hideOutOfStock)}
                  onChange={(e) =>
                    updateNested("products", "hideOutOfStock", e.target.checked)
                  }
                />
              </label>

              <label className="flex justify-between rounded-xl border p-4">
                عرض المفضلة
                <input
                  type="checkbox"
                  checked={Boolean(form.products?.showFavorites)}
                  onChange={(e) =>
                    updateNested("products", "showFavorites", e.target.checked)
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
                value={form.shipping?.shippingFee ?? 0}
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
                value={form.shipping?.freeShippingThreshold ?? 0}
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
                  checked={Boolean(form.notifications?.orderSound)}
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
                  checked={Boolean(form.notifications?.lowStockNotification)}
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

          {/* الشريط الإعلاني */}
          {tab === "announcement" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">الشريط الإعلاني</h2>

              <label className="flex items-center justify-between rounded-xl border p-4">
                <span>تفعيل الشريط</span>
                <input
                  type="checkbox"
                  checked={Boolean(form.announcementBar?.enabled)}
                  onChange={(e) =>
                    updateNested("announcementBar", "enabled", e.target.checked)
                  }
                />
              </label>

              <div>
                <label className="mb-2 block font-medium">
                  مدة تبديل الرسائل (مللي ثانية)
                </label>
                <input
                  type="number"
                  min="1000"
                  className="w-full rounded-xl border p-3"
                  value={form.announcementBar?.interval ?? 4500}
                  onChange={(e) =>
                    updateNested(
                      "announcementBar",
                      "interval",
                      Math.max(1000, Number(e.target.value) || 4500),
                    )
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium">الرسائل</label>
                  <button
                    type="button"
                    onClick={() =>
                      updateNested("announcementBar", "messages", [
                        ...(form.announcementBar?.messages || []),
                        "",
                      ])
                    }
                    className="rounded-lg bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800"
                  >
                    + إضافة رسالة
                  </button>
                </div>

                {(form.announcementBar?.messages || []).map((msg, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      className="min-w-0 flex-1 rounded-xl border p-3"
                      placeholder={`الرسالة ${index + 1}`}
                      value={msg}
                      onChange={(e) => {
                        const messages = [
                          ...(form.announcementBar?.messages || []),
                        ];
                        messages[index] = e.target.value;
                        updateNested("announcementBar", "messages", messages);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const messages = [
                          ...(form.announcementBar?.messages || []),
                        ];
                        messages.splice(index, 1);
                        updateNested("announcementBar", "messages", messages);
                      }}
                      className="rounded-xl bg-red-500 px-4 text-white hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium">لون الخلفية</label>
                  <input
                    type="color"
                    value={form.announcementBar?.backgroundColor || "#15803d"}
                    onChange={(e) =>
                      updateNested(
                        "announcementBar",
                        "backgroundColor",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium">لون النص</label>
                  <input
                    type="color"
                    value={form.announcementBar?.textColor || "#ffffff"}
                    onChange={(e) =>
                      updateNested(
                        "announcementBar",
                        "textColor",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* خيارات متقدمة */}
          {tab === "advanced" && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold">خيارات متقدمة</h2>

              <button
                type="button"
                onClick={restore}
                className="rounded-xl bg-red-100 px-5 py-3 text-red-600 hover:bg-red-200"
              >
                <FaUndo className="ml-2 inline" />
                استعادة الإعدادات
              </button>
            </div>
          )}

          {/* حفظ الإعدادات */}
          <div className="mt-10 border-t pt-6">
            <button
              type="button"
              onClick={save}
              disabled={saving || uploadingBanner !== null}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                saved ? "bg-green-800" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              <FaSave />
              {saving ? "جارٍ الحفظ..." : saved ? "تم الحفظ" : "حفظ الإعدادات"}
            </button>

            {uploadingBanner !== null && (
              <p className="mt-3 text-sm text-amber-700">
                انتظر انتهاء رفع الصورة قبل حفظ الإعدادات.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Settings;
