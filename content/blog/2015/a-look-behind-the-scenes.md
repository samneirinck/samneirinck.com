---
categories:
  - "Sonos"
date: "2015-07-25"
description: "A look at the Sonos protocol"
title: "A look behind the scenes"
type: "post"
aliases:
  - /2015/07/25/a-look-at-sonos-protocol/
---

While Sonos has no official API, it uses open technologies for the apps to communicate with the devices, namely Universal Plug and Play, UPnP. It's highly likely that you have a device at home supporting UPnP. Things like routers, TV's and set-top boxes all have UPnP services.

A device supporting UPnP is discoverable and can announce which services it support, along with which functions clients can call and what arguments the device expects. There's a great utility on Windows to see all this information: Device Spy. It's included in the [Developer tools for UPnP](http://opentools.homeip.net/dev-tools-for-upnp).

On my network, it finds the following devices:
![Device Spy](/img/2015/07/upnp-discover1.png)

You can see the 3 Sonos devices, a router, a TV, a Raspberry Pi, and my set-top box. If I expand the Play 3, we can see it exposes quite a few services.

![Services](/img/2015/07/upnp-discover2.png)

With Device Spy we can invoke a function, and the Sonos controller application immediately responds to this.

![Animation](/img/2015/07/device-spy-sonos.gif)

Behind the scenes, the invocation of this method is done via SOAP. Getting the volume of a speaker is done like this:
<script src="https://gist.github.com/samneirinck/904b55b2b75c8f0370cf.js"></script>
The speaker returns with a straight-forward reply:
<script src="https://gist.github.com/samneirinck/8b895b7c8e9061818fef.js"></script>

Although this will get you along the road, we still have a missing piece. The apps from Sonos react immediately to any change (volume, next track, mute, etc...). This is done by using UPnP Eventing. In essence, each controller hosts a simple http server, and then notifies the speaker that it wants to subscribe to events. Whenever an event happens, the speaker will notify all of its subscribers of the new value.

We'll want this functionality in SonosSharp as well, and abstract the HTTP server away, since it has to be cross-platform.

In the next blog post we'll dive into the code, or at least discuss on how we should structure it.