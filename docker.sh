cd ./client && yarn build && cd ..
cd ./api
mv ../client/dist .
docker build -t vm-sight .
