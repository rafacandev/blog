Generate Self Signed Certificates (PKCS 12 Format) in Java
==========================================================
Generate Self Signed certificates in PKCS 12 format in Java might not be trivial.
Here are the steps. Recommended read: [How to enable communication over https between 2 spring boot applications using self signed certificate](http://www.littlebigextra.com/how-to-enable-communication-over-https-between-2-spring-boot-applications-using-self-signed-certificate)

```bash
Generating a self-signed certificate
# Generate Public and Private keys
openssl req -x509 -newkey rsa:4096 -keyout my-keyout.pem -out my-selfsigned.pem -days 365 -subj "/C=CA/ST=Ontario/L=Toronto/O=RBC/OU=RBC/CN=localhost"
#> Enter PEM pass phrase: myPass

# Check if the generated PEM file is correct
openssl x509 -in my-selfsigned.pem -text -noout

# Combine your key and certificate in a PKCS#12 (P12) bundle
openssl pkcs12 -export -keypbe PBE-SHA1-3DES -certpbe PBE-SHA1-3DES -export -in my-selfsigned.pem -inkey my-keyout.pem -name selfsigned -out my-keystore.p12
#> Enter pass phrase for my-keyout.pem: myPass
#> Enter Export Password: myPass
#> Verifying - Enter Export Password: myPass
# Create a JKS from self-signed PEM

keytool -importkeystore -srcstoretype PKCS12 -srckeystore my-keystore.p12 -destkeystore my-keystore.jks -deststoretype pkcs12
#> Enter destination keystore password: myPass  
#> Re-enter new password: myPass 
#> Enter source keystore password: myPass 
#> Entry for alias selfsigned successfully imported.
#> Import command completed:  1 entries successfully imported, 0 entries failed or cancelled

# To generate certificate from keystore(.jks file) 
keytool -export -keystore my-keystore.jks -alias selfsigned -file my-selfsigned.crt
#> Enter keystore password: myPass  
#> Certificate stored in file <my-selfsigned.crt>

# Import the certificate to cacerts
keytool -importcert -file my-selfsigned.crt -alias selfsigned -keystore /Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home/jre/lib/security/cacerts
#### JDK default password for cacerts keystore is 'changeit'
#> Enter keystore password: changeit
```