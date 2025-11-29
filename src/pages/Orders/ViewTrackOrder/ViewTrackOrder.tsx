
import { ArrowLeft} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditDriverProfile() {
    const navigate = useNavigate();

    return (
        <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">

            {/* Back Button */}
            <h1
                onClick={() => navigate(`/`)}
                className="flex items-center gap-1 cursor-pointer text-2xl font-semibold text-gray-900"
            >
                <ArrowLeft /> Back to Driver List
            </h1>

            
        </div>
    );
}
