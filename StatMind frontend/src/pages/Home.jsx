import { useNavigate } from "react-router-dom";

function UniversityHomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-800">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0f172a] text-white shadow z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          <h1 className="text-lg font-semibold tracking-wide">
            UniCore
          </h1>

          <div className="flex items-center gap-6 text-sm">
            <button className="text-slate-300 hover:text-white transition">
              Home
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-20">
        <div className="relative h-[500px]">

          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=60"
            loading="lazy"
            alt="Campus"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center text-white px-4">

            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome to Smart University
            </h1>

            <p className="mt-4 max-w-xl text-gray-200">
              A place of excellence in education, innovation, and research.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Student Portal Login
            </button>

          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

        <img
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=60"
          loading="lazy"
          alt="Campus"
          className="rounded-xl shadow"
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">
            About Our University
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Smart University provides world-class education with modern
            facilities, expert lecturers, and a vibrant campus life.
          </p>
        </div>

      </section>

      {/* ================= PROGRAMS ================= */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-2xl font-bold text-center mb-10">
            Our Programs
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <ProgramCard
              title="Engineering"
              img="https://images.unsplash.com/photo-1581090700227-1e37b190418e"
            />

            <ProgramCard
              title="Business"
              img="https://images.unsplash.com/photo-1556761175-b413da4baf72"
            />

            <ProgramCard
              title="Information Technology"
              img="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            />

          </div>
        </div>
      </section>

      {/* ================= CONTACT (FIXED THEME) ================= */}
      <section className="bg-[#0f172a] text-white py-16 text-center">

        <h2 className="text-2xl font-bold">
          Contact Us
        </h2>

        <p className="mt-2 text-slate-300">
          info@unicore.lk | +94 11 234 5678
        </p>

      </section>

      {/* ================= FOOTER (MATCHED) ================= */}
      <footer className="bg-[#020617] text-slate-400 text-center py-6 text-sm">
        © 2026 UniCore University
      </footer>

    </div>
  );
}

/* ================= PROGRAM CARD ================= */
function ProgramCard({ title, img }) {
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-lg">

      <img
        src={`${img}?auto=format&fit=crop&w=800&q=60`}
        loading="lazy"
        alt={title}
        className="h-64 w-full object-cover transition duration-500 
                   group-hover:scale-110 blur-[2px] group-hover:blur-0"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">

        <h3 className="text-white text-lg font-semibold">
          {title}
        </h3>

        <button className="mt-2 text-sm bg-white text-black px-3 py-1 rounded hover:bg-gray-200">
          Explore
        </button>

      </div>
    </div>
  );
}

export default UniversityHomePage;