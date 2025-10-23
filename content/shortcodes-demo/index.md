+++
title = "Shortcodes Demos"
date = 2017-09-24

[taxonomies]
categories = ["demo"]
tags = ["gif", "fancy"]

[extra]
cover_image = "ferris.png"
toc = true
+++

**radion** comes with some handy shortcodes to make your life easier and
your posts more exciting.

<!-- more -->

## GIF-Support

Level up your posts with GIFs!

$$
\texttt{\{\{ gif(sources=["path/to/file"], width=[1-100], caption=[""]) \}\}}
$$

{{ gif(sources=["assets/video.mp4"], width=50)}}

## Fancy Notes

$$
\texttt{\{\{ note(body="...", header=["" | "Note"], center=[true/false | false]) \}\}}
$$

{{ note(
body="
Some really insightful note here.

$$ \sum\_{i=1}^{n} i = \frac{n(n+1)}{2} $$
")}}

## YouTube Video Embedding

Usage:

<pre>
{{ youtube(
    id="youtube-id",
    width=[1-100],
    playlist=["playlist id"],
    autoplay=[{true, false}],
    start_time_s=[seconds]
    captions=[{true, false}],
  )
}}
</pre>

**Example**: Standalone video

{{ youtube(id="ym3y13nA3ew", width=80) }}

$$
\texttt{\{\{ youtube(id="ym3y13nA3ew", width=80) \}\}}
$$

<br>

**Example**: Video from a playlist with captions

{{ youtube(id="LnzuMJLZRdU", width=80, playlist="PLowKtXNTBypFbtuVMUVXNR0z1mu7dp7eH", captions=true) }}

$$
\texttt{\{\{ youtube( id="LnzuMJLZRdU", width=80, playlist="PLowKtXNTBypFbtuVMUVXNR0z1mu7dp7eH") \}\}}
$$

## Audio File Embedding

$$
\texttt{\{\{ audio(source="path/to/file") \}\}}
$$

{{ audio(source="assets/audio.mp3")}}

> If you're still falling for this, I don't know what to tell you.

## Responsive Images

$$
\texttt{ \{\{ responsive(src="path/to/image", caption="Optional caption")\}\} }
$$

{{ responsive(src="assets/ferris.png", alt="Picture of Rust mascot Ferris", caption="Everyone say 'Hi Ferris' in the comments")}}
