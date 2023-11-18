---
layout: post
title: Blog posts with Chirpy and Jekyll
date: 2023-11-18 23:54 +1000
author: henzo
categories: [Blogging, Jekyll]
tags: [Jekyll, Markdown, Ruby, Chirpy]
---

This Documentation relates to running a jekyll site behind github pages
# Jekyll build and testing Commands
## Build verbose
```shell
bundle exec jekyll build --verbose
```
Can be useful to find missing site pages and assets

## Site Test
```shell
bundle exec htmlproofer _site \
    \-\-disable-external=true \
    \-\-ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"
```
Used to find broken links. Cannot publish to github pages without passing this test, but it can be disabled in the workflow.

## Local Serving
```shell
bundle exec jekyll serve --livereload
```
Run server on localhost. LiveReload is supposed to automatic rebuild when file changes but can be weird.

# Chirpy Post things to keep in mind
## Categories
Each post can have up to two categories
## Tags
Each post can have any number of tags
## Authors
Must be specified in  **/_data/authors.yml**. Must also have a valid web link or site test will fail.
## Dates
Does not have to match file date. Dates in the future will not show up.
## Paths
Stuff in **/assets** will show up as is. Posts will be at **/posts/name/** where the name is the file name excluding the date. 
E.g. **_posts/2019-08-08-write-a-new-post.md** -> **/posts/write-a-new-post**

Further info on posts can be found on the [Chirpy Docs - Write a new post](https://chirpy.cotes.page/posts/write-a-new-post/)
Info on syntax can be found on [Chirpy Docs - Text and Typography](https://chirpy.cotes.page/posts/text-and-typography/)

