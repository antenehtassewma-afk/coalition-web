"use client";
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // 1. Define the callback
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { 
          pageLanguage: "en", 
          includedLanguages: "en,am" 
          // I completely removed the 'layout' property here. 
          // This forces the standard dropdown and stops the external redirect.
        },
        "google_translate_element"
      );
    };

    // 2. Inject script with https explicitly defined
    if (!document.querySelector("#google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.id = "google-translate-script";
      addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(addScript);
    }
  }, []);

  return (
    // Added pointer-events-auto to ensure Next.js/Tailwind doesn't block the click
    <div id="google_translate_element" className="pointer-events-auto z-[100]"></div>
  );
}