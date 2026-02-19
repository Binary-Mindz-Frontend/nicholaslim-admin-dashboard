import { useEffect } from "react";
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

const DashboardPopupDialog = ({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: any) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      desc: "",
      redirect_link: "",
      isActive: true,
    },
  });

  const isActiveValue = watch("isActive");

  useEffect(() => {
    if (open) {
      reset(
        defaultValues || {
          title: "",
          desc: "",
          redirect_link: "",
          isActive: true,
        },
      );
    }
  }, [defaultValues, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Dashboard Popup" : "Edit Dashboard Popup"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: true })}
              placeholder="Main Campaign Title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              {...register("desc")}
              placeholder="Enter popup message details..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirect_link">Redirect Link</Label>
            <Input
              id="redirect_link"
              {...register("redirect_link")}
              placeholder="https://example.com/promo"
            />
          </div>

          {mode !== "add" && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={isActiveValue}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#FFCC00] text-black hover:bg-yellow-500 cursor-pointer"
            >
              {isLoading
                ? "Saving..."
                : mode === "add"
                  ? "Create Popup"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardPopupDialog;
