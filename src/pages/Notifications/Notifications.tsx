/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  Bell,
  Mail,
  Globe,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

// ------------------ ZOD SCHEMA
const NotificationSchema = z.object({
  channel: z.enum(["push", "email", "web"]),

  title: z.string().min(1).max(80),
  message: z.string().min(1).max(200),

  sendToDrivers: z.boolean().optional(),
  sendToUsers: z.boolean().optional(),
  sendToAll: z.boolean().optional(),

  sendToWebPortal: z.boolean().optional(),

  sendImmediately: z.boolean().optional(),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
});

type NotificationType = z.infer<typeof NotificationSchema>;

// Generate time options with minute-level granularity
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute++) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

export default function NotificationComposer() {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("09:00");
  const [activeTab, setActiveTab] = useState<"push" | "email" | "web">("push");
  const [addNotification, { isLoading }] = useAddNotificationMutation();

  const tabConfig = {
    push: {
      titleLabel: "Notification Title",
      titlePlaceholder: "Enter title for notification",
      messageLabel: "Notification Text",
      messagePlaceholder: "Enter your text here...",
      footerText:
        "Push notifications have a 200 character limit for optimal delivery",
      submitText: "Send Notification",
      type: "PUSH_NOTIFICATION" as const,
    },
    email: {
      titleLabel: "Email Title",
      titlePlaceholder: "Enter title for e-mail",
      messageLabel: "Write E-mail",
      messagePlaceholder: "Enter your text here...",
      footerText: "",
      submitText: "Send E-mail",
      type: "EMAIL" as const,
    },
    web: {
      titleLabel: "Announcement Title",
      titlePlaceholder: "Enter announcement title",
      messageLabel: "Announcement Message",
      messagePlaceholder: "Write announcement message...",
      footerText: "",
      submitText: "Publish Announcement",
      type: "WEB_ANNOUNCEMENT" as const,
    },
  };

  const form = useForm<NotificationType>({
    resolver: zodResolver(NotificationSchema),
    defaultValues: {
      channel: "push",
      sendToDrivers: false,
      sendToUsers: false,
      sendToAll: false,
      sendToWebPortal: false,
      sendImmediately: false,
      scheduleTime: "09:00",
    },
  });

  const currentTitle = form.watch("title") || "";
  const currentMessage = form.watch("message") || "";
  const sendToDrivers = form.watch("sendToDrivers");
  const sendToUsers = form.watch("sendToUsers");
  const sendToAll = form.watch("sendToAll");
  const sendImmediately = form.watch("sendImmediately");

  const getTargetRole = () => {
    if (sendToAll) return "ALL";
    if (sendToDrivers && sendToUsers) return "ALL";
    if (sendToDrivers) return "RAIDER";
    if (sendToUsers) return "USER";
    return "ALL";
  };

  const combineDateTimeToISO = (date: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime.toISOString();
  };

  const onSubmit = async (data: NotificationType) => {
    toast.loading("Sending notification...");
    try {
      const targetRole = getTargetRole();
      const currentTabConfig = tabConfig[activeTab];

      const payload: any = {
        type: currentTabConfig.type,
        title: data.title,
        message: data.message,
        target_role: targetRole,
      };

      if (data.scheduleDate && !data.sendImmediately && data.scheduleTime) {
        payload.schedule_to_send = combineDateTimeToISO(
          data.scheduleDate,
          data.scheduleTime,
        );
      } else {
        payload.send_immediately = true;
      }

      const result = await addNotification(payload).unwrap();

      if (result.success) {
        toast.dismiss();
        toast.success(result.message || "Notification sent successfully!");

        form.reset({
          channel: activeTab,
          title: "",
          message: "",
          sendToDrivers: false,
          sendToUsers: false,
          sendToAll: false,
          sendToWebPortal: false,
          sendImmediately: false,
          scheduleDate: undefined,
          scheduleTime: "09:00",
        });
        setDate(undefined);
        setTime("09:00");
      } else {
        toast.dismiss();
        toast.error(result.message || "Failed to send notification");
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Failed to send notification:", error);
      toast.error(error?.data?.message || "Failed to send notification");
    }
  };

  const handleSendToAllChange = (checked: boolean) => {
    form.setValue("sendToAll", checked);
    if (checked) {
      form.setValue("sendToDrivers", false);
      form.setValue("sendToUsers", false);
    }
  };

  const handleSendToDriversChange = (checked: boolean) => {
    form.setValue("sendToDrivers", checked);
    if (checked) {
      form.setValue("sendToAll", false);
    }
  };

  const handleSendToUsersChange = (checked: boolean) => {
    form.setValue("sendToUsers", checked);
    if (checked) {
      form.setValue("sendToAll", false);
    }
  };

  const handleSendImmediatelyChange = (checked: boolean) => {
    form.setValue("sendImmediately", checked);
    if (checked) {
      form.setValue("scheduleDate", undefined);
      form.setValue("scheduleTime", undefined);
      setDate(undefined);
      setTime("09:00");
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!sendImmediately) {
      setDate(selectedDate);
      form.setValue("scheduleDate", selectedDate || undefined);
      form.setValue("sendImmediately", false);
    }
  };

  const handleTimeChange = (selectedTime: string) => {
    setTime(selectedTime);
    form.setValue("scheduleTime", selectedTime);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen">
      <div className="w-full mx-auto space-y-4 mb-6">
        <h1 className="text-black text-xl sm:text-2xl font-bold">
          Notifications & Communication
        </h1>
        <div className="p-4 sm:p-6 md:px-12 lg:px-20 xl:px-44 rounded-md space-y-6 sm:space-y-8 bg-white">
          {/* HEADER */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Message Composer
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Create and schedule notifications across multiple channels
            </p>
          </div>

          {/* CHANNEL TABS */}
          <Tabs
            defaultValue="push"
            onValueChange={(val) => {
              setActiveTab(val as "push" | "email" | "web");
              form.setValue("channel", val as "push" | "email" | "web");
            }}
          >
            <TabsList className="w-full grid grid-cols-3 rounded-full bg-gray-100 p-1">
              <TabsTrigger
                value="push"
                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm px-2 sm:px-4"
              >
                <Bell className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Push Notifications</span>
                <span className="sm:hidden">Push</span>
              </TabsTrigger>

              <TabsTrigger
                value="email"
                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm px-2 sm:px-4"
              >
                <Mail className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Email/SMS</span>
                <span className="sm:hidden">Email</span>
              </TabsTrigger>

              <TabsTrigger
                value="web"
                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm px-2 sm:px-4"
              >
                <Globe className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Web Announcement</span>
                <span className="sm:hidden">Web</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="push"></TabsContent>
            <TabsContent value="email"></TabsContent>
            <TabsContent value="web"></TabsContent>
          </Tabs>

          {/* FORM */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm">
                {tabConfig[activeTab].titleLabel}
              </Label>
              <Input
                {...form.register("title")}
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
                {...form.register("message")}
                placeholder={tabConfig[activeTab].messagePlaceholder}
                maxLength={200}
                className="min-h-[130px] mt-2"
              />

              <p className="text-xs text-gray-400 text-right mt-1">
                {currentMessage.length}/200
              </p>

              {tabConfig[activeTab].footerText && (
                <p className="text-xs text-gray-500 mt-1">
                  {tabConfig[activeTab].footerText}
                </p>
              )}
            </div>

            {/* Send to App */}
            <div className="space-y-2">
              <Label className="text-sm">
                {activeTab === "email"
                  ? "Send E-mails to"
                  : "Send notifications to App"}
              </Label>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToDrivers}
                    onCheckedChange={handleSendToDriversChange}
                  />
                  <span className="text-sm">Drivers</span>
                </div>

                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToUsers}
                    onCheckedChange={handleSendToUsersChange}
                  />
                  <span className="text-sm">Users</span>
                </div>

                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={sendToAll}
                    onCheckedChange={handleSendToAllChange}
                  />
                  <span className="text-sm">
                    {activeTab === "email" ? "All" : "All"}
                  </span>
                </div>
              </div>
            </div>

            {/* Web Portal */}
            {activeTab !== "email" && (
              <div className="space-y-2">
                <Label className="text-sm">
                  Send notifications to Web Portal
                </Label>

                <div className="flex gap-2 items-center">
                  <Checkbox {...form.register("sendToWebPortal")} />
                  <span className="text-sm">Enable</span>
                </div>
              </div>
            )}

            {/* Send Immediately + Schedule */}
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={sendImmediately}
                  onCheckedChange={handleSendImmediatelyChange}
                />
                <Label className="text-sm">
                  {activeTab === "email"
                    ? "Send Immediately"
                    : "Send Immediately"}
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Picker */}
                <div className="flex flex-col space-y-2">
                  <Label className="text-sm">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={sendImmediately}
                        className={cn(
                          "w-full justify-start text-left font-normal text-sm",
                          !date && "text-muted-foreground",
                          sendImmediately && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={sendImmediately}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Picker with Minute Precision */}
                <div className="flex flex-col space-y-2">
                  <Label className="text-sm">Select Time (HH:MM)</Label>
                  <Select
                    disabled={sendImmediately || !date}
                    value={time}
                    onValueChange={handleTimeChange}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        (sendImmediately || !date) &&
                          "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <SelectValue placeholder="Select time">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {time || "Select time"}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      className="max-h-[300px] overflow-y-auto"
                      position="popper"
                      sideOffset={5}
                    >
                      {TIME_OPTIONS.map((timeOption) => (
                        <SelectItem key={timeOption} value={timeOption}>
                          {timeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {!date && "Select a date first to enable time selection"}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="w-full flex justify-center mt-6">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="bg-yellow-400 text-black hover:bg-yellow-500 w-full sm:w-auto px-8"
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
