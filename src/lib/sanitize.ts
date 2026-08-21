import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "h2",
  "h3",
  "h4",
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "a",
  "blockquote",
  "ul",
  "ol",
  "li",
  "img",
  "figure",
  "figcaption",
  "hr",
  "span",
];

export function sanitizeRichText(dirty: string) {
  return sanitizeHtml(dirty || "", {
    allowedTags,
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      figure: ["class"],
      figcaption: ["class"],
      span: ["class"],
      blockquote: ["class"],
      p: ["class"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
      img: sanitizeHtml.simpleTransform("img", {
        loading: "lazy",
      }),
    },
  });
}
