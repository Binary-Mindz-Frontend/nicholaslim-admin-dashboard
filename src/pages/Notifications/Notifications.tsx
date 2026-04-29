/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  Bell,
  Smartphone,
  X,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useAddNotificationMutation } from "@/redux/features/notificationServices/notificationServicesApi";

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
  const [userInputValue, setUserInputValue] = useState("");
  const [driverInputValue, setDriverInputValue] = useState("");

  const [addNotification, { isLoading }] = useAddNotificationMutation();

  const tabConfig = {
    push: {
      titleLabel: "Notification Title",
      titlePlaceholder: "Enter title for push notification",
      messageLabel: "Notification Message",
      messagePlaceholder: "Enter your text here...",
      footerText: "Push notifications have a 200 character limit",
      submitText: "Send Push Notification",
      type: "PUSH_NOTIFICATION" as const,
    },
    in_app: {
      titleLabel: "In-App Title",
      titlePlaceholder: "Enter title for in-app message",
      messageLabel: "In-App Message",
      messagePlaceholder: "Enter message content...",
      footerText: "",
      submitText: "Send In-App Message",
      type: "IN_APP" as const,
    },
  };

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
  const currentTitle = watch("title") || "";
  const currentMessage = watch("message") || "";
  const sendToDrivers = watch("sendToDrivers");
  const sendToUsers = watch("sendToUsers");
  const sendToAll = watch("sendToAll");
  const sendImmediately = watch("sendImmediately");

  const getTargetRole = () => {
    if (sendToAll) return "ALL";
    if (sendToDrivers && sendToUsers) return "ALL";
    if (sendToDrivers) return "RAIDER";
    if (sendToUsers) return "USER";
    return "ALL";
  };

  const handleAddId = (
    e: KeyboardEvent<HTMLInputElement>,
    type: "user" | "driver",
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value =
        type === "user" ? userInputValue.trim() : driverInputValue.trim();
      if (value) {
        if (type === "user") {
          setUserIds((prev) => [...new Set([...prev, value])]);
          setUserInputValue("");
        } else {
          setDriverIds((prev) => [...new Set([...prev, value])]);
          setDriverInputValue("");
        }
      }
    }
  };

  const removeId = (id: string, type: "user" | "driver") => {
    if (type === "user") setUserIds((prev) => prev.filter((i) => i !== id));
    else setDriverIds((prev) => prev.filter((i) => i !== id));
  };

  const combineDateTimeToISO = (date: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime.toISOString();
  };

  const onSubmit = async (data: NotificationType) => {
    const loadingToast = toast.loading("Sending notification...");
    try {
      const targetRole = getTargetRole();

      const rawUserIds = [...userIds];
      if (userInputValue.trim()) rawUserIds.push(userInputValue.trim());

      const rawDriverIds = [...driverIds];
      if (driverInputValue.trim()) rawDriverIds.push(driverInputValue.trim());

      const combinedIds = [...rawUserIds, ...rawDriverIds]
        .map((id) => {
          const numericPart = id.replace(/\D/g, "");
          return numericPart ? Number(numericPart) : NaN;
        })
        .filter((id) => !isNaN(id));

      console.log("Processing Payload IDs:", {
        userIds,
        driverIds,
        userInputValue,
        driverInputValue,
        combinedIds,
      });

      const payload: any = {
        type: tabConfig[activeTab].type,
        category: "NOTIFICATION",
        title: data.title,
        message: data.message,
        target_role: targetRole,
        target_user_ids: combinedIds,
        orderId: data.orderId ? Number(data.orderId) : undefined,
      };

      if (data.scheduleDate && !data.sendImmediately && data.scheduleTime) {
        payload.schedule_to_send = combineDateTimeToISO(
          data.scheduleDate,
          data.scheduleTime,
        );
        payload.send_immediately = false;
      } else {
        payload.send_immediately = true;
      }

      console.log("Final payload", payload);

      const result = await addNotification(payload).unwrap();

      if (!result.success) {
        toast.dismiss(loadingToast);
        toast.error(result.message || "Failed to send notification");
        return;
      }

      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success(result.message || "Sent successfully!");

        reset();
        setUserIds([]);
        setDriverIds([]);
        setUserInputValue("");
        setDriverInputValue("");
        setDate(undefined);
        setTime("09:00");
        setActiveTab("push");
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
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Message Composer
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Create and schedule notifications
            </p>
          </div>

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
                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black cursor-pointer"
              >
                <Bell className="h-4 w-4 mr-2" /> Push
              </TabsTrigger>
              <TabsTrigger
                value="in_app"
                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black cursor-pointer"
              >
                <Smartphone className="h-4 w-4 mr-2" /> In-App
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {/* Title */}
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
              <p className="text-xs text-gray-400 text-right mt-1">
                {currentTitle.length}/80
              </p>
            </div>

            {/* Message */}
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
              <p className="text-xs text-gray-400 text-right mt-1">
                {currentMessage.length}/200
              </p>
            </div>

            {/* NEW: User IDs Input */}
            <div className="space-y-2">
              <Label className="text-sm">
                Target User IDs (Press Enter to add)
              </Label>
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
              <Input
                value={userInputValue}
                onChange={(e) => setUserInputValue(e.target.value)}
                onKeyDown={(e) => handleAddId(e, "user")}
                placeholder="e.g. 101"
              />
            </div>

            {/* NEW: Driver IDs Input */}
            <div className="space-y-2">
              <Label className="text-sm">
                Target Driver IDs (Press Enter to add)
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
              <Input
                value={driverInputValue}
                onChange={(e) => setDriverInputValue(e.target.value)}
                onKeyDown={(e) => handleAddId(e, "driver")}
                placeholder="e.g. 505"
              />
            </div>

            {/* NEW: Order ID Input */}
            <div>
              <Label className="text-sm">Order ID (Optional)</Label>
              <Input
                {...register("orderId")}
                type="number"
                placeholder="Enter Order ID"
                className="mt-2"
              />
            </div>

            {/* Roles Checkboxes */}
            <div className="space-y-2">
              <Label className="text-sm">Send to App Roles</Label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToDrivers}
                    onCheckedChange={(c: boolean) => {
                      setValue("sendToDrivers", c);
                      if (c) setValue("sendToAll", false);
                    }}
                  />
                  <span className="text-sm">Drivers</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToUsers}
                    onCheckedChange={(c: boolean) => {
                      setValue("sendToUsers", c);
                      if (c) setValue("sendToAll", false);
                    }}
                  />
                  <span className="text-sm">Users</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToAll}
                    onCheckedChange={(c: boolean) => {
                      setValue("sendToAll", c);
                      if (c) {
                        setValue("sendToDrivers", false);
                        setValue("sendToUsers", false);
                      }
                    }}
                  />
                  <span className="text-sm">
                    {sendToDrivers || sendToUsers ? "All" : "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={sendImmediately}
                  onCheckedChange={(c: boolean) => {
                    setValue("sendImmediately", c);
                    if (c) {
                      setDate(undefined);
                      setTime("09:00");
                    }
                  }}
                />
                <Label className="text-sm">Send Immediately</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label className="text-sm">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={sendImmediately}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
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
                        disabled={sendImmediately}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label className="text-sm">Select Time</Label>
                  <Select
                    disabled={sendImmediately || !date}
                    value={time}
                    onValueChange={(t) => {
                      setTime(t);
                      setValue("scheduleTime", t);
                    }}
                  >
                    <SelectTrigger className="w-full">
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
              </div>
            </div>

            <div className="w-full flex justify-center mt-6">
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-yellow-400 text-black hover:bg-yellow-500 w-full sm:w-auto px-12 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : tabConfig[activeTab].submitText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
