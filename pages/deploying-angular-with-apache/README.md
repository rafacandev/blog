Deploying Angular with Apache
=============================

[Angular Deployment Guide](https://angular.io/guide/deployment) describes how to deploy angular applications in several web servers including [Apache Http Server](https://httpd.apache.org).

Angular single page applications need to be configured to redirect requests for missing files to `index.html`. The recommended configuration works for the most part except when handling encoded URLs.

Angular encodes [Route Parameters](https://angular.io/guide/router#route-parameters-required-or-optional) while Apache encodes URLs. As a result, the final URL is going to be double encoded.

To fix this problem I adjusted the configuration with a flag to do not encode URLs during `RewriteRule`:

```bash  
RewriteEngine On
# If an existing asset or directory is requested go to it as it is
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]  
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d  
RewriteRule ^ - [L,QSA]
# If the requested resource doesn't exist, use index.html
# Do not encode the url and preserve query parameters
# See: https://httpd.apache.org/docs/2.4/rewrite/flags.html
RewriteRule ^ /index.html [L,NE,QSA]
```