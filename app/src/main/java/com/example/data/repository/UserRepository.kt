package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.model.ActivityLogEntity
import com.example.data.model.BlockedUserEntity
import com.example.data.model.FriendRequestEntity
import com.example.data.model.FriendshipEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class UserRepository(private val db: AppDatabase) {

    val currentUser: Flow<UserEntity?> = db.userDao().getCurrentUser()

    fun getUserById(userId: String): Flow<UserEntity?> = db.userDao().getUserById(userId)

    fun getSuggestedFriends(): Flow<List<UserEntity>> = db.userDao().getSuggestedFriends()

    fun getFriendsForUser(userId: String): Flow<List<FriendshipEntity>> =
        db.interactionDao().getFriendsForUser(userId)

    fun getPendingFriendRequests(userId: String): Flow<List<FriendRequestEntity>> =
        db.interactionDao().getPendingFriendRequests(userId)

    fun getBlockedUsers(userId: String): Flow<List<BlockedUserEntity>> =
        db.interactionDao().getBlockedUsers(userId)

    fun searchUsers(query: String): Flow<List<UserEntity>> =
        db.userDao().searchUsers(query)

    suspend fun updateProfile(user: UserEntity) {
        db.userDao().updateUser(user)
        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "profile_updated",
                description = "Updated your profile information and bio."
            )
        )
    }

    suspend fun sendFriendRequest(sender: UserEntity, receiver: UserEntity) {
        val req = FriendRequestEntity(
            id = "freq_${UUID.randomUUID().toString().take(8)}",
            senderId = sender.id,
            senderName = sender.name,
            senderAvatar = sender.avatarUrl,
            senderBio = sender.bio,
            receiverId = receiver.id,
            status = "pending"
        )
        db.interactionDao().insertFriendRequest(req)
        db.interactionDao().insertNotification(
            NotificationEntity(
                id = UUID.randomUUID().toString(),
                type = "friend_request",
                title = "Friend Request Sent",
                message = "You sent a friend request to ${receiver.name}.",
                targetId = req.id,
                targetType = "user",
                actorName = receiver.name,
                actorAvatar = receiver.avatarUrl
            )
        )
    }

    suspend fun acceptFriendRequest(request: FriendRequestEntity, currentUser: UserEntity) {
        db.interactionDao().deleteFriendRequest(request.id)
        val friendship = FriendshipEntity(
            id = UUID.randomUUID().toString(),
            userId1 = currentUser.id,
            userId2 = request.senderId,
            friendName = request.senderName,
            friendAvatar = request.senderAvatar,
            friendBio = request.senderBio,
            mutualFriendsCount = request.mutualFriendsCount
        )
        db.interactionDao().insertFriendship(friendship)
        db.interactionDao().insertNotification(
            NotificationEntity(
                id = UUID.randomUUID().toString(),
                type = "friend_accepted",
                title = "Friend Request Accepted",
                message = "You and ${request.senderName} are now friends on Zunex.",
                actorName = request.senderName,
                actorAvatar = request.senderAvatar
            )
        )
        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "added_friend",
                description = "Accepted friend request from ${request.senderName}."
            )
        )
    }

    suspend fun rejectFriendRequest(requestId: String) {
        db.interactionDao().deleteFriendRequest(requestId)
    }

    suspend fun removeFriend(userId1: String, userId2: String) {
        db.interactionDao().removeFriendship(userId1, userId2)
    }

    suspend fun blockUser(currentUserId: String, targetUser: UserEntity) {
        db.interactionDao().insertBlockedUser(
            BlockedUserEntity(
                id = UUID.randomUUID().toString(),
                userId = currentUserId,
                blockedUserId = targetUser.id,
                blockedUserName = targetUser.name,
                blockedUserAvatar = targetUser.avatarUrl
            )
        )
        db.interactionDao().removeFriendship(currentUserId, targetUser.id)
    }

    suspend fun unblockUser(currentUserId: String, blockedUserId: String) {
        db.interactionDao().unblockUser(currentUserId, blockedUserId)
    }
}
