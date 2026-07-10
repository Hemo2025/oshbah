function Newsletter() {
  return (
    <section className="bg-green-700 py-20 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold">اشترك ليصلك كل جديد 🌿</h2>

        <p className="mt-5 text-green-100">
          احصل على أحدث العروض والمنتجات الجديدة.
        </p>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            className="
              flex-1
              rounded-xl
              px-6
              py-4
              text-black
              outline-none
            "
          />

          <button
            className="
              rounded-xl
              bg-white
              px-8
              py-4
              font-bold
              text-green-700
              transition
              hover:scale-105
            "
          >
            اشتراك
          </button>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
