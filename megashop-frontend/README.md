you should add .env.local file in the root directory of your frontend where package.json exist
#or
add below variables in the .env.local file
#or
NEXT_PUBLIC_JWT_SECRET=your secret key
#or
NEXT_PUBLIC_API_URL=http://localhost:5000
#or
NEXT_PUBLIC_RAZORPAY_KEY_ID=your key id
#or
NEXT_PUBLIC_RAZORPAY_KEY_SECRET=your key secret


i hosted my frontend in firebase and backend in railway.com
.It is working fine but you should modify firebase.json + .env.production + next.config.ts  in the frontend


