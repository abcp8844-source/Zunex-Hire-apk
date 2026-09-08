package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.model.ActivityLogEntity
import com.example.data.model.NotificationEntity
import kotlinx.coroutines.flow.Flow

class InteractionRepository(private val db: AppDatabase) {

    val notifications: Flow<List<NotificationEntity>> = db.interactionDao().getAllNotifications()
    val unreadCount: Flow<Int> = db.interactionDao().getUnreadCount()
    val activityLogs: Flow<List<ActivityLogEntity>> = db.interactionDao().getActivityLogs()

    suspend fun markAsRead(notificationId: String) {
        db.interactionDao().markAsRead(notificationId)
    }

    suspend fun markAllAsRead() {
        db.interactionDao().markAllAsRead()
    }

    suspend fun deleteNotification(notificationId: String) {
        db.interactionDao().deleteNotification(notificationId)
    }

    suspend fun clearActivityLogs() {
        db.interactionDao().clearActivityLogs()
    }
}
