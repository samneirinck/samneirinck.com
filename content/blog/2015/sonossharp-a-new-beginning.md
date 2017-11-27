---
categories:
  - "Sonos"
date: "2015-06-20"
description: "Creating a Sonos library in C#"
featured: "hero.jpg"
featuredpath: "date"
title: "SonosSharp, a new beginning"
type: "post"
aliases:
  - /2015/06/20/sonossharp-a-new-beginning/
---

Since I bought my first [Sonos](http://www.sonos.com/) equipment piece, the Playbar, I've been intrigued by the system. It's so simple to set up and use, and the apps (on Android, iOS and Windows) are a breeze to work with.

At the time of writing, there is no official Sonos app for Windows Phone ([although one is apparently in the works](http://www.windowscentral.com/sonos-app-windows-phone-private-beta-promised-no-eta-release-though)). This led me to developing a Windows Phone app that does some of the basics such as controlling volume, mainly as a learning opportunity. 

A lot has changed since then, .NET is going cross-platform & open-source, Windows 10 is coming with windowed Metro/Modern/Universal apps. Lately I've also been learning about Reactive Extensions, and have fallen in love with it.

This lead me to reinvent SonosSharp, which was previously just a dump of the library I wrote for my Windows Phone app. I'll be starting with a clean sheet, and will be heavily focusing on ease-of-use of the library. In the following blog posts I'll describe my process as I go along. The big objectives are:

 - Must be super easy to use, yet allow for more complex scenario's such as eventing (more on that in another post)
 - Cross-platform, make it work on Windows, Linux, OSX, mobile platforms
 - Think about performance as a feature, but also keep the memory under control (memory pooling)
 - Create a sample app/console application as a showcase
 - And of course, develop it all in the open, on Github

I strive to not let this be another one of my side-projects, as illustrated brilliantly in this commit strip.
![Side-Project](/img/2015/06/side-project.jpg)

Time to get started!
