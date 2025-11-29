"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Bell, Mail, Globe } from "lucide-react";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
});

type NotificationType = z.infer<typeof NotificationSchema>;

export default function NotificationComposer() {
    const [date, setDate] = useState<Date>();
    const [activeTab, setActiveTab] = useState<"push" | "email" | "web">("push");

    // Dynamic UI text per tab
    const tabConfig = {
        push: {
            titleLabel: "Notification Title",
            titlePlaceholder: "Enter title for notification",
            messageLabel: "Notification Text",
            messagePlaceholder: "Enter your text here...",
            footerText: "Push notifications have a 200 character limit for optimal delivery",
            submitText: "Send Notification",
        },
        email: {
            titleLabel: "Email Title",
            titlePlaceholder: "Enter title for e-mail",
            messageLabel: "Write E-mail",
            messagePlaceholder: "Enter your text here...",
            footerText: "",
            submitText: "Send E-mail",
        },
        web: {
            titleLabel: "Announcement Title",
            titlePlaceholder: "Enter announcement title",
            messageLabel: "Announcement Message",
            messagePlaceholder: "Write announcement message...",
            footerText: "",
            submitText: "Publish Announcement",
        }
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
        },
    });

    const currentTitle = form.watch("title") || "";
    const currentMessage = form.watch("message") || "";

    const onSubmit = (data: NotificationType) => {
        console.log("FORM DATA:", data);
        
        // Clear the form after submission
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
        });
        setDate(undefined);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen">
            <div className="w-full mx-auto space-y-4 mb-6">
                <h1 className="text-black text-xl sm:text-2xl font-bold">Notifications & Communication</h1>
                <div className="p-4 sm:p-6 md:px-12 lg:px-20 xl:px-44 rounded-md space-y-6 sm:space-y-8 bg-white">

                    {/*  HEADER */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold">Message Composer</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Create and schedule notifications across multiple channels
                        </p>
                    </div>

                    {/* CHANNEL TABS */}
                    <Tabs
                        defaultValue="push"
                        onValueChange={(val) => {
                            setActiveTab(val as never);
                            form.setValue("channel", val as never);
                        }}
                    >
                        <TabsList className="w-full grid grid-cols-3 rounded-full bg-gray-100 p-1">
                            <TabsTrigger
                                value="push"
                                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm px-2 sm:px-4">
                                <Bell className="h-4 w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Push Notifications</span>
                                <span className="sm:hidden">Push</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="email"
                                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm px-2 sm:px-4">
                                <Mail className="h-4 w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Email/SMS</span>
                                <span className="sm:hidden">Email</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="web"
                                className="rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm px-2 sm:px-4">
                                <Globe className="h-4 w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Web Announcement</span>
                                <span className="sm:hidden">Web</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="push"></TabsContent>
                        <TabsContent value="email"></TabsContent>
                        <TabsContent value="web"></TabsContent>
                    </Tabs>

                    {/* ---------------------- FORM --------------------- */}
                    <div className="space-y-6">

                        <div>
                            <Label className="text-sm">{tabConfig[activeTab].titleLabel}</Label>
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

                        {/* ---- Message ---- */}
                        <div>
                            <Label className="text-sm">{tabConfig[activeTab].messageLabel}</Label>
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

                        {/* -------- Send to App -------- */}
                        <div className="space-y-2">
                            <Label className="text-sm">
                                {activeTab === "email"
                                    ? "Send E-mails to"
                                    : "Send notifications to App"}
                            </Label>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                <div className="flex gap-2 items-center">
                                    <Checkbox {...form.register("sendToDrivers")} />
                                    <span className="text-sm">Drivers</span>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <Checkbox {...form.register("sendToUsers")} />
                                    <span className="text-sm">Users</span>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <Checkbox {...form.register("sendToAll")} />
                                    <span className="text-sm">{activeTab === "email" ? "Both" : "All"}</span>
                                </div>
                            </div>
                        </div>

                        {/* -------- Web Portal */}
                        {activeTab !== "email" && (
                            <div className="space-y-2">
                                <Label className="text-sm">Send notifications to Web Portal</Label>

                                <div className="flex gap-2 items-center">
                                    <Checkbox {...form.register("sendToWebPortal")} />
                                    <span className="text-sm">Enable</span>
                                </div>
                            </div>
                        )}

                        {/* ---- Send Immediately + Schedule ---- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="flex gap-2 items-center">
                                <Checkbox {...form.register("sendImmediately")} />
                                <Label className="text-sm">
                                    {activeTab === "email" ? "Send Immediately" : "Send Immediately"}
                                </Label>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Label className="text-sm">
                                    {activeTab === "email"
                                        ? "Schedule E-mail"
                                        : "Schedule Notification"}
                                </Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal text-sm",
                                                !date && "text-muted-foreground"
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
                                                form.setValue("scheduleDate", d || undefined);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="w-full flex justify-center mt-6">
                            <Button 
                                onClick={form.handleSubmit(onSubmit)}
                                className="bg-yellow-400 text-black hover:bg-yellow-500 w-full sm:w-auto px-8"
                            >
                                {tabConfig[activeTab].submitText}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}