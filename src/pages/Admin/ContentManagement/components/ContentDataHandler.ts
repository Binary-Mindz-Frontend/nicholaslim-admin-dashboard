/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_TO_UI_MAP, ContentType } from "@/types/contentManagementType";
import { useState, useEffect } from "react";

export const useContentDataHandler = (contentResponse: any) => {
  const [contentData, setContentData] = useState<Record<ContentType, string>>({
    "Terms & Conditions": "",
    "Privacy Policy": "",
    "Cancellation & Waiting Policy": "",
    "FAQ List": "",
    "Help Articles List": "",
    "About Us": "",
  });

  // Load content data from API
  useEffect(() => {
    if (contentResponse?.data) {
      const newContentData: Record<ContentType, string> = {
        "Terms & Conditions": "",
        "Privacy Policy": "",
        "Cancellation & Waiting Policy": "",
        "FAQ List": "",
        "Help Articles List": "",
        "About Us": "",
      };

      contentResponse.data.forEach((item: any) => {
        const uiType = API_TO_UI_MAP[item.contenttype];
        if (uiType && item.description) {
          newContentData[uiType] = item.description;
        }
      });

      setContentData(newContentData);
    }
  }, [contentResponse]);

  return { contentData, setContentData };
};