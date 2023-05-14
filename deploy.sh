#!/bin/sh
project_name=web_service
local_dir=./
server_dir=/root/datn/$project_name
user=root
server=14.225.211.60
service_port=5000

# Build service
echo "Building service..."
npm run build

# copy build file to server
echo "Sync dist directory to server..."
rsync -auvr --delete $local_dir/dist $user@$server:$server_dir/
rsync -auvr --delete package.json $user@$server:$server_dir/

# install node_modules
echo "Installing node_modules..."
ssh $user@$server "cd $server_dir && yarn install"

# Get the process ID of the process that is using the port.
process_id=$(ssh $user@$server "lsof -i -n -P | grep $service_port" | awk '{print $2}')

# Kill the process.
ssh $user@$server "kill -9 $process_id"
echo "The process $process_id on port $service_port has been killed."

# start service
ssh $user@$server "cd $server_dir && node dist/main.js & disown" 