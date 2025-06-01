+++
title = "Configuration Options"
date = 2025-06-01
draft = false 

[taxonomies]
categories = ["configuration"]
tags = ["documentation"]

[extra]
toc = true
+++

This page describes the configuration options available for the `radion` theme.

<!-- more -->

## Installation

First download this theme to your `themes` directory:

```bash
cd themes
git clone https://github.com/micahkepe/radion
```

and then enable it in your `config.toml`:

```toml
theme = "radion"
```

This theme requires your index section (`content/_index.md`) to be paginated to
work:

```toml
paginate_by = 5
```

The posts should therefore be in directly under the `content` folder.

The theme requires tags and categories taxonomies to be enabled in your
`config.toml`:

```toml
taxonomies = [
    # You can enable/disable RSS
    {name = "categories", feed = true},
    {name = "tags", feed = true},
]
```

If you want to paginate taxonomies pages, you will need to overwrite the
templates as it only works for non-paginated taxonomies by default.

---

## Options

### Top-menu

Set a field in `extra` with a key of `radion_menu`:

```toml
radion_menu = [
    {url = "$BASE_URL", name = "Home"},
    {url = "$BASE_URL/categories", name = "Categories"},
    {url = "$BASE_URL/tags", name = "Tags"},
    {url = "https://google.com", name = "Google"},
]
```

If you put `$BASE_URL` in a url, it will automatically be replaced by the actual
site URL.

### Title

The site title is shown on the homepage. As it might be different from the
`<title>` element that the `title` field in the config represents, you can set
the `radion_title` instead.

### Author

You can set this on a per page basis or in the config file.

`config.toml`:

```toml
[extra]
author = "John Smith"
```

In a page (wrap this in +++):

```toml
title = "..."
date = 1970-01-01

[extra]
author = "John Smith"
```

### Favicon

To change the default favicon:

1. Create your own favicon folder with the following site:
   [RealFaviconGenerator](https://realfavicongenerator.net/)

   - Set the 'Favicon path' option to `/icons/favicon/`

2. Unzip the created folder
3. Create a `static/icons/` directory if it does not already exist
4. Place the unzipped `favicon/` directory in `static/icons/`.

By default, favicons are enabled, however, if for some reason you would like to
disable favicons, set the following in your `config.toml`:

```toml
[extra]
favicon = false
```

### GitHub

To enable a GitHub reference link in the header, set the following in your
`config.toml`:

```toml
[extra]
github = "https://github.com/your-github-link"
```

### Code Snippets

#### Syntax Highlighting:

```toml
[markdown]
# Whether to do syntax highlighting
# Theme can be customized by setting the `highlight_theme` variable to a theme
# supported by Zola
highlight_code = true
highlight_theme = "one-dark"
```

For a complete list of themes, see: [Zola's syntax highlighting
docs](https://www.getzola.org/documentation/getting-started/configuration/#syntax-highlighting).

#### Enhanced Codeblocks (Clipboard Support and Language Tags)

```toml
[extra]
codeblock = true
```

{{ note(
header="Note: Ligatures"
body="
Ligatures are **disabled by default** as defined in the
[\_theme.scss](./sass/_theme.scss) file.
"
)}}

### LaTex Support

To enable LaTeX support with MathJax, set the following in your `config.toml`:

```toml
[extra]
latex = true
```

### Searchbar

To enable a searchbar at the top of the page navigation, set the following in
your `config.toml`:

```toml
build_search_index = true

[search]
index_format = "elasticlunr_json"

[extra]
enable_search = true
```

### Light and Dark Modes

To set the color theme of the site, set the following in your `config.toml`:

```toml
[extra]
theme = "toggle" # options: {light, dark, auto, toggle}
```

There are four options for the `theme` field:

- `light`: Always light mode
- `dark`: Always dark mode
- `auto`: Automatically switch between light and dark mode based on the user's
  system preferences
- `toggle`: Allow the user to toggle between light and dark mode

### Table of Contents

To enable a table of contents on a page, add the following to the front matter
of the page:

```toml
[extra]
toc = true
```

### Comments

> **Note**: Giscus comments assumes that you are hosting the blog site via
> GitHub Pages and thus have access to GitHub Discussions.

First, follow the instructions at [giscus.app](https://giscus.app/).
This includes installing the Giscus app and enabling discussions on the
GitHup repository that you host the website code. Additionally, fill in the
repository path in the prompt. Then, from the generated script, fill in the
corresponding values in the `config.toml`:

```toml
[extra]
comments = true  # {true, false}; sets global enabling of comments by default
giscus_repo = "FILL ME IN"
giscus_repo_id = "FILL ME IN"
giscus_data_category_id = "FILL ME IN"
```

Comments can be enabled or disabled on a per page basis by editing the page's
front matter. For example, to disable comments on a specific post:

```toml
[extra]
comments = false
```

The `config.toml` value for `comments` takes precedence and priority. For
example, if you globally disable comments in your `config.toml` by setting
`comments = false`, then trying to enabling comments through a page's front
matter will have no effect.

---

## Acknowledgements

Lots of inspiration and code snippets taken from these awesome Zola themes:

- [`after-dark`](https://github.com/getzola/after-dark) by
  [Vincent Prouillet](https://www.vincentprouillet.com/)

- [`apollo`](https://github.com/not-matthias/apollo/tree/main) by
  [not-matthias](https://github.com/not-matthias)

- [`redux`](https://github.com/SeniorMars/redux) by
  [SeniorMars](https://github.com/SeniorMars).
