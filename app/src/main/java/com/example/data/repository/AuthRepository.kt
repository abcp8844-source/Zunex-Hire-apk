package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.model.ActivityLogEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class AuthRepository(private val db: AppDatabase) {

    val currentUser: Flow<UserEntity?> = db.userDao().getCurrentUser()

    suspend fun loginWithEmail(email: String, name: String = "Hamza Zunex"): Boolean {
        db.userDao().clearCurrentUserFlag()
        var user = db.userDao().getCurrentUserDirect()
        if (user == null) {
            val newUser = UserEntity(
                id = "user_${UUID.randomUUID().toString().take(8)}",
                name = name.ifBlank { "Zunex User" },
                email = email,
                avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
                coverPhotoUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&q=80",
                bio = "Welcome to my Zunex profile!",
                isCurrentUser = true
            )
            db.userDao().insertUser(newUser)
        } else {
            db.userDao().updateUser(user.copy(isCurrentUser = true))
        }
        return true
    }

    suspend fun loginWithGoogle(email: String, displayName: String, photoUrl: String): Boolean {
        db.userDao().clearCurrentUserFlag()
        val user = UserEntity(
            id = "google_${UUID.randomUUID().toString().take(8)}",
            name = displayName.ifBlank { "Google User" },
            email = email,
            avatarUrl = photoUrl.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
            coverPhotoUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&q=80",
            bio = "Connected via Google ✈️",
            isCurrentUser = true
        )
        db.userDao().insertUser(user)
        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "account_login",
                description = "Logged in using Google account ($email)."
            )
        )
        return true
    }

    suspend fun register(name: String, email: String, phone: String, gender: String, dob: String): Boolean {
        db.userDao().clearCurrentUserFlag()
        val user = UserEntity(
            id = "user_${UUID.randomUUID().toString().take(8)}",
            name = name,
            email = email,
            phone = phone,
            avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
            coverPhotoUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&q=80",
            bio = "Hi there! I am using Zunex.",
            relationshipStatus = "Single",
            isCurrentUser = true
        )
        db.userDao().insertUser(user)
        db.interactionDao().insertActivityLog(
            ActivityLogEntity(
                id = UUID.randomUUID().toString(),
                actionType = "account_created",
                description = "Created your new Zunex account."
            )
        )
        return true
    }

    suspend fun logout() {
        db.userDao().clearCurrentUserFlag()
    }
}
