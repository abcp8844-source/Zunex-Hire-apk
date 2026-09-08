package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.ActivityLogEntity
import com.example.data.model.BlockedUserEntity
import com.example.data.model.CommentEntity
import com.example.data.model.FriendRequestEntity
import com.example.data.model.FriendshipEntity
import com.example.data.model.GroupEntity
import com.example.data.model.GroupMemberEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.PostEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE isCurrentUser = 1 LIMIT 1")
    fun getCurrentUser(): Flow<UserEntity?>

    @Query("SELECT * FROM users WHERE isCurrentUser = 1 LIMIT 1")
    suspend fun getCurrentUserDirect(): UserEntity?

    @Query("SELECT * FROM users WHERE id = :userId LIMIT 1")
    fun getUserById(userId: String): Flow<UserEntity?>

    @Query("SELECT * FROM users WHERE id = :userId LIMIT 1")
    suspend fun getUserByIdDirect(userId: String): UserEntity?

    @Query("SELECT * FROM users WHERE isCurrentUser = 0 AND id NOT IN (SELECT blockedUserId FROM blocked_users)")
    fun getSuggestedFriends(): Flow<List<UserEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUsers(users: List<UserEntity>)

    @Update
    suspend fun updateUser(user: UserEntity)

    @Query("UPDATE users SET isCurrentUser = 0")
    suspend fun clearCurrentUserFlag()

    @Query("SELECT * FROM users WHERE name LIKE '%' || :query || '%' AND id NOT IN (SELECT blockedUserId FROM blocked_users)")
    fun searchUsers(query: String): Flow<List<UserEntity>>
}

@Dao
interface PostDao {
    @Query("SELECT * FROM posts WHERE groupId IS NULL ORDER BY createdAt DESC")
    fun getFeedPosts(): Flow<List<PostEntity>>

    @Query("SELECT * FROM posts WHERE authorId = :authorId ORDER BY createdAt DESC")
    fun getUserPosts(authorId: String): Flow<List<PostEntity>>

    @Query("SELECT * FROM posts WHERE groupId = :groupId ORDER BY createdAt DESC")
    fun getGroupPosts(groupId: String): Flow<List<PostEntity>>

    @Query("SELECT * FROM posts WHERE id = :postId LIMIT 1")
    fun getPostById(postId: String): Flow<PostEntity?>

    @Query("SELECT * FROM posts WHERE id = :postId LIMIT 1")
    suspend fun getPostByIdDirect(postId: String): PostEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPost(post: PostEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPosts(posts: List<PostEntity>)

    @Update
    suspend fun updatePost(post: PostEntity)

    @Query("DELETE FROM posts WHERE id = :postId")
    suspend fun deletePost(postId: String)

    @Query("SELECT * FROM posts WHERE content LIKE '%' || :query || '%' ORDER BY createdAt DESC")
    fun searchPosts(query: String): Flow<List<PostEntity>>

    @Query("SELECT photoUrl FROM posts WHERE authorId = :authorId AND photoUrl IS NOT NULL AND photoUrl != ''")
    fun getUserPhotos(authorId: String): Flow<List<String>>

    @Query("SELECT photoUrl FROM posts WHERE groupId = :groupId AND photoUrl IS NOT NULL AND photoUrl != ''")
    fun getGroupPhotos(groupId: String): Flow<List<String>>

    // Comments
    @Query("SELECT * FROM comments WHERE postId = :postId ORDER BY createdAt ASC")
    fun getCommentsForPost(postId: String): Flow<List<CommentEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertComment(comment: CommentEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertComments(comments: List<CommentEntity>)

    @Update
    suspend fun updateComment(comment: CommentEntity)

    @Query("DELETE FROM comments WHERE id = :commentId")
    suspend fun deleteComment(commentId: String)
}

@Dao
interface GroupDao {
    @Query("SELECT * FROM groups ORDER BY membersCount DESC")
    fun getAllGroups(): Flow<List<GroupEntity>>

    @Query("SELECT * FROM groups WHERE isJoined = 1 ORDER BY name ASC")
    fun getJoinedGroups(): Flow<List<GroupEntity>>

    @Query("SELECT * FROM groups WHERE isJoined = 0 ORDER BY membersCount DESC")
    fun getSuggestedGroups(): Flow<List<GroupEntity>>

    @Query("SELECT * FROM groups WHERE id = :groupId LIMIT 1")
    fun getGroupById(groupId: String): Flow<GroupEntity?>

    @Query("SELECT * FROM groups WHERE id = :groupId LIMIT 1")
    suspend fun getGroupByIdDirect(groupId: String): GroupEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGroup(group: GroupEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGroups(groups: List<GroupEntity>)

    @Update
    suspend fun updateGroup(group: GroupEntity)

    @Query("DELETE FROM groups WHERE id = :groupId")
    suspend fun deleteGroup(groupId: String)

    @Query("SELECT * FROM groups WHERE name LIKE '%' || :query || '%' OR description LIKE '%' || :query || '%'")
    fun searchGroups(query: String): Flow<List<GroupEntity>>

    // Members
    @Query("SELECT * FROM group_members WHERE groupId = :groupId AND isPending = 0 ORDER BY CASE WHEN role='admin' THEN 1 WHEN role='moderator' THEN 2 ELSE 3 END, userName ASC")
    fun getGroupMembers(groupId: String): Flow<List<GroupMemberEntity>>

    @Query("SELECT * FROM group_members WHERE groupId = :groupId AND isPending = 1 ORDER BY joinedAt ASC")
    fun getPendingRequests(groupId: String): Flow<List<GroupMemberEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGroupMember(member: GroupMemberEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGroupMembers(members: List<GroupMemberEntity>)

    @Update
    suspend fun updateGroupMember(member: GroupMemberEntity)

    @Query("DELETE FROM group_members WHERE groupId = :groupId AND userId = :userId")
    suspend fun removeGroupMember(groupId: String, userId: String)
}

@Dao
interface InteractionDao {
    // Friend Requests
    @Query("SELECT * FROM friend_requests WHERE receiverId = :userId AND status = 'pending' ORDER BY createdAt DESC")
    fun getPendingFriendRequests(userId: String): Flow<List<FriendRequestEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFriendRequest(request: FriendRequestEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFriendRequests(requests: List<FriendRequestEntity>)

    @Update
    suspend fun updateFriendRequest(request: FriendRequestEntity)

    @Query("DELETE FROM friend_requests WHERE id = :requestId")
    suspend fun deleteFriendRequest(requestId: String)

    // Friendships
    @Query("SELECT * FROM friendships WHERE userId1 = :userId ORDER BY friendName ASC")
    fun getFriendsForUser(userId: String): Flow<List<FriendshipEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFriendship(friendship: FriendshipEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFriendships(friendships: List<FriendshipEntity>)

    @Query("DELETE FROM friendships WHERE userId1 = :userId1 AND userId2 = :userId2")
    suspend fun removeFriendship(userId1: String, userId2: String)

    // Notifications
    @Query("SELECT * FROM notifications ORDER BY createdAt DESC")
    fun getAllNotifications(): Flow<List<NotificationEntity>>

    @Query("SELECT COUNT(*) FROM notifications WHERE isRead = 0")
    fun getUnreadCount(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: NotificationEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotifications(notifications: List<NotificationEntity>)

    @Query("UPDATE notifications SET isRead = 1 WHERE id = :notificationId")
    suspend fun markAsRead(notificationId: String)

    @Query("UPDATE notifications SET isRead = 1")
    suspend fun markAllAsRead()

    @Query("DELETE FROM notifications WHERE id = :notificationId")
    suspend fun deleteNotification(notificationId: String)

    // Activity Log
    @Query("SELECT * FROM activity_logs ORDER BY timestamp DESC")
    fun getActivityLogs(): Flow<List<ActivityLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivityLog(log: ActivityLogEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivityLogs(logs: List<ActivityLogEntity>)

    @Query("DELETE FROM activity_logs")
    suspend fun clearActivityLogs()

    // Blocked Users
    @Query("SELECT * FROM blocked_users WHERE userId = :userId ORDER BY blockedAt DESC")
    fun getBlockedUsers(userId: String): Flow<List<BlockedUserEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBlockedUser(blocked: BlockedUserEntity)

    @Query("DELETE FROM blocked_users WHERE userId = :userId AND blockedUserId = :blockedUserId")
    suspend fun unblockUser(userId: String, blockedUserId: String)
}
