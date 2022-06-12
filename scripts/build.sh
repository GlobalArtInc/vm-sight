#mv ../packages/sight-backend/dist
cp ./packages/sight-backend/.env ./dist
cp ./packages/sight-backend/.env.development ./dist
cp ./packages/sight-backend/.env.production ./dist
cp -r ./packages/sight-backend/src/migrations ./dist
cp -r ./packages/sight-backend/node_modules ./dist
