"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useCreateNotificationRuleMutation,
  useUpdateNotificationRuleMutation,
  useGetNotificationMergeTagsQuery,
} from "@/redux/features/notificationRules/notificationRulesApi";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function NotificationRuleModal({
  isOpen,
  onClose,
  initialData,
}: any) {
  const [lastFocused, setLastFocused] = useState<"title" | "message">(
    "message",
  );
  const [titleSelectionStart, setTitleSelectionStart] = useState<number>(0);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      triggerTag: "ETA_MINUTES",
      operator: "LTE",
      targetValue: "",
      stopScope: "DYNAMIC",
      fixedStopIndex: "" as any,
      notifTitle: "",
      notifMessage: "",
      sendToSender: false,
      sendToRecipient: false,
      viaPush: false,
      viaWhatsApp: false,
      viaSMS: false,
      isActive: true,
    },
  });

  const { ref: titleFormRef, ...titleRegister } = register("notifTitle", {
    required: true,
  });

  const [createRule, { isLoading: isCreating }] =
    useCreateNotificationRuleMutation();
  const [updateRule, { isLoading: isUpdating }] =
    useUpdateNotificationRuleMutation();

  const { data: mergeTagsData, isLoading: isLoadingTags } =
    useGetNotificationMergeTagsQuery({});

  const tagsList = Array.isArray(mergeTagsData)
    ? mergeTagsData
    : (mergeTagsData && typeof mergeTagsData === "object" && "data" in mergeTagsData && Array.isArray((mergeTagsData as any).data))
      ? (mergeTagsData as any).data
      : [];

  const watchTriggerTag = watch("triggerTag");
  const watchStopScope = watch("stopScope");
  const watchIsActive = watch("isActive");
  
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editorMounted, setEditorMounted] = useState(false);

  const setEditorRef = (node: HTMLDivElement | null) => {
    editorRef.current = node;
    setEditorMounted(node !== null);
  };

  const serializeHtmlToString = (html: string): string => {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Replace span chips with their actual merge tags e.g. {driver_name}
    const spans = temp.querySelectorAll("span[data-tag]");
    spans.forEach((span) => {
      const tag = span.getAttribute("data-tag");
      if (tag) {
        span.replaceWith(tag);
      }
    });

    // Replace layout blocks and br tags with newlines
    let text = temp.innerHTML
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<div>/gi, "\n")
      .replace(/<\/div>/gi, "")
      .replace(/<p>/gi, "\n")
      .replace(/<\/p>/gi, "");

    const decoder = document.createElement("div");
    decoder.innerHTML = text;
    return decoder.textContent || decoder.innerText || "";
  };

  const deserializeStringToHtml = (text: string, tagsList: any[]): string => {
    if (!text) return "";
    // Escape HTML characters
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace plain-text tags with non-editable span tags
    tagsList.forEach((tagObj) => {
      const escapedTag = tagObj.tag.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(escapedTag, "g");
      const spanHtml = `<span contenteditable="false" data-tag="${tagObj.tag}" class="inline-flex items-center mx-0.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 select-none cursor-default">${tagObj.tag}</span>`;
      html = html.replace(regex, spanHtml);
    });

    // Convert newlines to <br>
    html = html.replace(/\n/g, "<br>");
    return html;
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const plainText = serializeHtmlToString(html);
      setValue("notifMessage", plainText);
    }
  };

  // Sync initialData or reset to the contenteditable area when modal opens or tags load
  useEffect(() => {
    if (isOpen && editorRef.current) {
      const text = initialData?.notifMessage || "";
      editorRef.current.innerHTML = deserializeStringToHtml(text, tagsList);
    }
  }, [isOpen, initialData, editorMounted, tagsList]);

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        name: initialData.name || "",
        triggerTag: initialData.triggerTag || "ETA_MINUTES",
        operator: initialData.operator || "LTE",
        targetValue: initialData.targetValue || "",
        stopScope: initialData.stopScope || "DYNAMIC",
        fixedStopIndex:
          initialData.fixedStopIndex !== undefined &&
          initialData.fixedStopIndex !== null
            ? initialData.fixedStopIndex.toString()
            : "",
        notifTitle: initialData.notifTitle || "",
        notifMessage: initialData.notifMessage || "",
        sendToSender: !!initialData.sendToSender,
        sendToRecipient: !!initialData.sendToRecipient,
        viaPush: !!initialData.viaPush,
        viaWhatsApp: !!initialData.viaWhatsApp,
        viaSMS: !!initialData.viaSMS,
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
      });
    } else {
      reset({
        name: "",
        triggerTag: "ETA_MINUTES",
        operator: "LTE",
        targetValue: "",
        stopScope: "DYNAMIC",
        fixedStopIndex: "",
        notifTitle: "",
        notifMessage: "",
        sendToSender: false,
        sendToRecipient: false,
        viaPush: false,
        viaWhatsApp: false,
        viaSMS: false,
        isActive: true,
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  }, [initialData, isOpen, reset]);

  const insertMergeTag = (tag: string) => {
    if (lastFocused === "title") {
      const currentTitle = watch("notifTitle") || "";
      const before = currentTitle.substring(0, titleSelectionStart);
      const after = currentTitle.substring(titleSelectionStart);
      const newTitle = before + tag + after;
      setValue("notifTitle", newTitle);

      const newCursorPos = titleSelectionStart + tag.length;
      setTitleSelectionStart(newCursorPos);
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
          titleRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    } else {
      const spanHtml = `<span contenteditable="false" data-tag="${tag}" class="inline-flex items-center mx-0.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 select-none cursor-default">${tag}</span>&nbsp;`;

      let sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel && sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          const editor = editorRef.current;
          if (editor && editor.contains(range.commonAncestorContainer)) {
            range.deleteContents();

            const el = document.createElement("div");
            el.innerHTML = spanHtml;

            const frag = document.createDocumentFragment();
            let node, lastNode;
            while ((node = el.firstChild)) {
              lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            if (lastNode) {
              range = range.cloneRange();
              range.setStartAfter(lastNode);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }

            handleEditorChange();
            return;
          }
        }
      }

      // Fallback if editor is not focused
      if (editorRef.current) {
        editorRef.current.innerHTML += spanHtml;
        handleEditorChange();
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const payload: any = {
        name: data.name,
        triggerTag: data.triggerTag,
        operator: data.operator,
        targetValue: String(data.targetValue),
        stopScope: data.stopScope,
        fixedStopIndex:
          data.stopScope === "FIXED" && data.fixedStopIndex
            ? Number(data.fixedStopIndex)
            : undefined,
        notifTitle: data.notifTitle,
        notifMessage: data.notifMessage,
        sendToSender: data.sendToSender,
        sendToRecipient: data.sendToRecipient,
        viaPush: data.viaPush,
        viaWhatsApp: data.viaWhatsApp,
        viaSMS: data.viaSMS,
        isActive: data.isActive,
      };

      let res;

      if (initialData) {
        res = await updateRule({
          id: initialData.id,
          data: payload,
        }).unwrap();
      } else {
        res = await createRule(payload).unwrap();
      }

      if (!res.success) {
        toast.error(
          res?.error?.message || res?.message || "Failed to perform operation",
        );
        return;
      }

      toast.success(res?.message || "Operation success");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Alert Rule" : "Add Alert Rule"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Rule Name */}
          <div className="space-y-1">
            <Label>Rule Name</Label>
            <Input
              placeholder="e.g. Pickup Proximity Alert (SME Client)"
              {...register("name", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Trigger Tag */}
            <div className="space-y-1">
              <Label>Trigger Tag</Label>
              <Select
                value={watch("triggerTag")}
                onValueChange={(val) => {
                  setValue("triggerTag", val);
                  if (val === "ORDER_STATUS") {
                    setValue("targetValue", "ORDER_PLACED");
                    setValue("operator", "EQ");
                  } else {
                    setValue("targetValue", "");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDER_STATUS">Order Status</SelectItem>
                  <SelectItem value="ETA_MINUTES">ETA (Minutes)</SelectItem>
                  <SelectItem value="ETA_KM">ETA (Kilometers)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Operator */}
            <div className="space-y-1">
              <Label>Operator</Label>
              <Select
                value={watch("operator")}
                onValueChange={(val) => setValue("operator", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Operator" />
                </SelectTrigger>
                <SelectContent>
                  {watchTriggerTag === "ORDER_STATUS" ? (
                    <SelectItem value="EQ">EQ (Equal)</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="LTE">LTE (Less Than/Equal)</SelectItem>
                      <SelectItem value="GTE">
                        GTE (Greater Than/Equal)
                      </SelectItem>
                      <SelectItem value="EQ">EQ (Equal)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Target Value (Conditional Input vs Select) */}
            {watchTriggerTag === "ORDER_STATUS" ? (
              <div className="space-y-1" key="target-value-select">
                <Label>Target Value</Label>
                <Select
                  value={watch("targetValue")}
                  onValueChange={(val) => setValue("targetValue", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Target Status" />
                  </SelectTrigger>
                  {/* <SelectContent>
                    <SelectItem value="LEG_DELIVERED">
                      LEG_DELIVERED / DROP_COMPLETED
                    </SelectItem>
                  </SelectContent> */}
                  <SelectContent>
                    <SelectItem value="ORDER_PLACED">Order Placed</SelectItem>
                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                    <SelectItem value="ARRIVED_AT_PICKUP">
                      Arrived at Pickup
                    </SelectItem>
                    <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1" key="target-value-input">
                <Label>Target Value</Label>
                <Input
                  type="number"
                  placeholder="e.g. 10"
                  {...register("targetValue", { required: true })}
                />
              </div>
            )}

            {/* Stop Scope */}
            <div className="space-y-1">
              <Label>Stop Scope</Label>
              <Select
                value={watch("stopScope")}
                onValueChange={(val) => setValue("stopScope", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DYNAMIC">Dynamic</SelectItem>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fixed Stop Index (Conditional) */}
          {watchStopScope === "FIXED" && (
            <div className="space-y-1">
              <Label>Fixed Stop Index</Label>
              <Input
                type="number"
                placeholder="e.g. 1"
                {...register("fixedStopIndex", { required: true })}
              />
            </div>
          )}

          {/* Notification Title */}
          <div className="space-y-1">
            <Label>Notification Title</Label>
            <Input
              placeholder="e.g. The Driver is 5 Mins from Pickup!"
              {...titleRegister}
              ref={(e) => {
                titleFormRef(e);
                titleRef.current = e;
              }}
              onFocus={() => setLastFocused("title")}
              onBlur={(e) => {
                setTitleSelectionStart(e.target.selectionStart || 0);
                titleRegister.onBlur(e);
              }}
            />
          </div>

          {/* Notification Message (Rich Contenteditable Editor) */}
          <div className="space-y-2">
            <Label>Notification Message</Label>
            <div className="relative">
              <div
                ref={setEditorRef}
                contentEditable
                data-placeholder="Write message template..."
                className="min-h-[140px] max-h-[250px] overflow-y-auto w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none transition-all leading-relaxed"
                onInput={handleEditorChange}
                onBlur={handleEditorChange}
                onFocus={() => setLastFocused("message")}
              />
            </div>

            {/* Merge Tags Helper */}
            <div className="space-y-1.5 bg-gray-50 border rounded-lg p-3">
              <Label className="text-xs text-gray-500 font-semibold">
                Available Merge Tags (Click to Insert):
              </Label>
              {isLoadingTags ? (
                <div className="flex items-center space-x-2 text-xs text-gray-400 py-1">
                  <Loader2 className="animate-spin h-3.5 w-3.5 text-primary" />
                  <span>Loading available tags...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {tagsList.map((tagObj: any) => (
                    <button
                      key={tagObj.tag}
                      type="button"
                      onClick={() => insertMergeTag(tagObj.tag)}
                      className="cursor-pointer inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border bg-white text-gray-700 hover:bg-primary/10 hover:border-primary transition-all duration-150 shadow-xs hover:shadow-sm"
                    >
                      {tagObj.label}{" "}
                      <span className="text-gray-400 font-normal ml-1">
                        ({tagObj.example})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recipients Config */}
          <div className="border rounded-lg p-4 bg-gray-50/50 space-y-3">
            <Label className="text-sm font-semibold text-gray-700">
              Recipients
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={watch("sendToSender")}
                  onCheckedChange={(val) => setValue("sendToSender", val)}
                />
                <span className="text-sm text-gray-600">
                  Send to SME Client (Sender)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={watch("sendToRecipient")}
                  onCheckedChange={(val) => setValue("sendToRecipient", val)}
                />
                <span className="text-sm text-gray-600">Send to Recipient</span>
              </div>
            </div>
          </div>

          {/* Channels Config */}
          <div className="border rounded-lg p-4 bg-gray-50/50 space-y-3">
            <Label className="text-sm font-semibold text-gray-700">
              Notification Channels
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={watch("viaPush")}
                  onCheckedChange={(val) => setValue("viaPush", val)}
                />
                <span className="text-sm text-gray-600">Push Notification</span>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={watch("viaWhatsApp")}
                  onCheckedChange={(val) => setValue("viaWhatsApp", val)}
                />
                <span className="text-sm text-gray-600">WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={watch("viaSMS")}
                  onCheckedChange={(val) => setValue("viaSMS", val)}
                />
                <span className="text-sm text-gray-600">SMS</span>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="space-y-1">
            <Label>Active Status</Label>
            <Select
              value={watchIsActive ? "true" : "false"}
              onValueChange={(val) => setValue("isActive", val === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-black font-semibold"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : initialData ? (
              "Update Alert Rule"
            ) : (
              "Create Alert Rule"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
