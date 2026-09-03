+++
title = "Components Demos"
date = 2017-09-24

[taxonomies]
categories = ["demo"]
tags = ["gif", "fancy"]

[extra]
cover_image = "ferris.png"
toc = true
+++

**radion** comes with some handy components to make your life easier and
your posts more exciting.

<!-- more -->

## GIF-Support

Level up your posts with GIFs!

{% raw %}

```
{{<gif sources={["path/to/file"]} width={50} caption="caption"/>}}
```

{% endraw %}

{{<gif sources={["assets/video.mp4"]} width={50}/>}}

## Fancy Notes

{% raw %}

```
{% <note header="Header"> %}
Your note content here (supports markdown).
{% </note> %}
```

{% endraw %}

{% <note> %}
Some really insightful note here.

$$ \sum\_{i=1}^{n} i = \frac{n(n+1)}{2} $$
{% </note> %}

## YouTube Video Embedding

{% raw %}

```
{{<youtube id="video-id" width={80} playlist="playlist-id" autoplay={true} start_time_s={30} captions={true}/>}}
```

{% endraw %}

**Example**: Standalone video

{{<youtube id="ym3y13nA3ew" width={80}/>}}

<br>

**Example**: Video from a playlist with captions

{{<youtube id="LnzuMJLZRdU" width={80} playlist="PLowKtXNTBypFbtuVMUVXNR0z1mu7dp7eH" captions={true}/>}}

## Audio File Embedding

{% raw %}

```
{{<audio source="path/to/file"/>}}
```

{% endraw %}

{{<audio source="assets/audio.mp3"/>}}

> If you're still falling for this, I don't know what to tell you.

## Responsive Images

{% raw %}

```
{{<responsive src="path/to/image" alt="description" caption="Optional caption"/>}}
```

{% endraw %}

{{<responsive src="assets/ferris.png" alt="Picture of Rust mascot Ferris" caption="Everyone say 'Hi Ferris' in the comments"/>}}
