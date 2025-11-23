# Hello World! 🌍

Welcome to this **comprehensive markdown showcase** that demonstrates all the amazing features of Markdown!

## Table of Contents

- [Text Formatting](#text-formatting)
- [Lists](#lists)
- [Links and Images](#links-and-images)
- [Code Examples](#code-examples)
- [Tables](#tables)
- [Blockquotes](#blockquotes)
- [Math and Special Characters](#math-and-special-characters)

---

## Text Formatting

### Basic Styling

- **Bold text** using `**bold**` or `__bold__`
- _Italic text_ using `*italic*` or `_italic_`
- **_Bold and italic_** using `***text***`
- ~~Strikethrough~~ using `~~text~~`
- `Inline code` using backticks
- ==Highlighted text== (if supported)

### Headers Hierarchy

# H1 - Main Title

## H2 - Section Title

### H3 - Subsection

#### H4 - Sub-subsection

##### H5 - Smaller heading

###### H6 - Smallest heading

---

## Lists

### Unordered Lists

- First item
- Second item
    - Nested item
    - Another nested item
        - Deep nested item
- Back to main level

### Ordered Lists

1. First numbered item
2. Second numbered item
    1. Nested numbered item
    2. Another nested item
3. Third item

### Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task

---

## Links and Images

### Links

- [Google](https://google.com) - External link
- [Internal link](#text-formatting) - Link to section
- <https://github.com> - Automatic link
- [Link with title](https://github.com "GitHub Homepage")

### Reference Links

This is a [reference link][ref1] and another [reference link][ref2].

[ref1]: https://example.com "Example Site"
[ref2]: https://markdown.org "Markdown Guide"

### Images

![Hello World Image](assets/oiia.avif)

#### Different Image Sizes (using HTML for control)

<img src="public/assets/oiia.avif" alt="Small Image" width="150" height="100" style="object-fit: cover;">
<img src="assets/oiia.avif" alt="Medium Image" width="300" height="200" style="object-fit: cover;">
<img src="assets/oiia.avif" alt="Large Image" width="500" height="300" style="object-fit: cover;">

#### Images with Titles (hover to see)

![Portfolio Image](assets/oiia.avif "My Amazing Portfolio Image")

#### Reference-style Images

![Main Image][main-image]
![Secondary Image][secondary-image]

[main-image]: assets/oiia.avif "Main Portfolio Image"
[secondary-image]: assets/oiia.avif "Secondary Portfolio Image"

#### HTML Images for Advanced Control

<img src="assets/oiia.avif" alt="HTML controlled image" width="200" height="150" style="border-radius: 10px; object-fit: cover;">

#### Centered Image (using HTML)

<div align="center">
  <img src="assets/oiia.avif" alt="Centered image" width="300" height="200" style="object-fit: cover;">
</div>

---

## Code Examples

### Inline Code

Use `console.log("Hello World!")` to print to console.

### Code Blocks

#### JavaScript

```javascript
// Hello World in JavaScript
function helloWorld() {
    console.log("Hello, World! 🌍");
    return "Welcome to my portfolio!";
}

const message = helloWorld();
document.getElementById("app").innerHTML = message;
```

#### Python

```python
# Hello World in Python
def hello_world():
    """Print a greeting message"""
    print("Hello, World! 🐍")
    return "Welcome to my portfolio!"

if __name__ == "__main__":
    message = hello_world()
    print(f"Message: {message}")
```

#### HTML

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello, World! 🌐</h1>
        <p>Welcome to my amazing portfolio!</p>
    </body>
</html>
```

#### CSS

```css
/* Hello World Styling */
.hello-world {
    font-family: "Arial", sans-serif;
    color: #333;
    text-align: center;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    padding: 2rem;
    border-radius: 10px;
}

.hello-world:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}
```

---

## Tables

### Basic Table

| Language   | Difficulty | Use Case            |
| ---------- | ---------- | ------------------- |
| JavaScript | Easy       | Web Development     |
| Python     | Easy       | Data Science, AI    |
| Rust       | Hard       | Systems Programming |
| Go         | Medium     | Backend Services    |

### Advanced Table with Alignment

| Left Aligned   |   Center Aligned   | Right Aligned |
| :------------- | :----------------: | ------------: |
| Item 1         |       Item 2       |        Item 3 |
| Long text here |       Center       |          $100 |
| Short          | Medium length text |        $1,000 |

---

## Blockquotes

> "Hello World" is traditionally the first program written by students learning a new programming language.
>
> It's a simple program that outputs the text "Hello, World!" to demonstrate the basic syntax of a language.

### Nested Blockquotes

> This is a blockquote
>
> > This is a nested blockquote
> >
> > > And this is deeply nested!

### Blockquote with Attribution

> "The best way to predict the future is to invent it."
>
> — _Alan Kay_

---

## Math and Special Characters

### Special Characters

- Arrows: → ← ↑ ↓ ↔ ⇒ ⇐ ⇔
- Symbols: © ® ™ § ¶ † ‡ • … ‰
- Currency: $ € £ ¥ ¢
- Greek: α β γ δ ε ζ η θ λ μ π ρ σ τ φ χ ψ ω

### Emojis

- Faces: 😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇
- Hearts: ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💖
- Technology: 💻 📱 ⌨️ 🖥️ 🖨️ 💾 💿 📀 🔌 🔋

---

## Advanced Features

### Definition Lists

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

### Footnotes

This text has a footnote[^1].

This is another footnote[^2].

[^1]: This is the first footnote.

[^2]: This is the second footnote with more details.

### Horizontal Rules

---

---

---

### Escape Characters

Use backslash to escape: \*not italic\* and \`not code\`

---

## Conclusion

This document showcases the power and versatility of Markdown! From simple text formatting to complex code blocks, tables, and mathematical expressions, Markdown provides a clean and readable way to write structured documents.

**Key takeaways:**

1. Markdown is easy to learn and write
2. It's highly readable in plain text
3. Converts beautifully to HTML
4. Perfect for documentation and content creation

_Happy coding and welcome to the wonderful world of Markdown!_ ✨

---

**Last updated:** October 17, 2025  
**Version:** 1.0  
**Author:** DK Portfolio

> Remember: This markdown is generated by GPT-5-Codex
