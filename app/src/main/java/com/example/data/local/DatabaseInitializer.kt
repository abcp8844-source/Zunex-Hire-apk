package com.example.data.local

import com.example.data.model.ActivityLogEntity
import com.example.data.model.CommentEntity
import com.example.data.model.FriendRequestEntity
import com.example.data.model.FriendshipEntity
import com.example.data.model.GroupEntity
import com.example.data.model.GroupMemberEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.PostEntity
import com.example.data.model.StoryEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object DatabaseInitializer {

    suspend fun seedDatabaseIfEmpty(db: AppDatabase) = withContext(Dispatchers.IO) {
        val existingUser = db.userDao().getCurrentUserDirect()
        if (existingUser != null) return@withContext

        // 1. Current User (Abid Hussain - from screenshots)
        val currentUser = UserEntity(
            id = "user_me",
            name = "Abid Hussain",
            email = "abid@zunexhire.com",
            phone = "099 606 8061",
            avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80",
            bio = "Founder at Zunexhire | Helping talent connect globally. Digital Nomad & Traveler.",
            work = "Founder at Zunexhire",
            education = "Computer Science at University",
            livesIn = "Bangkok, Thailand",
            fromCity = "Lahore, Pakistan",
            relationshipStatus = "Single",
            dob = "5 July 1998",
            gender = "Male",
            languages = "English, Urdu, Thai",
            hobbies = "Coding, Football, Travel, Photography",
            interests = "Sports teams and athletes: zunexhire.com",
            travelPlaces = "Thailand, UAE, Malaysia, Pakistan",
            links = "zunexhire.com",
            socialLinks = "Instagram: @zunexhire_official",
            joinedDate = "September 2024",
            isCurrentUser = true,
            isVerified = true,
            isProfessionalMode = true,
            isLocked = false,
            currentVibe = "Building the future of social networks 🚀",
            postsCount = 5
        )

        val user2 = UserEntity(
            id = "user_ayesha",
            name = "Ayesha Khan",
            email = "ayesha@example.com",
            phone = "+92 321 9876543",
            avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80",
            bio = "Product Designer & Travel Enthusiast 📸✨",
            work = "UI/UX Lead at CreativeHub",
            education = "National College of Arts",
            livesIn = "Bangkok, Thailand",
            fromCity = "Lahore, Pakistan",
            relationshipStatus = "Single",
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
            livesIn = "Dubai, UAE",
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
            livesIn = "Chiang Mai, Thailand",
            fromCity = "Gilgit, Pakistan",
            relationshipStatus = "In a relationship",
            joinedDate = "April 2024",
            isCurrentUser = false
        )

        val user5 = UserEntity(
            id = "user_usman",
            name = "Usman Tariq",
            email = "usman@example.com",
            avatarUrl = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&q=80",
            bio = "Tech Enthusiast | Coffee & Code ☕",
            work = "Full Stack Engineer",
            education = "GIKI",
            livesIn = "Bangkok, Thailand",
            fromCity = "Peshawar, Pakistan",
            relationshipStatus = "Single",
            joinedDate = "May 2024",
            isCurrentUser = false
        )

        db.userDao().insertUsers(listOf(currentUser, user2, user3, user4, user5))

        // 2. Stories
        val stories = listOf(
            StoryEntity(
                id = "story_1",
                authorId = "user_me",
                authorName = "Your Story",
                authorAvatar = currentUser.avatarUrl,
                mediaUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
                caption = "Sunset at Pattaya Beach 🌅"
            ),
            StoryEntity(
                id = "story_2",
                authorId = "user_ayesha",
                authorName = "Ayesha Khan",
                authorAvatar = user2.avatarUrl,
                mediaUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
                caption = "Working remotely from Bangkok co-working cafe 💻✨"
            ),
            StoryEntity(
                id = "story_3",
                authorId = "user_ali",
                authorName = "Ali Raza",
                authorAvatar = user3.avatarUrl,
                mediaUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
                caption = "Dubai skyline from the 40th floor 🏙️"
            ),
            StoryEntity(
                id = "story_4",
                authorId = "user_fatima",
                authorName = "Fatima Noor",
                authorAvatar = user4.avatarUrl,
                mediaUrl = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",
                caption = "Trekking in Northern Thailand 🍃"
            )
        )
        db.storyDao().insertStories(stories)

        // 3. Groups (From screenshots)
        val group1 = GroupEntity(
            id = "group_zunexhire",
            name = "Zunexhire.com Jobs and visa travels",
            description = "Welcome to Zunexhire community! Discussion for international jobs, visa guidance, work permits, travel tips, and overseas career opportunities.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80",
            privacy = "public",
            category = "Jobs & Visa Travel",
            membersCount = 5120,
            postsCount = 34,
            isJoined = true,
            isPinned = true,
            userRole = "admin",
            requirePostApproval = false,
            allowAnonymousPosts = true,
            topics = "All topics, jobs and job, travel, Announcements, visa help",
            rules = "1. Respect all members\n2. Genuine job postings only with verifiable contacts\n3. No unauthorized agent spam\n4. Relevant visa & travel discussions only",
            postsGrowth = "-75%",
            commentsGrowth = "+0%",
            reactionsGrowth = "+525%"
        )

        val group2 = GroupEntity(
            id = "group_indians_thailand",
            name = "Indians in Thailand",
            description = "Community group for Indian expats, residents, and visitors in Thailand. Share accommodation, networking, lifestyle, and festivals.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80",
            privacy = "public",
            category = "Expats & Community",
            membersCount = 24800,
            postsCount = 120,
            isJoined = true,
            isPinned = false,
            userRole = "member",
            rules = "1. Be welcoming and helpful\n2. No advertising without admin permission\n3. Keep conversations respectful"
        )

        val group3 = GroupEntity(
            id = "group_indian_restaurants",
            name = "Indian Restaurants Thailand",
            description = "Directory and reviews of Indian restaurants, sweets, street food, and catering services across Bangkok, Phuket, Pattaya, and Chiang Mai.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
            privacy = "public",
            category = "Food & Dining",
            membersCount = 8350,
            postsCount = 45,
            isJoined = true,
            isPinned = false,
            userRole = "member",
            rules = "1. Honest reviews only\n2. Restaurant owners may post special offers once a week"
        )

        val group4 = GroupEntity(
            id = "group_bangkok_expats",
            name = "Bangkok Expats & Nomads Hub",
            description = "A thriving hub for digital nomads, expats, and travelers living or staying in Bangkok.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1000&q=80",
            privacy = "public",
            category = "Travel & Living",
            membersCount = 14200,
            postsCount = 68,
            isJoined = false,
            userRole = "none",
            rules = "1. Share useful local tips\n2. English language for public accessibility"
        )

        val group5 = GroupEntity(
            id = "group_tech_careers",
            name = "Global Remote Tech Careers",
            description = "Daily curated remote software engineering, design, and PM job openings worldwide.",
            coverPhotoUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80",
            privacy = "public",
            category = "Technology",
            membersCount = 19500,
            postsCount = 88,
            isJoined = false,
            userRole = "none",
            rules = "1. Post salary ranges\n2. Direct apply links only"
        )

        db.groupDao().insertGroups(listOf(group1, group2, group3, group4, group5))

        // Group Members
        val groupMembers = listOf(
            GroupMemberEntity(
                id = "gm_1",
                groupId = group1.id,
                userId = currentUser.id,
                userName = currentUser.name,
                userAvatar = currentUser.avatarUrl,
                role = "admin"
            ),
            GroupMemberEntity(
                id = "gm_2",
                groupId = group1.id,
                userId = user2.id,
                userName = user2.name,
                userAvatar = user2.avatarUrl,
                role = "moderator"
            ),
            GroupMemberEntity(
                id = "gm_3",
                groupId = group1.id,
                userId = user3.id,
                userName = user3.name,
                userAvatar = user3.avatarUrl,
                role = "member"
            ),
            GroupMemberEntity(
                id = "gm_4",
                groupId = group1.id,
                userId = user4.id,
                userName = user4.name,
                userAvatar = user4.avatarUrl,
                role = "member"
            )
        )
        db.groupDao().insertGroupMembers(groupMembers)

        // 4. Feed & Group Posts
        val post1 = PostEntity(
            id = "post_1",
            authorId = currentUser.id,
            authorName = currentUser.name,
            authorAvatar = currentUser.avatarUrl,
            groupId = group1.id,
            groupName = group1.name,
            content = "🌟 We are excited to announce new verified remote opportunities on zunexhire.com! Check out our new portal for global career matches and visa consultation guidelines.",
            photoUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80",
            likesCount = 48,
            commentsCount = 12,
            sharesCount = 5,
            isLikedByMe = true,
            myReactionType = "love",
            createdAt = System.currentTimeMillis() - 1000 * 60 * 35
        )

        val post2 = PostEntity(
            id = "post_2",
            authorId = user2.id,
            authorName = user2.name,
            authorAvatar = user2.avatarUrl,
            content = "Excited to share our new design concept for Zunex Social! Clean typography, native high-contrast layout, and lightning fast performance. Feedback welcome! 🎨✨",
            photoUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80",
            likesCount = 34,
            commentsCount = 6,
            sharesCount = 2,
            isLikedByMe = false,
            createdAt = System.currentTimeMillis() - 1000 * 60 * 120
        )

        val post3 = PostEntity(
            id = "post_3",
            authorId = user3.id,
            authorName = user3.name,
            authorAvatar = user3.avatarUrl,
            content = "Any recommendations for high-speed fiber internet and co-working spaces near Sukhumvit Bangkok? Relocating this weekend!",
            backgroundColorHex = "#1877F2",
            likesCount = 19,
            commentsCount = 8,
            sharesCount = 1,
            isLikedByMe = true,
            myReactionType = "like",
            createdAt = System.currentTimeMillis() - 1000 * 60 * 360
        )

        val post4 = PostEntity(
            id = "post_4",
            authorId = user4.id,
            authorName = user4.name,
            authorAvatar = user4.avatarUrl,
            groupId = group1.id,
            groupName = group1.name,
            content = "Does anyone have experience converting a tourist visa to a Non-B visa in Bangkok? Looking for authentic timeline details.",
            topic = "travel",
            likesCount = 27,
            commentsCount = 14,
            sharesCount = 3,
            isLikedByMe = false,
            createdAt = System.currentTimeMillis() - 1000 * 60 * 600
        )

        val post5 = PostEntity(
            id = "post_5",
            authorId = currentUser.id,
            authorName = currentUser.name,
            authorAvatar = currentUser.avatarUrl,
            content = "Sunset over Bangkok skyline after a productive week building Zunex! Grateful for the amazing community. 🌆✈️",
            photoUrl = "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1000&q=80",
            likesCount = 89,
            commentsCount = 21,
            sharesCount = 8,
            isLikedByMe = true,
            myReactionType = "love",
            createdAt = System.currentTimeMillis() - 1000 * 60 * 1440
        )

        db.postDao().insertPosts(listOf(post1, post2, post3, post4, post5))

        // Comments
        val comments = listOf(
            CommentEntity(
                id = "comm_1",
                postId = post1.id,
                authorId = user2.id,
                authorName = user2.name,
                authorAvatar = user2.avatarUrl,
                content = "Great initiative! The visa travel guide is super comprehensive.",
                likesCount = 4,
                createdAt = System.currentTimeMillis() - 1000 * 60 * 25
            ),
            CommentEntity(
                id = "comm_2",
                postId = post1.id,
                authorId = user3.id,
                authorName = user3.name,
                authorAvatar = user3.avatarUrl,
                content = "Checked out zunexhire.com, looks really promising! Keep it up.",
                likesCount = 3,
                createdAt = System.currentTimeMillis() - 1000 * 60 * 15
            ),
            CommentEntity(
                id = "comm_3",
                postId = post3.id,
                authorId = currentUser.id,
                authorName = currentUser.name,
                authorAvatar = currentUser.avatarUrl,
                content = "Check out The Hive Sukhumvit 49 and True Digital Park, excellent facilities and strong community.",
                likesCount = 5,
                createdAt = System.currentTimeMillis() - 1000 * 60 * 300
            )
        )
        db.postDao().insertComments(comments)

        // Friendships
        val friendships = listOf(
            FriendshipEntity(
                id = "fr_1",
                userId1 = currentUser.id,
                userId2 = user2.id,
                friendName = user2.name,
                friendAvatar = user2.avatarUrl,
                friendBio = user2.bio,
                mutualFriendsCount = 14
            ),
            FriendshipEntity(
                id = "fr_2",
                userId1 = currentUser.id,
                userId2 = user3.id,
                friendName = user3.name,
                friendAvatar = user3.avatarUrl,
                friendBio = user3.bio,
                mutualFriendsCount = 8
            )
        )
        db.interactionDao().insertFriendships(friendships)

        // Friend Request
        val friendRequest = FriendRequestEntity(
            id = "freq_1",
            senderId = user5.id,
            senderName = user5.name,
            senderAvatar = user5.avatarUrl,
            senderBio = user5.bio,
            mutualFriendsCount = 5,
            receiverId = currentUser.id,
            status = "pending"
        )
        db.interactionDao().insertFriendRequest(friendRequest)

        // Notifications
        val notifications = listOf(
            NotificationEntity(
                id = "notif_1",
                type = "like",
                title = "New Reaction",
                message = "Ayesha Khan and 12 others reacted with ❤️ to your post.",
                targetId = post1.id,
                targetType = "post",
                actorName = user2.name,
                actorAvatar = user2.avatarUrl,
                isRead = false,
                createdAt = System.currentTimeMillis() - 1000 * 60 * 10
            ),
            NotificationEntity(
                id = "notif_2",
                type = "friend_request",
                title = "Friend Request",
                message = "Usman Tariq sent you a friend request.",
                targetId = user5.id,
                targetType = "user",
                actorName = user5.name,
                actorAvatar = user5.avatarUrl,
                isRead = false,
                createdAt = System.currentTimeMillis() - 1000 * 60 * 45
            ),
            NotificationEntity(
                id = "notif_3",
                type = "comment",
                title = "New Comment",
                message = "Ali Raza replied to your discussion on Bangkok co-working.",
                targetId = post3.id,
                targetType = "post",
                actorName = user3.name,
                actorAvatar = user3.avatarUrl,
                isRead = true,
                createdAt = System.currentTimeMillis() - 1000 * 60 * 180
            )
        )
        db.interactionDao().insertNotifications(notifications)

        // Activity Logs
        val activityLogs = listOf(
            ActivityLogEntity(
                id = "log_1",
                actionType = "post_created",
                description = "Posted update about Zunexhire career opportunities",
                timestamp = System.currentTimeMillis() - 1000 * 60 * 35
            ),
            ActivityLogEntity(
                id = "log_2",
                actionType = "profile_updated",
                description = "Updated current vibe to 'Building the future of social networks 🚀'",
                timestamp = System.currentTimeMillis() - 1000 * 60 * 120
            ),
            ActivityLogEntity(
                id = "log_3",
                actionType = "group_created",
                description = "Configured admin tools for group 'Zunexhire.com Jobs and visa travels'",
                timestamp = System.currentTimeMillis() - 1000 * 60 * 1440
            )
        )
        db.interactionDao().insertActivityLogs(activityLogs)
    }
}
