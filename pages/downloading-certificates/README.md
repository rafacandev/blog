Download Certificates From HTTPS Page
=====================================
Steps to download certificates from an existing HTTPS website.
Useful when the website uses self-signed certificates and you want to trust their certificates.


```$bash
# In this example we are downloading the HTTPS cerficates from google.com
openssl s_client -showcerts -connect google.com:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >mycertfile.pem
```

Now you can import the exported certificate `mycertfile.pem` in the application that requires it (e.g: Web Browsers).

Some tools also have their own importing feature. Here is how to import a certificate in Java.

```$bash
# Find the certificate file
# In this example it is located at: ./usr/lib/jvm/java-11-openjdk/lib/security/cacerts
find -name cacerts 2>/dev/null

# Import the certificate using Java's keytool
keytool -import -file mycerfile.pem -keystore ./usr/lib/jvm/java-11-openjdk/lib/security/cacerts
```

