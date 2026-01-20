import { useEffect } from "react";
import api from "./api";
import { useLocation } from "react-router-dom";

/**
 * SEO component: Fetches SEO data from backend and injects meta tags dynamically.
 * Usage: Place <SEO /> at the top of each page component.
 */
export default function SEO() {
  const location = useLocation();
  // Normalize host so it matches how values are stored in DB
  const rawHost = window.location.hostname || "";
  const normalizedHost = rawHost.replace(/^www\./i, "").toLowerCase();
  // Allow overriding the site for local/dev via env (e.g. VITE_SEO_SITE=a7satta.vip)
  const site = (import.meta.env.VITE_SEO_SITE || normalizedHost || "a7satta.vip").toLowerCase();

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        // Use the full pathname for page (so /chart-2026/agra-satta-king-result matches backend)
        const page = location.pathname;
        const { data } = await api.get(
          `/seo/get?page=${encodeURIComponent(page)}&site=${encodeURIComponent(site)}`
        );
        if (data) {
          // Title
          if (typeof data.metaTitle === "string" && data.metaTitle.trim()) {
            document.title = data.metaTitle;
          }
          // Remove old meta/link tags
          document.querySelectorAll("meta[data-dynamic-seo], link[data-dynamic-seo]").forEach((el) => el.remove());

          // Description
          if (typeof data.metaDescription === "string" && data.metaDescription.trim()) {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = data.metaDescription;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }

          // Canonical
          if (typeof data.canonical === "string" && data.canonical.trim()) {
            let link = document.querySelector("link[rel='canonical']");
            if (!link) {
              link = document.createElement("link");
              link.rel = "canonical";
              document.head.appendChild(link);
            }
            // Ensure canonical starts with http/https
            let canonicalUrl = data.canonical.trim();
            if (!/^https?:\/\//i.test(canonicalUrl)) {
              canonicalUrl = "https://" + canonicalUrl.replace(/^\/+/, "");
            }
            link.href = canonicalUrl;
            link.setAttribute("data-dynamic-seo", "true");
          }

          // Robots
          if (typeof data.robots === "string" && data.robots.trim()) {
            const meta = document.createElement("meta");
            meta.name = "robots";
            meta.content = data.robots;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }

          // Author
          if (typeof data.author === "string" && data.author.trim()) {
            const meta = document.createElement("meta");
            meta.name = "author";
            meta.content = data.author;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }

          // Publisher
          if (typeof data.publisher === "string" && data.publisher.trim()) {
            const meta = document.createElement("meta");
            meta.name = "publisher";
            meta.content = data.publisher;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }

          // Focus Keywords (array or string)
          if (data.focusKeywords) {
            let keywords = data.focusKeywords;
            if (typeof keywords === "string") {
              keywords = keywords.split(",").map(k => k.trim()).filter(Boolean);
            }
            if (Array.isArray(keywords) && keywords.length) {
              const meta = document.createElement("meta");
              meta.name = "keywords";
              meta.content = keywords.join(", ");
              meta.setAttribute("data-dynamic-seo", "true");
              document.head.appendChild(meta);
            }
          }
        }
      } catch (err) {
        console.error(err);
        // Optionally handle error
      }
    };
    fetchSEO();
    // Clean up on route change
    return () => {
      document.querySelectorAll("meta[data-dynamic-seo], link[data-dynamic-seo]").forEach((el) => el.remove());
    };
  }, [location.pathname]);

  return null;
}
