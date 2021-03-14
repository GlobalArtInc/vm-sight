cd ./client && yarn build && cd ..
cd ./api
rm -r -f dist
mv ../client/dist .
docker build -t globalartltd/vm-sight .
