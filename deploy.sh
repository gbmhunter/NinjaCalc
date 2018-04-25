#!/usr/bin/env bash
# When copying across the dist/ folder, rsync will
# also delete any folders/files in destination that are
# not present in the source
# Also need to chmod so that files are 0644 and folders 0755
# (otherwise people won't be able to access website)
# "/" IS required at end of destination path, otherwise rsync creates duplicate folders
# on remote server (I don't even know how that is possible)
# -a is archive
# -v: Verbose mode
# -z: Compress data when sending
# --delete: rsync will delete files on the receiving side that arn't on the sending size
# --recursive: Copy files/directories recursively
echo "Coping across dist/ folder..."
rsync --chmod=Du=rwx,Dgo=rx,Fu=rw,Fog=r --progress --delete -avz --recursive dist/ -e ssh gbmhunter@160.153.162.18:/home/gbmhunter/public_html/ninja-calc

# This time, do not delete files in destination that are
# not present in source!
echo "Copying across .htaccess file..."
rsync --chmod=Du=rwx,Dgo=rx,Fu=rw,Fog=r --progress -avz server-config/.htaccess -e ssh gbmhunter@160.153.162.18:/home/gbmhunter/public_html/ninja-calc
