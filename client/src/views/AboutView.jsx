import { CloudSun, Code2, Mail, Map, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function AboutView() {
  const { t } = useLanguage();
  const features = [
    "Real-time weather conditions",
    "Hourly and 7-day forecasts",
    "City search and favorites",
    "Interactive weather map",
    "Weather alerts",
    "Celsius and Fahrenheit units"
  ];

  return (
    <section className="grid min-w-0 gap-4">
      <div className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(135deg,#183b90,#6d65b6,#a36d9f)] p-6 text-white sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white/15 backdrop-blur">
            <CloudSun size={44} className="text-[#ffd45a]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">WeatherWorld</h1>
            <p className="mt-1 text-sm text-[#e2eaff]">
              Know the Weather, Plan Your Day
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl leading-7 text-[#edf3ff]">
          WeatherWorld is a modern weather dashboard that provides clear,
          current information to help you plan activities, travel safely,
          and stay informed wherever you are.
        </p>
      </div>

      <div className="grid gap-4 min-[1051px]:grid-cols-2">
        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <ShieldCheck size={21} className="text-[#65a9ed]" />
            Features
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Code2 size={21} className="text-[#d18bc1]" />
            Technologies
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["React", "Vite", "Tailwind CSS", "Node.js", "Express", "Open-Meteo"].map(
              (technology) => (
                <div
                  key={technology}
                  className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                >
                  {technology}
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Map size={21} className="text-[#f0b64f]" />
            Application
          </h2>
          <dl className="grid grid-cols-[120px_1fr] gap-3 text-sm">
            <dt className="text-[var(--muted)]">Version</dt>
            <dd className="font-semibold">1.0.0</dd>
            <dt className="text-[var(--muted)]">Data source</dt>
            <dd className="font-semibold">Open-Meteo</dd>
            <dt className="text-[var(--muted)]">Status</dt>
            <dd className="font-semibold text-[#58b99b]">Active</dd>
          </dl>
        </div>

        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Mail size={21} className="text-[#75b78a]" />
            Contact
          </h2>
          <p className="text-sm leading-6 text-[var(--muted)]">
            For support or feedback, contact the WeatherWorld development team.
          </p>
          <a
            href="mailto:support@weatherworld.app"
            className="mt-4 inline-flex min-h-[42px] items-center rounded-[12px] bg-[linear-gradient(135deg,#4c82dd,#7d69b8)] px-4 text-sm font-bold text-white no-underline"
          >
            support@weatherworld.app
          </a>
        </div>
      </div>
    </section>
  );
}
