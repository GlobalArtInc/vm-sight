cd ./api && rm -r -f dist && yarn && cd ..
cd ./client && yarn && yarn build && cd ..
mv ./client/dist ./api
cd ./api
docker login -u globalartltd -p nn19991999NN
docker build -t vm-sight .
docker tag vm-sight globalartltd/vm-sight:latest
docker push globalartltd/vm-sight