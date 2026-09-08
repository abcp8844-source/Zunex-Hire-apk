package com.example.ui.navigation

sealed class Screen(val route: String) {
    // Auth
    object Login : Screen("login")
    object Register : Screen("register")
    object ForgotPassword : Screen("forgot_password")

    // Main Tabs
    object Feed : Screen("tab_feed")
    object Friends : Screen("tab_friends")
    object Groups : Screen("tab_groups")
    object Notifications : Screen("tab_notifications")
    object Menu : Screen("tab_menu")

    // Post Flow
    object CreatePost : Screen("create_post?groupId={groupId}") {
        fun createRoute(groupId: String? = null) = if (groupId != null) "create_post?groupId=$groupId" else "create_post"
    }
    object EditPost : Screen("edit_post/{postId}") {
        fun createRoute(postId: String) = "edit_post/$postId"
    }
    object PostDetail : Screen("post_detail/{postId}") {
        fun createRoute(postId: String) = "post_detail/$postId"
    }
    object MediaViewer : Screen("media_viewer?url={url}") {
        fun createRoute(url: String) = "media_viewer?url=${android.net.Uri.encode(url)}"
    }

    // Profile Flow
    object Profile : Screen("profile/{userId}") {
        fun createRoute(userId: String) = "profile/$userId"
    }
    object EditProfile : Screen("edit_profile")
    object FriendsList : Screen("friends_list/{userId}") {
        fun createRoute(userId: String) = "friends_list/$userId"
    }
    object FindFriends : Screen("find_friends")
    object FriendRequests : Screen("friend_requests")
    object UserAbout : Screen("user_about/{userId}") {
        fun createRoute(userId: String) = "user_about/$userId"
    }
    object ProfilePhotos : Screen("profile_photos/{userId}") {
        fun createRoute(userId: String) = "profile_photos/$userId"
    }

    // Groups Flow
    object GroupDetail : Screen("group_detail/{groupId}") {
        fun createRoute(groupId: String) = "group_detail/$groupId"
    }
    object CreateGroup : Screen("create_group")
    object GroupMembers : Screen("group_members/{groupId}") {
        fun createRoute(groupId: String) = "group_members/$groupId"
    }
    object GroupPendingRequests : Screen("group_pending/{groupId}") {
        fun createRoute(groupId: String) = "group_pending/$groupId"
    }
    object GroupSettings : Screen("group_settings/{groupId}") {
        fun createRoute(groupId: String) = "group_settings/$groupId"
    }
    object GroupMedia : Screen("group_media/{groupId}") {
        fun createRoute(groupId: String) = "group_media/$groupId"
    }

    // Search & Menu
    object GlobalSearch : Screen("global_search")
    object Settings : Screen("settings")
    object ActivityLog : Screen("activity_log")
    object BlockedUsers : Screen("blocked_users")
    object HelpSupport : Screen("help_support")
}
