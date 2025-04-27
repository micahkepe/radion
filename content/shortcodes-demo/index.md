+++
title = "Shortcodes Demos"
date = 2017-09-24

[taxonomies]
categories = ["demo"]
tags = ["gif", "fancy"]
+++

**radion** comes with some handy shortcodes to make your life easier and
your posts more exciting.

<!-- more -->

Here are some examples:

## GIF-Suport

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

$$
\texttt{\{\{ youtube(id="youtube-id", width=[1-100]) \}\}}
$$

{{ youtube(id="ym3y13nA3ew", width=80) }}

## Audio File Embedding

$$
\texttt{\{\{ audio(source="path/to/file") \}\}}
$$

{{ audio(source="assets/audio.mp3")}}

> If you're still falling for this, I don't know what to tell you.
