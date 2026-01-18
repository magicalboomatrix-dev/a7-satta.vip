import { useEffect } from "react";
import api from "./api";
import { useLocation } from "react-router-dom";

/**
 * SEO component: Fetches SEO data from backend and injects meta tags dynamically.
 * Usage: Place <SEO /> at the top of each page component.
 */
export default function SEO() {
  const location = useLocation();
  // Always use current hostname for site
  const site = window.location.hostname;

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        // Use the full pathname for page (so /chart-2026/agra-satta-king-result matches backend)
        const page = location.pathname;
        const { data } = await api.get(
          `/seo/get?page=${encodeURIComponent(page)}&site=${encodeURIComponent(site)}`
        );
        if (data) {
          if (data.metaTitle) document.title = data.metaTitle;
          // Remove old meta tags
          document.querySelectorAll("meta[data-dynamic-seo]").forEach((el) => el.remove());
          // Add meta description
          if (data.metaDescription) {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = data.metaDescription;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }
          // Add canonical
          if (data.canonical) {
            let link = document.querySelector("link[rel='canonical']");
            if (!link) {
              link = document.createElement("link");
              link.rel = "canonical";
              document.head.appendChild(link);
            }
            link.href = data.canonical;
            link.setAttribute("data-dynamic-seo", "true");
          }
          // Add robots
          if (data.robots) {
            const meta = document.createElement("meta");
            meta.name = "robots";
            meta.content = data.robots;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }
          // Add author
          if (data.author) {
            const meta = document.createElement("meta");
            meta.name = "author";
            meta.content = data.author;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }
          // Add publisher
          if (data.publisher) {
            const meta = document.createElement("meta");
            meta.name = "publisher";
            meta.content = data.publisher;
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }
          // Add focus keywords
          if (data.focusKeywords && data.focusKeywords.length) {
            const meta = document.createElement("meta");
            meta.name = "keywords";
            meta.content = data.focusKeywords.join(", ");
            meta.setAttribute("data-dynamic-seo", "true");
            document.head.appendChild(meta);
          }
        }
      } catch (err) {
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
