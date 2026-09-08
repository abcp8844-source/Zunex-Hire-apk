package com.example.data.local

import com.example.data.model.ActivityLogEntity
import com.example.data.model.CommentEntity
import com.example.data.model.FriendRequestEntity
import com.example.data.model.FriendshipEntity
import com.example.data.model.GroupEntity
import com.example.data.model.GroupMemberEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.PostEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object DatabaseInitializer {

    suspend fun seedDatabaseIfEmpty(db: AppDatabase) = withContext(Dispatchers.IO) {
        val existingUser = db.userDao().getCurrentUserDirect()
        if (existingUser != null) return@withContext

        // 1. Current User & Community Users
        val currentUser = UserEntity(
            id = "user_me",
            name = "Hamza Zunex",
            email = "hamza@zunex.com",
            phone = "+92 300 1234567",
            avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&q=80",
            bio = "✈️ Founder & Builder at Zunex | Building the future of connected communities.",
            work = "Founder & Tech Lead at Zunex",
            education = "Studied Software Engineering",
            livesIn = "Lahore, Pakistan",
            fromCity = "Islamabad, Pakistan",
            relationshipStatus = "Single",
            joinedDate = "January 2024",
            isCurrentUser = true
        )

        val user2 = UserEntity(
            id = "user_ayesha",
            name = "Ayesha Khan",
            email = "ayesha@example.com",
            phone = "+92 321 9876543",
            avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80",
            bio = "Product Designer & Travel Enthusiast 📸✨",
            work = "UI/UX Designer at CreativeHub",
            education = "National College of Arts",
            livesIn = "Karachi, Pakistan",
            fromCity = "Lahore, Pakistan",
            relationshipStatus = "Married",
            joinedDate = "March 2024",
            isCurrentUser = false
        )

        val user3 = UserEntity(
            id = "user_ali",
            name = "Ali Raza",
            email = "ali.raza@example.com",
            avatarUrl = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&q=80",
            bio = "Android & Kotlin Dev | Open Source Contributor 💻🚀",
            work = "Mobile Engineer at DevScale",
            education = "FAST NUCES",
            livesIn = "Islamabad, Pakistan",
            fromCity = "Rawalpindi, Pakistan",
            relationshipStatus = "Single",
            joinedDate = "February 2024",
            isCurrentUser = false
        )

        val user4 = UserEntity(
            id = "user_fatima",
            name = "Fatima Noor",
            email = "fatima@example.com",
            avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=80",
            bio = "Photography | Nature & Mountains Lover 🏔️",
            work = "Digital Marketer",
            education = "LUMS",
            livesIn = "Lahore, Pakistan",
            fromCity = "Gilgit, Pakistan",
            relationshipStatus = "In a relationship",
            joinedDate = "April 2024",
            isCurrentUser = false
        )

        val user5 = UserEntity(
            id = "user_usman",
            name = "Usman Tariq",
            email = "usman@example.com",
            avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&q=80",
            bio = "Tech Enthusiast | Coffee & Code ☕",
            work = "Full Stack Engineer",
            education = "GIKI",
            livesIn = "Islamabad, Pakistan",
            fromCity = "Peshawar, Pakistan",
            relationshipStatus = "Single",
            joinedDate = "May 2024",
            isCurrentUser = false
        )

        db.userDao().insertUsers(listOf(currentUser, user2, user3, user4, user5))

        // 2. Groups
        val group1 = GroupEntity(
            id = "group_tech",
            name = "Pakistan Tech Innovators & Developers",
            description = "Official hub for Kotlin, Android, Web Developers, Freelancers, and Tech Entrepreneurs across Pakistan and worldwide.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80",
            privacy = "public",
            category = "Technology",
            membersCount = 14200,
            postsCount = 380,
            isJoined = true,
            userRole = "admin",
            requirePostApproval = false
        )

        val group2 = GroupEntity(
            id = "group_freelancers",
            name = "Zunex Freelancers & Remote Workers Hub",
            description = "Community for job posts, project collabs, portfolio reviews, and freelance mentorship in Pakistan.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80",
            privacy = "public",
            category = "Business & Career",
            membersCount = 8900,
            postsCount = 210,
            isJoined = true,
            userRole = "member",
            requirePostApproval = true
        )

        val group3 = GroupEntity(
            id = "group_travel",
            name = "Northern Pakistan Travel & Photography Club",
            description = "Share high resolution photos, road conditions, hotel guides and travel itineraries of Hunza, Skardu, Swat, and Kashmir.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80",
            privacy = "public",
            category = "Travel & Outdoors",
            membersCount = 24500,
            postsCount = 850,
            isJoined = false,
            userRole = "none",
            requirePostApproval = false
        )

        val group4 = GroupEntity(
            id = "group_startups",
            name = "Pakistani Startups & Venture Discussions",
            description = "Private group for startup founders, angel investors, pitch deck feedback and VC ecosystem insights.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&q=80",
            privacy = "private",
            category = "Business & Finance",
            membersCount = 5200,
            postsCount = 95,
            isJoined = false,
            userRole = "none",
            requirePostApproval = true
        )

        db.groupDao().insertGroups(listOf(group1, group2, group3, group4))

        // 3. Group Members
        val membersGroup1 = listOf(
            GroupMemberEntity(id = "gm_1", groupId = "group_tech", userId = "user_me", userName = "Hamza Zunex", userAvatar = currentUser.avatarUrl, role = "admin"),
            GroupMemberEntity(id = "gm_2", groupId = "group_tech", userId = "user_ali", userName = "Ali Raza", userAvatar = user3.avatarUrl, role = "moderator"),
            GroupMemberEntity(id = "gm_3", groupId = "group_tech", userId = "user_ayesha", userName = "Ayesha Khan", userAvatar = user2.avatarUrl, role = "member"),
            GroupMemberEntity(id = "gm_4", groupId = "group_tech", userId = "user_fatima", userName = "Fatima Noor", userAvatar = user4.avatarUrl, role = "member", isPending = true)
        )
        db.groupDao().insertGroupMembers(membersGroup1)

        // 4. Feed & Group Posts
        val now = System.currentTimeMillis()
        val post1 = PostEntity(
            id = "post_1",
            authorId = "user_me",
            authorName = "Hamza Zunex",
            authorAvatar = currentUser.avatarUrl,
            content = "Excited to introduce the new Zunex social platform! 🚀 Built with high-speed Room database, pure post feeds, and complete Facebook-grade groups system. Let us know your thoughts in the comments! ✈️✨",
            photoUrl = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80",
            privacy = "public",
            likesCount = 48,
            commentsCount = 12,
            sharesCount = 6,
            createdAt = now - (15 * 60 * 1000),
            isLikedByMe = true,
            myReactionType = "love"
        )

        val post2 = PostEntity(
            id = "post_2",
            authorId = "user_ayesha",
            authorName = "Ayesha Khan",
            authorAvatar = user2.avatarUrl,
            content = "The scenic colors of autumn in Hunza valley are breathtaking! No filters needed for this pristine beauty. 🍂🏔️",
            photoUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80",
            privacy = "public",
            likesCount = 124,
            commentsCount = 28,
            sharesCount = 15,
            createdAt = now - (2 * 3600 * 1000),
            isLikedByMe = true,
            myReactionType = "like"
        )

        val post3 = PostEntity(
            id = "post_3",
            authorId = "user_ali",
            authorName = "Ali Raza",
            authorAvatar = user3.avatarUrl,
            content = "Always focus on clean architecture, local-first database persistence, and snappy user experience. Keep building great things!",
            backgroundColorHex = "#1E88E5",
            privacy = "public",
            likesCount = 89,
            commentsCount = 14,
            sharesCount = 4,
            createdAt = now - (5 * 3600 * 1000),
            isLikedByMe = false
        )

        val post4 = PostEntity(
            id = "post_4",
            authorId = "user_fatima",
            authorName = "Fatima Noor",
            authorAvatar = user4.avatarUrl,
            groupId = "group_tech",
            groupName = "Pakistan Tech Innovators & Developers",
            content = "We just opened 3 remote roles for Mobile and UI Engineers on the Zunex platform! Drop your portfolios below. 🎯💼",
            privacy = "public",
            likesCount = 35,
            commentsCount = 19,
            sharesCount = 8,
            createdAt = now - (8 * 3600 * 1000),
            isLikedByMe = false
        )

        db.postDao().insertPosts(listOf(post1, post2, post3, post4))

        // 5. Comments
        val comment1 = CommentEntity(
            id = "comm_1",
            postId = "post_1",
            authorId = "user_ali",
            authorName = "Ali Raza",
            authorAvatar = user3.avatarUrl,
            content = "MashaAllah looking super clean and fast! The reaction system and group architecture are on point. 🔥",
            likesCount = 7,
            isLikedByMe = true,
            createdAt = now - (10 * 60 * 1000)
        )

        val comment2 = CommentEntity(
            id = "comm_2",
            postId = "post_1",
            authorId = "user_ayesha",
            authorName = "Ayesha Khan",
            authorAvatar = user2.avatarUrl,
            content = "Brilliant design! Love the Zunex plane branding and Facebook-like interface. 👏",
            likesCount = 5,
            isLikedByMe = false,
            createdAt = now - (8 * 60 * 1000)
        )

        val comment3 = CommentEntity(
            id = "comm_3",
            postId = "post_2",
            authorId = "user_me",
            authorName = "Hamza Zunex",
            authorAvatar = currentUser.avatarUrl,
            content = "Incredible capture Ayesha! Truly heavenly. 🌄",
            likesCount = 3,
            isLikedByMe = true,
            createdAt = now - (1 * 3600 * 1000)
        )

        db.postDao().insertComments(listOf(comment1, comment2, comment3))

        // 6. Friendships & Friend Requests
        val friendship1 = FriendshipEntity(
            id = "f_1",
            userId1 = "user_me",
            userId2 = "user_ayesha",
            friendName = "Ayesha Khan",
            friendAvatar = user2.avatarUrl,
            friendBio = user2.bio,
            mutualFriendsCount = 18
        )
        val friendship2 = FriendshipEntity(
            id = "f_2",
            userId1 = "user_me",
            userId2 = "user_ali",
            friendName = "Ali Raza",
            friendAvatar = user3.avatarUrl,
            friendBio = user3.bio,
            mutualFriendsCount = 34
        )
        db.interactionDao().insertFriendships(listOf(friendship1, friendship2))

        val req1 = FriendRequestEntity(
            id = "freq_1",
            senderId = "user_fatima",
            senderName = "Fatima Noor",
            senderAvatar = user4.avatarUrl,
            senderBio = user4.bio,
            mutualFriendsCount = 12,
            receiverId = "user_me",
            status = "pending",
            createdAt = now - (20 * 60 * 1000)
        )
        val req2 = FriendRequestEntity(
            id = "freq_2",
            senderId = "user_usman",
            senderName = "Usman Tariq",
            senderAvatar = user5.avatarUrl,
            senderBio = user5.bio,
            mutualFriendsCount = 7,
            receiverId = "user_me",
            status = "pending",
            createdAt = now - (2 * 3600 * 1000)
        )
        db.interactionDao().insertFriendRequests(listOf(req1, req2))

        // 7. Notifications
        val notif1 = NotificationEntity(
            id = "notif_1",
            type = "friend_request",
            title = "New Friend Request",
            message = "Fatima Noor sent you a friend request.",
            targetId = "freq_1",
            targetType = "user",
            actorName = "Fatima Noor",
            actorAvatar = user4.avatarUrl,
            isRead = false,
            createdAt = now - (20 * 60 * 1000)
        )
        val notif2 = NotificationEntity(
            id = "notif_2",
            type = "like",
            title = "Reaction on your post",
            message = "Ali Raza and 47 others loved your post.",
            targetId = "post_1",
            targetType = "post",
            actorName = "Ali Raza",
            actorAvatar = user3.avatarUrl,
            isRead = false,
            createdAt = now - (35 * 60 * 1000)
        )
        val notif3 = NotificationEntity(
            id = "notif_3",
            type = "comment",
            title = "New Comment",
            message = "Ayesha Khan commented on your post: 'Brilliant design!'",
            targetId = "post_1",
            targetType = "post",
            actorName = "Ayesha Khan",
            actorAvatar = user2.avatarUrl,
            isRead = true,
            createdAt = now - (1 * 3600 * 1000)
        )
        val notif4 = NotificationEntity(
            id = "notif_4",
            type = "group_post",
            title = "Pakistan Tech Innovators",
            message = "Fatima Noor posted in Pakistan Tech Innovators & Developers.",
            targetId = "post_4",
            targetType = "post",
            actorName = "Fatima Noor",
            actorAvatar = user4.avatarUrl,
            isRead = true,
            createdAt = now - (3 * 3600 * 1000)
        )
        db.interactionDao().insertNotifications(listOf(notif1, notif2, notif3, notif4))

        // 8. Activity Log
        val act1 = ActivityLogEntity(
            id = "act_1",
            actionType = "post_created",
            description = "You published a new post: 'Excited to introduce the new Zunex social platform!'",
            timestamp = now - (15 * 60 * 1000),
            targetId = "post_1"
        )
        val act2 = ActivityLogEntity(
            id = "act_2",
            actionType = "post_liked",
            description = "You reacted ❤️ Love to Ayesha Khan's photo post.",
            timestamp = now - (45 * 60 * 1000),
            targetId = "post_2"
        )
        val act3 = ActivityLogEntity(
            id = "act_3",
            actionType = "joined_group",
            description = "You joined the group 'Zunex Freelancers & Remote Workers Hub'.",
            timestamp = now - (2 * 3600 * 1000),
            targetId = "group_freelancers"
        )
        db.interactionDao().insertActivityLogs(listOf(act1, act2, act3))
    }
}
