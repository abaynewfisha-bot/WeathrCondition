import { LoaderCircle } from "lucide-react";

export default function Loader({ message = "Loading weather..." }) {
  return (
    <div className="flex flex-col items-center p-7 text-center text-[#91a5bf]" role="status">
      <LoaderCircle size={28} className="my-3 animate-spin text-[#ffa52f]" aria-hidden="true" />
      <p className="m-0">{message}</p>
    </div>
  );
}
