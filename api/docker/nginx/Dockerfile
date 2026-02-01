FROM nginx:alpine

# Copie de la configuration Nginx
# Le chemin est relatif au contexte de build (dossier 'api')
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copie uniquement du dossier public (index.php, assets)
# C'est tout ce dont Nginx a besoin pour servir les fichiers statiques ou passer la main à PHP
COPY public /var/www/html/public
