package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.model.ActivityLogEntity
import com.example.data.model.CommentEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.PostEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class PostRepository(private val db: AppDatabase) {

    val feedPosts: Flow<List<PostEntity>> = db.postDao().getFeedPosts()

    fun getUserPosts(authorId: String): Flow<List<PostEntity>> = db.postDao().getUserPosts(authorId)

    fun getGroupPosts(groupId: String): Flow<List<PostEntity>> = db.postDao().getGroupPosts(groupId)

    fun getPostById(postId: String): Flow<PostEntity?> = db.postDao().getPostById(postId)

    fun getCommentsForPost(postId: String): Flow<List<CommentEntity>> = db.postDao().getCommentsForPost(postId)

    fun getUserPhotos(authorId: String): Flow<List<String>> = db.postDao().getUserPhotos(authorId)

    fun searchPosts(query: String): Flow<List<PostEntity>> = db.postDao().searchPosts(query)

    suspend fun createPost(
        currentUser: UserEntity,
        content: String,
        photoUrl: String? = null,
        backgroundColorHex: String? = null,
        privacy: String = "public",
        groupId: String? = null,
        groupName: String? = null
    ): String {
        val postId = "post_${UUID.randomUUID().toString().take(8)}"
        val post = PostEntity(
            id = postId,
            authorId = currentUser.id,
            authorName = currentUser.name,
            authorAvatar = currentUser.avatarUrl,
            groupId = groupId,
            groupName = groupName,
            content = content,
            photoUrl = photoUrl,
            backgroundColorHex = backgroundColorHex,
            privacy = privacy,
            createdAt = System.currentTimeMillis()
        )
        db.postDao().insertPost(post)

        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "post_created",
                description = if (groupId != null) "Posted in group '$groupName'" else "Created a new post",
                targetId = postId
            )
        )
        return postId
    }

    suspend fun updatePost(post: PostEntity) {
        db.postDao().updatePost(post)
    }

    suspend fun deletePost(postId: String) {
        db.postDao().deletePost(postId)
    }

    suspend fun toggleReaction(postId: String, reactionType: String = "like") {
        val post = db.postDao().getPostByIdDirect(postId) ?: return
        val currentlyLiked = post.isLikedByMe
        val sameReaction = post.myReactionType == reactionType

        val updatedPost = if (currentlyLiked && sameReaction) {
            post.copy(
                isLikedByMe = false,
                myReactionType = null,
                likesCount = maxOf(0, post.likesCount - 1)
            )
        } else {
            post.copy(
                isLikedByMe = true,
                myReactionType = reactionType,
                likesCount = if (currentlyLiked) post.likesCount else post.likesCount + 1
            )
        }
        db.postDao().updatePost(updatedPost)

        if (updatedPost.isLikedByMe) {
            db.interactionDao().insertActivityLog(
                ActivityLogEntity(
                    id = UUID.randomUUID().toString(),
                    actionType = "post_liked",
                    description = "Reacted ${reactionType.uppercase()} to a post by ${post.authorName}.",
                    targetId = postId
                )
            )
        }
    }

    suspend fun addComment(
        postId: String,
        currentUser: UserEntity,
        content: String,
        photoUrl: String? = null,
        replyToCommentId: String? = null
    ) {
        val comment = CommentEntity(
            id = "comm_${UUID.randomUUID().toString().take(8)}",
            postId = postId,
            authorId = currentUser.id,
            authorName = currentUser.name,
            authorAvatar = currentUser.avatarUrl,
            content = content,
            photoUrl = photoUrl,
            createdAt = System.currentTimeMillis(),
            replyToCommentId = replyToCommentId
        )
        db.postDao().insertComment(comment)

        // Increment comments count on post
        val post = db.postDao().getPostByIdDirect(postId)
        if (post != null) {
            db.postDao().updatePost(post.copy(commentsCount = post.commentsCount + 1))

            if (post.authorId != currentUser.id) {
                db.interactionDao().insertNotification(
                    NotificationEntity(
                        id = UUID.randomUUID().toString(),
                        type = "comment",
                        title = "New Comment",
                        message = "${currentUser.name} commented: '$content'",
                        targetId = postId,
                        targetType = "post",
                        actorName = currentUser.name,
                        actorAvatar = currentUser.avatarUrl
                    )
                )
            }
        }

        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "commented",
                description = "Commented on ${post?.authorName ?: "a"}'s post.",
                targetId = postId
            )
        )
    }

    suspend fun toggleCommentLike(comment: CommentEntity) {
        val isLiked = !comment.isLikedByMe
        val count = if (isLiked) comment.likesCount + 1 else maxOf(0, comment.likesCount - 1)
        db.postDao().updateComment(comment.copy(isLikedByMe = isLiked, likesCount = count))
    }

    suspend fun sharePost(post: PostEntity, currentUser: UserEntity) {
        db.postDao().updatePost(post.copy(sharesCount = post.sharesCount + 1))
        createPost(
            currentUser = currentUser,
            content = "Shared from ${post.authorName}:\n\n${post.content}",
            photoUrl = post.photoUrl,
            privacy = "public"
        )
    }
}
