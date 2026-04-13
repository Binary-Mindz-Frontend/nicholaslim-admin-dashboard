/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUploadFileMutation } from "@/redux/features/usersTypes/usersTypesApi";
import toast from "react-hot-toast";

const DashboardPopupDialog = ({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
  isLoading: isSubmitting,
}: any) => {
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      desc: "",
      redirect_link: "",
      image_link: "",
      isActive: true,
    },
  });

  const isActiveValue = watch("isActive");
  const currentImageLink = watch("image_link");

  useEffect(() => {
    if (open) {
      reset(
        defaultValues || {
          title: "",
          desc: "",
          redirect_link: "",
          image_link: "",
          isActive: true,
        },
      );
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [defaultValues, reset, open]);

  // Handle local file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      let finalImageUrl = data.image_link;

      if (selectedFile) {
        const uploadRes = await uploadFile(selectedFile).unwrap();
        if (uploadRes.success && uploadRes.data?.length > 0) {
          finalImageUrl = uploadRes.data[0];
        } else {
          toast.error("Image upload failed");
          return;
        }
      }

      if (!finalImageUrl && mode === "add") {
        toast.error("Please select an image first");
        return;
      }

      const payload = {
        ...data,
        image_link: finalImageUrl,
      };

      onSubmit(payload);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Dashboard Popup" : "Edit Dashboard Popup"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title", { required: true })}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Popup Image *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={mode === "add" && !currentImageLink}
              className="cursor-pointer"
            />

            {/* Image Preview Area */}
            {(previewUrl || currentImageLink) && (
              <div className="mt-2 relative w-full h-32 bg-slate-50 border rounded-md overflow-hidden">
                <img
                  src={previewUrl || currentImageLink}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {currentImageLink && !previewUrl && (
              <p className="text-[10px] text-blue-600 truncate mt-1">
                Current: {currentImageLink}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description *</Label>
            <Textarea
              id="desc"
              {...register("desc", { required: true })}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirect_link">Redirect Link</Label>
            <Input
              id="redirect_link"
              {...register("redirect_link")}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="isActive" className="cursor-pointer">
              Active Status
            </Label>
            <Switch
              id="isActive"
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-[#FFCC00] text-black hover:bg-yellow-500"
            >
              {isUploading
                ? "Uploading..."
                : isSubmitting
                  ? "Saving..."
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardPopupDialog;
