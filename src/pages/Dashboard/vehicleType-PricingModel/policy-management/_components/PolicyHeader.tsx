import type React from "react";
import { Button } from "@/components/ui/button";
// import { MdOutlineDriveFolderUpload } from "react-icons/md";

interface PolicyHeaderProps {
  onCreatePolicy: () => void;
  onExportAll: () => void;
}

const PolicyHeader: React.FC<PolicyHeaderProps> = ({
  onCreatePolicy, //onExportAll
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <h1 className="text-4xl font-bold text-gray-900">Policy Management</h1>
      <div className="flex gap-3">
        <Button
          onClick={onCreatePolicy}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded cursor-pointer"
        >
          Create Policy
        </Button>
        {/* <Button
          onClick={onExportAll}
          className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold py-2 px-4 rounded flex items-center gap-2 cursor-pointer"
        >
          <MdOutlineDriveFolderUpload  size={20}/>
          Export All
        </Button> */}
      </div>
    </div>
  );
};

export default PolicyHeader;
