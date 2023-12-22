# ChatterliFy is a fullstack chat app. 

## The features this app provides:

1. Sign in and Sign up, and yes logout feature
2. Creating conversation with other users on realtime, yes also deleting the conversation
3. Realtime chatting, sending text, images
4. Creating group chats with more than 2 members
5. Reacting on messages, removing reactions
6. Displaying the active status
7. Managing accoung, profile, appearances
8. More to come...  


## The tech-stacks used:

1. `Next.js` for frontend & backend
2. `Shadcn-UI` for ui building
3. `MongoDB` for database
4. `Prisma ORM` for type safe and auto generated query builder
5. `Next-auth` for authentication
6. `Pusher` for real time updates
7. `Zod` for validation  



## Getting Started

```bash
# Clone the repository
https://github.com/Prakash-Banjade/chatterlify.git
```

### Install dependencies
```bash
cd chatterlify
npm install
```

### Set up environment variables
```bash
.env.local .env
# Update .env with your configuration
```

### Run the app
```bash
npm run dev
```

## .env file configuration

```bash
APP_NAME=

MONGO_URI=

NEXTAUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_SECRET=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_ID=
PUSHER_SECRET=
```  


## Get started with the technologies

`Next.js`: https://nextjs.org/  
`Shadcn-ui`: https://ui.shadcn.com/  
`MongoDB`: https://mongodb.com/  
`PrismaORM`: https://www.prisma.io/  
`Next-auth`: https://next-auth.js.org/  
`Pusher`: https://pusher.com/  
`Zod`: https://zod.dev/  


## Working of Push Notification

1. First we create `push subscription` via JS, this push subscription returns a URl to a `Push Service`.
2. `Push Service` is provided by the web browser. For eg. using Chrome, developed by Google, push service is also provided by Google. If it's Firefox, push servie is provided by Mozilla which owns FireFox.
3. So, every browser has their own push server and when we make a push push subscription, we get a unique URL that we can use to send a `Push notification` to a specific device which are sent by the `Push servers` that is either Google for Chorme, Mozilla for Firefox and so on.
4. We store the URL of this push subscription on our own server so we can use it later to trigger a push notification.
5. These push notification work even if we don't have our website open. This is because push notifiation is sent to a `Service worker`. 
6. Service worker is a backround process that we can create for our website and it will stay active even if our website is not active.
