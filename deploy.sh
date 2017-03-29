#!/usr/bin/env bash

# When copying across the dist/ folder, rsync will
# also delete any folders/files in destination that are
# not present in the source
# Also need to chmod so that files are 0644 and folders 0755
# (otherwise people won't be able to access website)
echo "Coping across dist/ folder..."
rsync --chmod=Du=rwx,Dgo=rx,Fu=rw,Fog=r --progress --delete -avz --ignore-existing --recursive dist/ -e ssh gbmhunter@160.153.162.18:/home/gbmhunter/public_html/ninja-calc

# This time, do not delete files in destination that are
# not present in source!
echo "Copying across .htaccess file..."
rsync --chmod=Du=rwx,Dgo=rx,Fu=rw,Fog=r --progress -avz server-config/.htaccess -e ssh gbmhunter@160.153.162.18:/home/gbmhunter/public_html/ninja-calc
