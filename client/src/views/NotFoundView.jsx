import { Link } from "react-router-dom";
import { CloudOff } from "lucide-react";

export default function NotFoundView() {
  return (
    <section className="flex min-w-0 flex-col items-center rounded-[20px] bg-[var(--panel)] p-7 text-center text-[var(--muted)]">
      <CloudOff size={42} color="#ffa52f" />
      <h1 className="mt-[18px] mb-[18px] text-2xl font-bold text-[var(--text)]">
        Page not found
      </h1>
      <p>The page you requested does not exist.</p>
      <Link className="rounded-[10px] bg-[var(--accent)] px-4 py-2.5 font-semibold text-[#151b26] hover:brightness-105" to="/">
        Return to dashboard
      </Link>
    </section>
  );
}
