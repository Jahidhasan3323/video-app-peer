# setup ssl certificate
### crete a folder in root directory i.e (certificates).
### goto the folder directory using 
`` cd certificates (your folder name)`` 
### generate key file
``openssl genrsa -out key.pem``

### generate csr file
``openssl req -new -key key.pem -out csr.pem ``

### generate cert file
``openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem``