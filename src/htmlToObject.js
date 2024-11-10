export default function htmlToObject(html) {
  //function to parse attributes from a tag
  function parseAttributes(tag) {
    const attributes = {};
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let match;

    while ((match = attrRegex.exec(tag))) {
      const key = match[1];
      const value = match[2];
      // Convert inline style into an object
      if (key === "style") {
        const styleObj = {};
        value.split(";").forEach((style) => {
          if (style.trim()) {
            const [styleKey, styleValue] = style
              .split(":")
              .map((s) => s.trim());
            const camelCaseKey = styleKey.replace(/-([a-z])/g, (g) =>
              g[1].toUpperCase()
            );
            styleObj[camelCaseKey] = styleValue;
          }
        });
        attributes[key] = styleObj;
      } else {
        attributes[key] = value;
      }
    }
    return attributes;
  }

  // Main function to parse HTML recursively
  function parseHTML(html) {
    const elementRegex =
      /<(\w+)([^>]*)\s*(\/?)>(.*?)<\/\1>|<(\w+)([^>]*)\s*\/>/gs;
    let match;
    const elements = [];

    while ((match = elementRegex.exec(html))) {
      if (match[5]) {
        // Self-closing tag case
        const tag = match[5];
        const attrString = match[6];
        const attributes = parseAttributes(attrString);
        const element = { tag, ...attributes };
        elements.push(element);
      } else {
        // Regular tag case
        const tag = match[1];

        const attrString = match[2];
        const content = match[4].trim();
        const attributes = parseAttributes(attrString);
        const element = { tag, ...attributes };

        let remainingContent = content;

        // Extract and parse child elements handling the scenario where there are text and tags
        const childMatchRegex =
          /<(\w+)([^>]*)>([\s\S]*?)<\/\1>|<(\w+)([^>]*)\s*\/>/g;
        let childMatch;
        let childElements = [];

        while ((childMatch = childMatchRegex.exec(content))) {
          childElements.push(parseHTML(childMatch[0]));
          remainingContent = remainingContent.replace(childMatch[0], ""); // Remove the parsed child element
        }

        // Trim and assign the remaining text content
        const textContent = remainingContent.trim();
        if (textContent) {
          element.text = textContent;
        }

        // Recursively parse child elements
        const children = parseHTML(content);

        if (children.length > 0) {
          element.children = children;
        }
        elements.push(element);
      }
    }

    return elements;
  }

  // Remove extra whitespace and newline characters
  html = html.replace(/\n/g, "").trim();

  // Start parsing
  const result = parseHTML(html);
  return result.length === 1 ? result[0] : result;
}
console.log(
  JSON.stringify(
    htmlToObject(`<div>
                  <p>Child paragraph</p>
                      Parent text
              </div>`),
    null,
    4
  )
);
//   module.exports = htmlToObject;
