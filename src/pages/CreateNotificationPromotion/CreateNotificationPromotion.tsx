/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, X, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAddNotificationPromotionMutation } from "@/redux/features/notificationServices/notificationServicesApi";
import {
  useGetUserTypesQuery,
  useUploadFileMutation,
} from "@/redux/features/usersTypes/usersTypesApi";
import { useGetRiderProfilesQuery } from "@/redux/features/drivers/driversApi";
import CustomSelect from "../../components/Shared/CustomSelect/CustomSelect";
const PromotionSchema = z.object({
  title: z.string().min(1, "Title is required").max(80),
  message: z.string().min(1, "Message is required").max(200),
  push_notification: z.boolean(),
  send_immediately: z.boolean(),
  target_role: z.enum(["USER", "RAIDER", "ALL"]),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
  expiryDate: z.date().optional(),
});

// 2. Type definition-ti schema theke infer kora i best
type PromotionType = z.infer<typeof PromotionSchema>;

const TIME_OPTIONS = Array.from({ length: 24 * 60 }, (_, i) => {
  const hour = Math.floor(i / 60)
    .toString()
    .padStart(2, "0");
  const minute = (i % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
});

const CreateNotificationPromotion: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Selection States
  const [userIds, setUserIds] = useState<string[]>([]);
  const [driverIds, setDriverIds] = useState<string[]>([]);

  // API Pagination & Search States
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userList, setUserList] = useState<any[]>([]);

  const [driverPage, setDriverPage] = useState(1);
  const [driverSearch, setDriverSearch] = useState("");
  const [driverList, setDriverList] = useState<any[]>([]);

  const [addPromotion, { isLoading: isSubmitting }] =
    useAddNotificationPromotionMutation();
  const [uploadFile] = useUploadFileMutation();

  // Queries
  const { data: userData, isFetching: isUserFetching } = useGetUserTypesQuery({
    page: userPage,
    limit: 10,
    search: userSearch,
  });

  const { data: driverData, isFetching: isDriverFetching } =
    useGetRiderProfilesQuery({
      page: driverPage,
      limit: 10,
      search: driverSearch,
    });

  useEffect(() => {
    if (userData?.data?.data) {
      if (userPage === 1) setUserList(userData.data.data);
      else setUserList((prev) => [...prev, ...userData.data.data]);
    }
  }, [userData, userPage]);

  useEffect(() => {
    if (driverData?.data?.data) {
      if (driverPage === 1) setDriverList(driverData.data.data);
      else setDriverList((prev) => [...prev, ...driverData.data.data]);
    }
  }, [driverData, driverPage]);

  // 3. useForm setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PromotionType>({
    resolver: zodResolver(PromotionSchema),
    defaultValues: {
      title: "",
      message: "",
      push_notification: true,
      send_immediately: true,
      target_role: "USER",
      scheduleTime: "",
    },
  });

  const sendImmediately = watch("send_immediately");
  const targetRole = watch("target_role");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeId = (id: string, type: "user" | "driver") => {
    if (type === "user") setUserIds((prev) => prev.filter((i) => i !== id));
    else setDriverIds((prev) => prev.filter((i) => i !== id));
  };

  const onSubmit = async (values: PromotionType) => {
    const loadingToast = toast.loading("Processing promotion...");
    try {
      let finalImageUrl = "";

      // 1. Image Upload Logic
      if (selectedFile) {
        const uploadRes = await uploadFile(selectedFile).unwrap();
        if (uploadRes.success && uploadRes.data?.length > 0) {
          finalImageUrl = uploadRes.data[0];
        } else {
          toast.error("Image upload failed");
          toast.dismiss(loadingToast);
          return;
        }
      }

      // 2. Prepare Payload
      const combinedIds = [...userIds, ...driverIds].map(Number);

      const payload: any = {
        title: values.title,
        message: values.message,
        image_url: finalImageUrl,
        push_notification: values.push_notification,
        send_immediately: values.send_immediately,
        target_role: values.target_role,
        target_user_ids: combinedIds,
      };

      // Schedule Logic
      if (
        !values.send_immediately &&
        values.scheduleDate &&
        values.scheduleTime
      ) {
        const [hours, minutes] = values.scheduleTime.split(":").map(Number);
        const schedDate = new Date(values.scheduleDate);
        schedDate.setHours(hours, minutes, 0, 0);
        payload.schedule_to_send = schedDate.toISOString();
      }

      // Expiry Logic
      if (values.expiryDate) {
        payload.expiry_date = values.expiryDate.toISOString();
      }

      // 3. Submit Promotion
      const result = await addPromotion(payload).unwrap();
      if (result.success) {
        toast.success("Promotion created successfully!");
        reset();
        setUserIds([]);
        setDriverIds([]);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-black text-xl sm:text-2xl font-bold">
          Create Notification Promotion
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          {/* Title & Message */}
          <div className="grid gap-4">
            <div>
              <Label>Promotion Title</Label>
              <Input
                {...register("title")}
                placeholder="Weekend Promo"
                className="mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                {...register("message")}
                placeholder="Enjoy 15% off..."
                className="mt-1 min-h-[100px]"
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Promotion Image</Label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-400">Upload</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              {previewUrl && (
                <div className="relative w-32 h-32">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Custom Selects for IDs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Select Specific Users</Label>
              <div className="flex flex-wrap gap-1 mb-1">
                {userIds.map((id) => (
                  <span
                    key={id}
                    className="bg-yellow-100 text-[10px] px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    {id}{" "}
                    <X
                      className="w-2 h-2 cursor-pointer"
                      onClick={() => removeId(id, "user")}
                    />
                  </span>
                ))}
              </div>
              <CustomSelect
                placeholder="Search Users..."
                options={userList.map((u) => ({
                  id: u.id,
                  name: `${u.name} (ID: ${u.id})`,
                }))}
                onValueChange={(_, id) =>
                  !userIds.includes(String(id)) &&
                  setUserIds([...userIds, String(id)])
                }
                onSearchChange={(q) => {
                  setUserSearch(q);
                  setUserPage(1);
                }}
                onScrollEnd={() => setUserPage((p) => p + 1)}
                isLoading={isUserFetching}
                value=""
              />
            </div>

            <div className="space-y-2">
              <Label>Select Specific Drivers</Label>
              <div className="flex flex-wrap gap-1 mb-1">
                {driverIds.map((id) => (
                  <span
                    key={id}
                    className="bg-blue-100 text-[10px] px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    {id}{" "}
                    <X
                      className="w-2 h-2 cursor-pointer"
                      onClick={() => removeId(id, "driver")}
                    />
                  </span>
                ))}
              </div>
              <CustomSelect
                placeholder="Search Drivers..."
                options={driverList.map((d) => ({
                  id: d.userId,
                  name: `${d.raider_name || "Driver"} (ID: ${d.userId})`,
                }))}
                onValueChange={(_, id) =>
                  !driverIds.includes(String(id)) &&
                  setDriverIds([...driverIds, String(id)])
                }
                onSearchChange={(q) => {
                  setDriverSearch(q);
                  setDriverPage(1);
                }}
                onScrollEnd={() => setDriverPage((p) => p + 1)}
                isLoading={isDriverFetching}
                value=""
              />
            </div>
          </div>

          {/* Target Role & Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Target Role</Label>
              <Select
                value={targetRole}
                onValueChange={(v: any) => setValue("target_role", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Users</SelectItem>
                  <SelectItem value="RAIDER">Drivers (Raiders)</SelectItem>
                  <SelectItem value="ALL">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Push & Immediate Checkboxes */}
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={watch("push_notification")}
                onCheckedChange={(v: any) => setValue("push_notification", v)}
              />
              <Label>Enable Push Notification</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={sendImmediately}
                onCheckedChange={(v: any) => setValue("send_immediately", v)}
              />
              <Label>Send Immediately</Label>
            </div>
          </div>

          {/* Conditional Scheduling & Expiry */}
          <div className="grid md:grid-cols-2 gap-4">
            {!sendImmediately && (
              <>
                <div className="space-y-2">
                  <Label>Schedule Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch("scheduleDate")?.toLocaleDateString() ||
                            "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={watch("scheduleDate")}
                          onSelect={(d) => setValue("scheduleDate", d)}
                        />
                      </PopoverContent>
                    </Popover>
                    <Select
                      value={watch("scheduleTime")}
                      onValueChange={(v) => setValue("scheduleTime", v)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="09:00" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {TIME_OPTIONS.filter((_, i) => i % 15 === 0).map(
                          (t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch("expiryDate")?.toLocaleDateString() ||
                          "Set expiry"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={watch("expiryDate")}
                        onSelect={(d) => setValue("expiryDate", d)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-yellow-400 text-black hover:bg-yellow-500 w-full px-12 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Promotion..." : "Create & Send Promotion"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNotificationPromotion;
