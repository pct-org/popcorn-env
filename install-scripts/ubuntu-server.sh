#!/bin/sh
set -e

echo "Installing essential tools..."
sudo apt-get install -y \
  git \
  curl

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"

# Install mongo db version 4.2
sudo apt-get purge mongodb mongodb-server mongodb-server-core mongodb-clients
sudo apt-get purge mongodb-org
sudo apt-get autoremove
sudo apt-get update

wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install mongodb-org
sudo systemctl daemon-reload
sudo systemctl start mongod
sudo systemctl unmask mongodb

# Requires the user to put in his password
sudo systemctl enable mongod

# For logging purposes
sudo systemctl status mongod

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn

echo "Create directory..."
sudo mkdir -p /pct-org

sudo chmod -R 7777 /pct-org

cd /pct-org

# Remove getting started to be sure
rm -rf ./popcorn-env

echo "Cloning repo"
ssh-keyscan github.com >> ~/.ssh/known_hosts
git clone https://github.com/pct-org/popcorn-env.git

cd popcorn-env
nvm install
nvm use

yarn install
yarn setup
