package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val name: String,
    val email: String,
    val phone: String = "099 606 8061",
    val avatarUrl: String = "",
    val coverPhotoUrl: String = "",
    val bio: String = "Digital Creator & Traveler. Always connecting people across borders.",
    val work: String = "Founder at Zunexhire",
    val education: String = "Computer Science at University",
    val livesIn: String = "Bangkok, Thailand",
    val fromCity: String = "Lahore, Pakistan",
    val relationshipStatus: String = "Single",
    val dob: String = "5 July 1998",
    val gender: String = "Male",
    val languages: String = "English, Urdu, Thai",
    val hobbies: String = "Coding, Football, Travel, Photography",
    val interests: String = "Sports teams and athletes: zunexhire.com",
    val travelPlaces: String = "Thailand, UAE, Malaysia, Pakistan",
    val links: String = "zunexhire.com",
    val socialLinks: String = "Instagram: @zunex_official",
    val joinedDate: String = "September 2024",
    val isCurrentUser: Boolean = false,
    val isVerified: Boolean = true,
    val isProfessionalMode: Boolean = true,
    val isLocked: Boolean = false,
    val currentVibe: String = "Current vibe... 🚀",
    val postsCount: Int = 5
)

@Entity(tableName = "posts")
data class PostEntity(
    @PrimaryKey val id: String,
    val authorId: String,
    val authorName: String,
    val authorAvatar: String,
    val groupId: String? = null,
    val groupName: String? = null,
    val content: String,
    val photoUrl: String? = null,
    val backgroundColorHex: String? = null,
    val privacy: String = "public", // "public", "friends", "only_me"
    val isAnonymous: Boolean = false,
    val topic: String? = null,
    val isPinned: Boolean = false,
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val sharesCount: Int = 0,
    val createdAt: Long = System.currentTimeMillis(),
    val isLikedByMe: Boolean = false,
    val isSaved: Boolean = false,
    val myReactionType: String? = null // "like", "love", "care", "haha", "wow", "sad", "angry"
)

@Entity(tableName = "comments")
data class CommentEntity(
    @PrimaryKey val id: String,
    val postId: String,
    val authorId: String,
    val authorName: String,
    val authorAvatar: String,
    val content: String,
    val photoUrl: String? = null,
    val likesCount: Int = 0,
    val isLikedByMe: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val replyToCommentId: String? = null
)

@Entity(tableName = "groups")
data class GroupEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val coverPhotoUrl: String = "",
    val privacy: String = "public", // "public", "private"
    val category: String = "Jobs & Travel",
    val membersCount: Int = 5120,
    val postsCount: Int = 34,
    val isJoined: Boolean = false,
    val isPinned: Boolean = false,
    val isPaused: Boolean = false,
    val userRole: String = "none", // "admin", "moderator", "member", "none"
    val requirePostApproval: Boolean = false,
    val allowAnonymousPosts: Boolean = true,
    val topics: String = "All topics, jobs and job, travel, Announcements",
    val rules: String = "1. Be kind and courteous\n2. No hate speech or bullying\n3. Respect everyone's privacy\n4. Relevant discussions only",
    val pendingPostsCount: Int = 0,
    val pendingRequestsCount: Int = 3,
    val reportedCount: Int = 0,
    val moderationAlertsCount: Int = 0,
    val badgeRequestsCount: Int = 0,
    val potentialSpamCount: Int = 0,
    val postsGrowth: String = "-75%",
    val commentsGrowth: String = "+0%",
    val reactionsGrowth: String = "+525%",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "group_members")
data class GroupMemberEntity(
    @PrimaryKey val id: String,
    val groupId: String,
    val userId: String,
    val userName: String,
    val userAvatar: String,
    val role: String = "member", // "admin", "moderator", "member"
    val joinedAt: Long = System.currentTimeMillis(),
    val isPending: Boolean = false
)

@Entity(tableName = "stories")
data class StoryEntity(
    @PrimaryKey val id: String,
    val authorId: String,
    val authorName: String,
    val authorAvatar: String,
    val mediaUrl: String,
    val caption: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "friend_requests")
data class FriendRequestEntity(
    @PrimaryKey val id: String,
    val senderId: String,
    val senderName: String,
    val senderAvatar: String,
    val senderBio: String = "",
    val mutualFriendsCount: Int = 0,
    val receiverId: String,
    val status: String = "pending", // "pending", "accepted", "rejected"
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "friendships")
data class FriendshipEntity(
    @PrimaryKey val id: String,
    val userId1: String,
    val userId2: String,
    val friendName: String,
    val friendAvatar: String,
    val friendBio: String = "",
    val mutualFriendsCount: Int = 0,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey val id: String,
    val type: String, // "like", "comment", "friend_request", "friend_accepted", "group_invite", "group_post"
    val title: String,
    val message: String,
    val targetId: String = "",
    val targetType: String = "", // "post", "group", "user"
    val actorName: String = "",
    val actorAvatar: String = "",
    val isRead: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "activity_logs")
data class ActivityLogEntity(
    @PrimaryKey val id: String,
    val actionType: String, // "post_created", "post_liked", "commented", "joined_group", "added_friend"
    val description: String,
    val timestamp: Long = System.currentTimeMillis(),
    val targetId: String = ""
)

@Entity(tableName = "blocked_users")
data class BlockedUserEntity(
    @PrimaryKey val id: String,
    val userId: String,
    val blockedUserId: String,
    val blockedUserName: String,
    val blockedUserAvatar: String,
    val blockedAt: Long = System.currentTimeMillis()
)
