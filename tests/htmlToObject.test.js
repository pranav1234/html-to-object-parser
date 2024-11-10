// tests/htmlToObject.test.js
import htmlToObject from "../src/htmlToObject";

describe("htmlToObject", () => {
  test("should parse a simple div with text", () => {
    const html = `<div>Hello, world!</div>`;
    const expectedOutput = {
      tag: "div",
      text: "Hello, world!",
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });

  test("should parse a div with an id and class", () => {
    const html = `<div id="test-id" class="test-class">Hello</div>`;
    const expectedOutput = {
      tag: "div",
      text: "Hello",
      id: "test-id",
      class: "test-class",
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });

  test("should parse inline styles", () => {
    const html = `<div style="background-color: yellow; font-size: 14px">Styled text</div>`;
    const expectedOutput = {
      tag: "div",
      text: "Styled text",
      style: {
        backgroundColor: "yellow",
        fontSize: "14px",
      },
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });

  test("should parse nested elements", () => {
    const html = `
            <div>
                Parent text
                <p>Child paragraph</p>
            </div>
        `;
    const expectedOutput = {
      tag: "div",
      text: "Parent text",
      children: [
        {
          tag: "p",
          text: "Child paragraph",
        },
      ],
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });
  test("should parse nested elements after", () => {
    const html = `
            <div>
                <p>Child paragraph</p>
                    Parent text
            </div>
        `;
    const expectedOutput = {
      tag: "div",
      text: "Parent text",
      children: [
        {
          tag: "p",
          text: "Child paragraph",
        },
      ],
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });

  test("should parse multiple nested elements and styles", () => {
    const html = `
            <div id="container" style="padding: 10px;">
                <p style="color: red;">Red paragraph</p>
                <footer style="font-size: 12px;">
                    <span>Footer text</span>
                </footer>
            </div>
        `;
    const expectedOutput = {
      tag: "div",
      id: "container",
      style: {
        padding: "10px",
      },
      children: [
        {
          tag: "p",
          text: "Red paragraph",
          style: {
            color: "red",
          },
        },
        {
          tag: "footer",
          style: {
            fontSize: "12px",
          },
          children: [
            {
              tag: "span",
              text: "Footer text",
            },
          ],
        },
      ],
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });

  test("should parse empty tags correctly", () => {
    const html = `<div><img src="image.png" alt="Sample image"/></div>`;
    const expectedOutput = {
      tag: "div",
      children: [
        {
          tag: "img",

          src: "image.png",
          alt: "Sample image",
        },
      ],
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });

  test("should handle self-closing tags like br and hr", () => {
    const html = `<div>Text before line break<br/>Text after line break<hr/></div>`;
    const expectedOutput = {
      tag: "div",
      text: "Text before line breakText after line break",
      children: [{ tag: "br" }, { tag: "hr" }],
    };
    expect(htmlToObject(html)).toEqual(expectedOutput);
  });
});
