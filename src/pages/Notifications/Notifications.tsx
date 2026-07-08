/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Bell, Smartphone, X } from "lucide-react";
import toast from "react-hot-toast";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useAddNotificationMutation } from "@/redux/features/notificationServices/notificationServicesApi";
import { useGetUserTypesQuery } from "@/redux/features/usersTypes/usersTypesApi";
import { useGetRiderProfilesQuery } from "@/redux/features/drivers/driversApi";
import CustomSelect from "../../components/Shared/CustomSelect/CustomSelect";

const NotificationSchema = z.object({
  channel: z.enum(["push", "in_app"]),
  title: z.string().min(1).max(80),
  message: z.string().min(1).max(200),
  sendToDrivers: z.boolean().optional(),
  sendToUsers: z.boolean().optional(),
  sendToAll: z.boolean().optional(),
  sendToWebPortal: z.boolean().optional(),
  sendImmediately: z.boolean().optional(),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
  orderId: z.string().optional(),
});

type NotificationType = z.infer<typeof NotificationSchema>;

const TIME_OPTIONS = Array.from({ length: 24 * 60 }, (_, i) => {
  const hour = Math.floor(i / 60)
    .toString()
    .padStart(2, "0");
  const minute = (i % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
});

export default function NotificationComposer() {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("09:00");
  const [activeTab, setActiveTab] = useState<"push" | "in_app">("push");

  const [userIds, setUserIds] = useState<string[]>([]);
  const [driverIds, setDriverIds] = useState<string[]>([]);

  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userList, setUserList] = useState<any[]>([]);

  const [driverPage, setDriverPage] = useState(1);
  const [driverSearch, setDriverSearch] = useState("");
  const [driverList, setDriverList] = useState<any[]>([]);

  const [addNotification, { isLoading }] = useAddNotificationMutation();

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

  const form = useForm<NotificationType>({
    resolver: zodResolver(NotificationSchema),
    defaultValues: {
      channel: "push",
      title: "",
      message: "",
      sendToDrivers: false,
      sendToUsers: false,
      sendToAll: false,
      sendToWebPortal: false,
      sendImmediately: false,
      scheduleTime: "09:00",
      orderId: "",
    },
  });

  const { watch, setValue, register, handleSubmit, reset } = form;
  const sendToDrivers = watch("sendToDrivers");
  const sendToUsers = watch("sendToUsers");
  const sendToAll = watch("sendToAll");
  const sendImmediately = watch("sendImmediately");

  const tabConfig = {
    push: {
      titleLabel: "Notification Title",
      titlePlaceholder: "Enter title for push notification",
      messageLabel: "Notification Message",
      messagePlaceholder: "Enter your text here...",
      type: "PUSH_NOTIFICATION" as const,
      submitText: "Send Push Notification",
    },
    in_app: {
      titleLabel: "In-App Title",
      titlePlaceholder: "Enter title for in-app message",
      messageLabel: "In-App Message",
      messagePlaceholder: "Enter message content...",
      type: "IN_APP" as const,
      submitText: "Send In-App Message",
    },
  };

  const removeId = (id: string, type: "user" | "driver") => {
    if (type === "user") setUserIds((prev) => prev.filter((i) => i !== id));
    else setDriverIds((prev) => prev.filter((i) => i !== id));
  };

  const onSubmit = async (data: NotificationType) => {
    const loadingToast = toast.loading("Sending notification...");
    try {
      const combinedIds = [...userIds, ...driverIds].map(Number);

      const payload: any = {
        type: tabConfig[activeTab].type,
        category: "NOTIFICATION",
        title: data.title,
        message: data.message,
        target_role: sendToAll
          ? "ALL"
          : sendToDrivers && sendToUsers
            ? "ALL"
            : sendToDrivers
              ? "RAIDER"
              : sendToUsers
                ? "USER"
                : "",
        target_user_ids: combinedIds,
        orderId: data.orderId ? Number(data.orderId) : undefined,
        send_immediately: data.sendImmediately || !data.scheduleDate,
      };

      if (data.scheduleDate && !data.sendImmediately && data.scheduleTime) {
        const [hours, minutes] = data.scheduleTime.split(":").map(Number);
        const schedDate = new Date(data.scheduleDate);
        schedDate.setHours(hours, minutes, 0, 0);
        payload.schedule_to_send = schedDate.toISOString();
        payload.send_immediately = false;
      }

      const result = await addNotification(payload).unwrap();
      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success(result.message || "Sent successfully!");
        reset();
        setUserIds([]);
        setDriverIds([]);
        setDate(undefined);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Failed to send notification");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen">
      <div className="w-full mx-auto space-y-4 mb-6">
        <h1 className="text-black text-xl sm:text-2xl font-bold">
          Notifications & Communication
        </h1>

        <div className="p-4 sm:p-6 md:px-12 lg:px-20 xl:px-44 rounded-md space-y-6 sm:space-y-8 bg-white">
          <Tabs
            value={activeTab}
            onValueChange={(val: any) => {
              setActiveTab(val);
              setValue("channel", val);
            }}
          >
            <TabsList className="w-full grid grid-cols-2 rounded-full bg-gray-100 p-1">
              <TabsTrigger
                value="push"
                className="rounded-full data-[state=active]:bg-yellow-400 cursor-pointer"
              >
                <Bell className="h-4 w-4 mr-2" /> Push
              </TabsTrigger>
              <TabsTrigger
                value="in_app"
                className="rounded-full data-[state=active]:bg-yellow-400 cursor-pointer"
              >
                <Smartphone className="h-4 w-4 mr-2" /> In-App
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {/* Title & Message */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm">
                  {tabConfig[activeTab].titleLabel}
                </Label>
                <Input
                  {...register("title")}
                  placeholder={tabConfig[activeTab].titlePlaceholder}
                  maxLength={80}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm">
                  {tabConfig[activeTab].messageLabel}
                </Label>
                <Textarea
                  {...register("message")}
                  placeholder={tabConfig[activeTab].messagePlaceholder}
                  maxLength={200}
                  className="min-h-[130px] mt-2"
                />
              </div>
            </div>

            {/* CustomSelect for Users */}
            <div className="space-y-2">
              <Label className="text-sm">Target User IDs (Select to add)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {userIds.map((id) => (
                  <span
                    key={id}
                    className="bg-gray-100 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {id}{" "}
                    <X
                      className="h-3 w-3 cursor-pointer"
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
                onValueChange={(_name, id) =>
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

            {/* CustomSelect for Drivers */}
            <div className="space-y-2">
              <Label className="text-sm">
                Target Driver IDs (Select to add)
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {driverIds.map((id) => (
                  <span
                    key={id}
                    className="bg-gray-100 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {id}{" "}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeId(id, "driver")}
                    />
                  </span>
                ))}
              </div>
              <CustomSelect
                placeholder="Search Drivers..."
                options={driverList.map((d) => ({
                  id: d.userId,
                  name: `${d.registrations[0].raider_name || "Driver"} (User ID: ${d.userId})`,
                }))}
                onValueChange={(_name, id) =>
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

            {/* Order ID field */}
            <div>
              <Label className="text-sm">Order ID (Optional)</Label>
              <Input
                {...register("orderId")}
                type="number"
                placeholder="Enter Order ID"
                className="mt-2"
              />
            </div>

            {/* Role Checkboxes */}
            <div className="space-y-2">
              <Label className="text-sm">Send to App Roles</Label>
              <div className="flex gap-4">
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToDrivers}
                    onCheckedChange={(c: any) => {
                      setValue("sendToDrivers", c);
                      if (c) setValue("sendToAll", false);
                    }}
                  />
                  <span className="text-sm">Drivers</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToUsers}
                    onCheckedChange={(c: any) => {
                      setValue("sendToUsers", c);
                      if (c) setValue("sendToAll", false);
                    }}
                  />
                  <span className="text-sm">Users</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToAll}
                    onCheckedChange={(c: any) => {
                      setValue("sendToAll", c);
                      if (c) {
                        setValue("sendToDrivers", false);
                        setValue("sendToUsers", false);
                      }
                    }}
                  />
                  <span className="text-sm">All</span>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="pt-4 border-t space-y-4">
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={sendImmediately}
                  onCheckedChange={(c: any) => setValue("sendImmediately", c)}
                />
                <Label className="text-sm">Send Immediately</Label>
              </div>
              {!sendImmediately && (
                <div className="grid grid-cols-2 gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          setValue("scheduleDate", d);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Select
                    value={time}
                    onValueChange={(t) => {
                      setTime(t);
                      setValue("scheduleTime", t);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="09:00" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {TIME_OPTIONS.filter((_, idx) => idx % 15 === 0).map(
                        (opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-yellow-400 text-black hover:bg-yellow-500 w-full px-12 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : tabConfig[activeTab].submitText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
