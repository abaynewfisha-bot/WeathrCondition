import { LoaderCircle } from "lucide-react";

export default function Loader({ message = "Loading weather..." }) {
  return (
    <div className="loading-state">
      <LoaderCircle size={28} className="forecast-icon" />
      <p>{message}</p>
    </div>
  );
}
