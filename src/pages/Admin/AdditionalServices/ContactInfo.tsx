/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import {
  useGetServiceEmailNumberQuery,
  useUpdateServiceEmailNumberMutation,
} from "@/redux/features/additionalServices/additionalServicesApi";
import ContactInfoDialog from "@/components/Dashboard/ContactInfo/ContactInfoDialog";
import { Edit, Mail, Phone } from "lucide-react";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable";

const ContactInfo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: response } = useGetServiceEmailNumberQuery({});
  const [updateContact, { isLoading: isUpdating }] =
    useUpdateServiceEmailNumberMutation();

  const contactData = response?.data;

  const handleUpdate = async (formData: {
    service_email: string;
    service_number: string;
  }) => {
    try {
      if (!contactData?.id) return;

      const res = await updateContact({
        id: contactData.id,
        ...formData,
      }).unwrap();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message || "Contact information updated successfully!");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update contact info");
    }
  };

  return (
    <div className="mx-6 sm:mx-12 my-10">
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-2xl font-bold">
            Service Contact Information
          </CardTitle>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#FFCC00] text-black hover:bg-yellow-500 flex gap-2 cursor-pointer"
          >
            <Edit className="w-4 h-4" /> Edit Info
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Mail className="text-yellow-700 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Service Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {contactData?.service_email || "Not Set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Phone className="text-yellow-700 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Service Number
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {contactData?.service_number || "Not Set"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ContactInfoDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        defaultValues={contactData}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />

      <NewDynamicChangeLogTable entityType="ServiceConfig" />
    </div>
  );
};

export default ContactInfo;
