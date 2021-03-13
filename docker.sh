cd ./client && yarn build && cd ..
cd ./api && yarn build
mv ../client/dist .
docker build -t vm-sight .