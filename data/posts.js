import { USERS } from "./users"

export const POSTS = [
    {
        imageUrl: 'https://picsum.photos/seed/dummy/200',
        user: USERS[0].user,
        going: 62,
        caption: 'Test123',
        profile_picture: USERS[0].imageUrl,
        comments: [
            {
                user: 'waechenango',
                comment:
                    "Woah sounds sick!!!"
            },
            {
                user: 'mikeol',
                comment:
                    "sounds dead"
            }
        ]
    },
    {
        imageUrl: 'https://picsum.photos/seed/dfh/200',
        user: USERS[1].user,
        going: 145,
        caption: 'Halloween Party 7PM Venue',
        profile_picture: USERS[1].imageUrl,
        comments: [
            {
                user: 'waechenango',
                comment:
                    "Woah sounds sick!!!"
            },
            {
                user: 'mikeol',
                comment:
                    "sounds dead"
            }
        ]
    },
    {
        imageUrl: 'https://picsum.photos/seed/cvbdf/200',
        user: USERS[2].user,
        going: 7421,
        caption: '👉 This build will be beginner-friendly so you can build it regardless of your skill level',
        profile_picture: USERS[2].imageUrl,
        comments: [
            
        ]
    },
    {
        imageUrl: 'https://picsum.photos/seed/vfd/200',
        user: USERS[3].user,
        going: 999,
        caption: 'Halloween Party 7PM Venue',
        profile_picture: USERS[3].imageUrl,
        comments: [
            {
                user: 'mikeol',
                comment:
                    "sounds dead"
            }
        ]
    }
]