FROM php:8.2-apache

COPY . /var/www/html/

# Apache が Render の PORT を使うようにする
ENV PORT 10000
RUN sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf \
 && sed -i "s/:80>/:${PORT}>/" /etc/apache2/sites-enabled/000-default.conf

EXPOSE 10000

