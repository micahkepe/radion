+++
title = "Markdown Formatting Test"
date = 2024-12-13

[extra]
toc = true
+++

This page demonstrates various Markdown formatting features that can be used in
the theme. The following sections showcase different elements, such as blockquotes,
headings, lists, and more.

<!-- more -->

## Markdown Text Formatting Options

**Some bold text**. _Italic text_. **_Bold and italic text_**.
~~Strikethrough text~~. `Inline code`.

## Collapsible Sections

**Open sections by default**:

<details open> 
<summary>Click to close</summary>

This is an open section.

</details>

**Closed sections by default**:

<details>
<summary>Click to open</summary>

Peak-a-boo

</details>

<br>

## Blockquotes

> This is a blockquote example. You can add multiple levels of blockquotes
> to create a nested structure.
>
> > For example, this is a second level blockquote.

## Headings

### H3 Header Example

This is an example of an H3 header.

#### H4 Header Example

This is an example of an H4 header.

## Tables

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Row 1    | Row 1    | Row 1    |
| Row 2    | Row 2    | Row 2    |
| Row 3    | Row 3    | Row 3    |

with alignment:

| Left-Aligned | Centered  |    Right-Algned |
| :----------- | :-------: | --------------: |
| foo          | fibonacci | some more stuff |
| bar          |    42     | (idk what else) |

## Footnotes

Footnote example[^1]

Some other footnote that is inline[^2]. As you can see, it just blends right in!

## Lists

### Unordered List

- Item 1
- Item 2
- Item 3

### Ordered List

1. Item 1
   1. Indented item
   2. Yet another indented item
2. Item 2
3. Item 3

## Code Blocks

```rust
fn main() {
    println!("Hello, world!");
}
```

```
Some text block
```

## Inline Code

This is an example of `inline code`. You can use backticks to highlight code
snippets within a paragraph.

## Links

This is an [example link](https://example.com). You can add links to text by
wrapping the text in square brackets and the URL in parentheses.

---

[^1]: Some footnote

[^2]: [https://en.wikipedia.org/wiki/Isometric_projection](https://en.wikipedia.org/wiki/Isometric_projection)
