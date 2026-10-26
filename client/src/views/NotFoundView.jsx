import { Link } from "react-router-dom";
import { CloudOff } from "lucide-react";

export default function NotFoundView() {
  return (
    <section className="panel empty-state">
      <CloudOff size={42} color="#ffa52f" />
      <h1 className="page-heading" style={{ marginTop: 18 }}>
        Page not found
      </h1>
      <p>The page you requested does not exist.</p>
      <Link className="primary-button" to="/">
        Return to dashboard
      </Link>
    </section>
  );
}
