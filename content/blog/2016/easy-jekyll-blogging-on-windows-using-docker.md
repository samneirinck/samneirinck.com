---
categories:
  - "Docker"
  - "Jekyll"
date: "2016-08-01"
description: "A look at the Sonos protocol"
title: "Easy Jekyll blogging on Windows using Docker"
type: "post"
aliases:
  - /2016/08/01/easy-jekyll-blogging-on-windows-using-docker/
---

This blog is hosted on [Github Pages](https://pages.github.com/). It allows me to just write content and not worry about server infrastructure or blog engine upgrades. Github Pages uses [Jekyll](https://jekyllrb.com/) behind the scenes, which allows users to just write Markdown posts. 

# Jekyll and Windows
To be able to preview your Jekyll site, you'll want to run it locally. In the docs we find the following:

> While Windows is not officially supported, it is possible to get it running on Windows. Special instructions can be found on our Windows-specific docs page.

The page then goes on on how to install Ruby on Windows before installing Jekyll. Until recently, that's what I did, however it's a bit of a pain. Preferably, I wouldn't want to install Ruby just to preview my blog entries. 

This sounds like a good use case for using container technology. With the recent release of [Docker For Windows](https://docs.docker.com/docker-for-windows/), setting up Docker on Windows is such a breeze. It uses Hyper-V under the covers, sets up port-forwarding so you can use _localhost_ to access services hosted on Docker, and a bunch of other magic to make it all work seamlesslsy. 

If you've used Docker before, but found it a bit of a pain to set up (especially on Windows), I highly encourage you to try it out again.

# Running Jekyll in Docker
> If you don't have a Jekyll site/blog and want to follow along, feel free to clone my blog.
> ```git clone https://github.com/samneirinck/samneirinck.github.io```

Jekyll has an [official image](https://hub.docker.com/r/jekyll/jekyll/) on *Docker Hub*. This makes it even more easy to use. All that's needed is running the following command:

```docker run --rm --volume=/c/path/to/blog:/srv/jekyll -it -p 4000:4000 jekyll/jekyll:pages```

Sure enough, browsing to *[http://localhost:4000](http://localhost:4000/)* lets us visit the Jekyll site locally.

# Creating a docker-compose file
This is great, but the command is a bit long to remember. Why not create a docker-compose file so we can reduce it to just one command. 

In the root folder of the site, create a _docker-compose.yml_ file with the following contents:

```yaml
version: '2'
services:
  web:
    image: jekyll/jekyll:pages
    command: jekyll s --force_polling --drafts
    ports:
     - "4000:4000"
    volumes:
     - .:/srv/jekyll
```

We're using the ```--force_polling``` option to make jekyll regenerate the site whenever there are changes in the markdown files, productivity success.

Once this file is set up, run the following command:
```docker-compose up```

![docker-compose up](/img/2016/08/docker-compose-up.gif)

Browsing to *[http://localhost:4000](http://localhost:4000/)* shows our blog again, and we can now edit our blog drafts, and preview them directly in the browser.

# Conclusion
Using Docker For Windows it's now easier than ever to spin up your Jekyll site on Windows and do your modifications. I can now work on my blog from any machine, with or without internet connection, and have an exact preview on what it will look like if I publish a post.