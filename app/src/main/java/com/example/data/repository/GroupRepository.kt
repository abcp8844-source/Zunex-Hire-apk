package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.model.ActivityLogEntity
import com.example.data.model.GroupEntity
import com.example.data.model.GroupMemberEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class GroupRepository(private val db: AppDatabase) {

    val allGroups: Flow<List<GroupEntity>> = db.groupDao().getAllGroups()
    val joinedGroups: Flow<List<GroupEntity>> = db.groupDao().getJoinedGroups()
    val suggestedGroups: Flow<List<GroupEntity>> = db.groupDao().getSuggestedGroups()

    fun getGroupById(groupId: String): Flow<GroupEntity?> = db.groupDao().getGroupById(groupId)

    fun getGroupMembers(groupId: String): Flow<List<GroupMemberEntity>> =
        db.groupDao().getGroupMembers(groupId)

    fun getPendingRequests(groupId: String): Flow<List<GroupMemberEntity>> =
        db.groupDao().getPendingRequests(groupId)

    fun getGroupPhotos(groupId: String): Flow<List<String>> =
        db.postDao().getGroupPhotos(groupId)

    fun searchGroups(query: String): Flow<List<GroupEntity>> =
        db.groupDao().searchGroups(query)

    suspend fun createGroup(
        currentUser: UserEntity,
        name: String,
        description: String,
        category: String,
        privacy: String,
        coverPhotoUrl: String = "",
        requireApproval: Boolean = false,
        rules: String = ""
    ): String {
        val groupId = "group_${UUID.randomUUID().toString().take(8)}"
        val group = GroupEntity(
            id = groupId,
            name = name,
            description = description,
            coverPhotoUrl = coverPhotoUrl.ifBlank { "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" },
            privacy = privacy,
            category = category,
            membersCount = 1,
            postsCount = 0,
            isJoined = true,
            userRole = "admin",
            requirePostApproval = requireApproval,
            rules = rules.ifBlank { "1. Respect all members\n2. No spam\n3. Relevant content only" }
        )
        db.groupDao().insertGroup(group)

        val adminMember = GroupMemberEntity(
            id = UUID.randomUUID().toString(),
            groupId = groupId,
            userId = currentUser.id,
            userName = currentUser.name,
            userAvatar = currentUser.avatarUrl,
            role = "admin"
        )
        db.groupDao().insertGroupMember(adminMember)

        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "group_created",
                description = "Created group '$name'.",
                targetId = groupId
            )
        )
        return groupId
    }

    suspend fun joinGroup(group: GroupEntity, currentUser: UserEntity) {
        val member = GroupMemberEntity(
            id = UUID.randomUUID().toString(),
            groupId = group.id,
            userId = currentUser.id,
            userName = currentUser.name,
            userAvatar = currentUser.avatarUrl,
            role = "member",
            isPending = false
        )
        db.groupDao().insertGroupMember(member)
        db.groupDao().updateGroup(
            group.copy(
                isJoined = true,
                userRole = "member",
                membersCount = group.membersCount + 1
            )
        )

        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "joined_group",
                description = "Joined group '${group.name}'.",
                targetId = group.id
            )
        )
    }

    suspend fun leaveGroup(group: GroupEntity, currentUser: UserEntity) {
        db.groupDao().removeGroupMember(group.id, currentUser.id)
        db.groupDao().updateGroup(
            group.copy(
                isJoined = false,
                userRole = "none",
                membersCount = maxOf(0, group.membersCount - 1)
            )
        )
    }

    suspend fun approvePendingRequest(request: GroupMemberEntity) {
        db.groupDao().updateGroupMember(request.copy(isPending = false))
        val group = db.groupDao().getGroupByIdDirect(request.groupId)
        if (group != null) {
            db.groupDao().updateGroup(group.copy(membersCount = group.membersCount + 1))
            db.interactionDao().insertNotification(
                NotificationEntity(
                    id = UUID.randomUUID().toString(),
                    type = "group_invite",
                    title = "Group Request Approved",
                    message = "Your request to join '${group.name}' has been approved.",
                    targetId = group.id,
                    targetType = "group"
                )
            )
        }
    }

    suspend fun rejectPendingRequest(request: GroupMemberEntity) {
        db.groupDao().removeGroupMember(request.groupId, request.userId)
    }

    suspend fun updateGroupSettings(
        group: GroupEntity,
        name: String,
        description: String,
        privacy: String,
        requireApproval: Boolean,
        rules: String,
        allowAnonymousPosts: Boolean = group.allowAnonymousPosts,
        topics: String = group.topics,
        coverPhotoUrl: String = group.coverPhotoUrl
    ) {
        db.groupDao().updateGroup(
            group.copy(
                name = name,
                description = description,
                privacy = privacy,
                requirePostApproval = requireApproval,
                rules = rules,
                allowAnonymousPosts = allowAnonymousPosts,
                topics = topics,
                coverPhotoUrl = coverPhotoUrl
            )
        )
    }

    suspend fun togglePinGroup(group: GroupEntity) {
        db.groupDao().updateGroup(group.copy(isPinned = !group.isPinned))
    }

    suspend fun togglePinGroup(groupId: String, isPinned: Boolean) {
        val group = db.groupDao().getGroupByIdDirect(groupId) ?: return
        db.groupDao().updateGroup(group.copy(isPinned = isPinned))
    }

    suspend fun togglePauseGroup(group: GroupEntity) {
        db.groupDao().updateGroup(group.copy(isPaused = !group.isPaused))
    }

    suspend fun togglePauseGroup(groupId: String, isPaused: Boolean) {
        val group = db.groupDao().getGroupByIdDirect(groupId) ?: return
        db.groupDao().updateGroup(group.copy(isPaused = isPaused))
    }

    suspend fun updateCoverPhoto(groupId: String, coverPhotoUrl: String) {
        val group = db.groupDao().getGroupByIdDirect(groupId)
        if (group != null) {
            db.groupDao().updateGroup(group.copy(coverPhotoUrl = coverPhotoUrl))
        }
    }
}
