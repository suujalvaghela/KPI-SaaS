npm init
npx tsc --init
npx prisma init
npx prisma migrate dev 
npx prisma db push

docker run -d -p 6379:6379 redis
docker exec -it 27f1905fc87b redis-cli ping