package com.example.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.data.repository.AuthRepository
import com.example.data.repository.GroupRepository
import com.example.data.repository.InteractionRepository
import com.example.data.repository.PostRepository
import com.example.data.repository.UserRepository
import com.example.ui.screens.auth.ForgotPasswordScreen
import com.example.ui.screens.auth.LoginScreen
import com.example.ui.screens.auth.RegisterScreen
import com.example.ui.screens.feed.CreatePostScreen
import com.example.ui.screens.feed.EditPostScreen
import com.example.ui.screens.feed.MediaViewerScreen
import com.example.ui.screens.feed.PostDetailScreen
import com.example.ui.screens.groups.CreateGroupScreen
import com.example.ui.screens.groups.GroupDetailScreen
import com.example.ui.screens.groups.GroupMediaScreen
import com.example.ui.screens.groups.GroupMembersScreen
import com.example.ui.screens.groups.GroupPendingRequestsScreen
import com.example.ui.screens.groups.GroupSettingsScreen
import com.example.ui.screens.menu.ActivityLogScreen
import com.example.ui.screens.menu.BlockedUsersScreen
import com.example.ui.screens.menu.GlobalSearchScreen
import com.example.ui.screens.menu.HelpSupportScreen
import com.example.ui.screens.menu.SettingsScreen
import com.example.ui.screens.profile.EditProfileScreen
import com.example.ui.screens.profile.FriendRequestsScreen
import com.example.ui.screens.profile.FriendsListScreen
import com.example.ui.screens.profile.ProfilePhotosScreen
import com.example.ui.screens.profile.ProfileScreen
import com.example.ui.screens.profile.UserAboutScreen

@Composable
fun AppNavigator(
    authRepository: AuthRepository,
    userRepository: UserRepository,
    postRepository: PostRepository,
    groupRepository: GroupRepository,
    interactionRepository: InteractionRepository
) {
    val navController = rememberNavController()
    val currentUser by authRepository.currentUser.collectAsStateWithLifecycle(initialValue = null)

    val startDestination = if (currentUser != null) "main_tabs" else Screen.Login.route

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // --- Auth Destinations ---
        composable(Screen.Login.route) {
            LoginScreen(
                authRepository = authRepository,
                onLoginSuccess = {
                    navController.navigate("main_tabs") {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                },
                onNavigateToForgotPassword = {
                    navController.navigate(Screen.ForgotPassword.route)
                }
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                authRepository = authRepository,
                onRegisterSuccess = {
                    navController.navigate("main_tabs") {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ForgotPassword.route) {
            ForgotPasswordScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }

        // --- Main Hub (5 Bottom Tabs) ---
        composable("main_tabs") {
            MainTabScaffold(
                currentUser = currentUser,
                authRepository = authRepository,
                userRepository = userRepository,
                postRepository = postRepository,
                groupRepository = groupRepository,
                interactionRepository = interactionRepository,
                onCreatePostClick = {
                    navController.navigate(Screen.CreatePost.createRoute())
                },
                onPostClick = { postId ->
                    navController.navigate(Screen.PostDetail.createRoute(postId))
                },
                onAuthorClick = { userId ->
                    navController.navigate(Screen.Profile.createRoute(userId))
                },
                onGroupClick = { groupId ->
                    navController.navigate(Screen.GroupDetail.createRoute(groupId))
                },
                onCreateGroupClick = {
                    navController.navigate(Screen.CreateGroup.route)
                },
                onPhotoClick = { url ->
                    navController.navigate(Screen.MediaViewer.createRoute(url))
                },
                onSearchClick = {
                    navController.navigate(Screen.GlobalSearch.route)
                },
                onEditPostClick = { postId ->
                    navController.navigate(Screen.EditPost.createRoute(postId))
                },
                onFriendRequestsClick = {
                    navController.navigate(Screen.FriendRequests.route)
                },
                onProfileClick = {
                    currentUser?.let { user ->
                        navController.navigate(Screen.Profile.createRoute(user.id))
                    }
                },
                onSettingsClick = {
                    navController.navigate(Screen.Settings.route)
                },
                onActivityLogClick = {
                    navController.navigate(Screen.ActivityLog.route)
                },
                onBlockedUsersClick = {
                    navController.navigate(Screen.BlockedUsers.route)
                },
                onHelpClick = {
                    navController.navigate(Screen.HelpSupport.route)
                },
                onLogoutClick = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo("main_tabs") { inclusive = true }
                    }
                }
            )
        }

        // --- Post Flow ---
        composable(
            route = "create_post?groupId={groupId}",
            arguments = listOf(navArgument("groupId") {
                type = NavType.StringType
                nullable = true
                defaultValue = null
            })
        ) { backStackEntry ->
            val groupId = backStackEntry.arguments?.getString("groupId")
            CreatePostScreen(
                currentUser = currentUser,
                postRepository = postRepository,
                groupId = groupId,
                onPostCreated = { navController.popBackStack() },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.EditPost.route,
            arguments = listOf(navArgument("postId") { type = NavType.StringType })
        ) { backStackEntry ->
            val postId = backStackEntry.arguments?.getString("postId") ?: ""
            EditPostScreen(
                postId = postId,
                postRepository = postRepository,
                onPostUpdated = { navController.popBackStack() },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.PostDetail.route,
            arguments = listOf(navArgument("postId") { type = NavType.StringType })
        ) { backStackEntry ->
            val postId = backStackEntry.arguments?.getString("postId") ?: ""
            PostDetailScreen(
                postId = postId,
                currentUser = currentUser,
                postRepository = postRepository,
                onAuthorClick = { userId ->
                    navController.navigate(Screen.Profile.createRoute(userId))
                },
                onPhotoClick = { url ->
                    navController.navigate(Screen.MediaViewer.createRoute(url))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = "media_viewer?url={url}",
            arguments = listOf(navArgument("url") { type = NavType.StringType })
        ) { backStackEntry ->
            val url = backStackEntry.arguments?.getString("url") ?: ""
            MediaViewerScreen(
                photoUrl = url,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        // --- Profile Flow ---
        composable(
            route = Screen.Profile.route,
            arguments = listOf(navArgument("userId") { type = NavType.StringType })
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId") ?: (currentUser?.id ?: "")
            ProfileScreen(
                userId = userId,
                currentUser = currentUser,
                userRepository = userRepository,
                postRepository = postRepository,
                onEditProfileClick = {
                    navController.navigate(Screen.EditProfile.route)
                },
                onFriendsListClick = { uId ->
                    navController.navigate(Screen.FriendsList.createRoute(uId))
                },
                onAboutClick = { uId ->
                    navController.navigate(Screen.UserAbout.createRoute(uId))
                },
                onPhotosClick = { uId ->
                    navController.navigate(Screen.ProfilePhotos.createRoute(uId))
                },
                onPostClick = { postId ->
                    navController.navigate(Screen.PostDetail.createRoute(postId))
                },
                onPhotoClick = { url ->
                    navController.navigate(Screen.MediaViewer.createRoute(url))
                },
                onAuthorClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.EditProfile.route) {
            EditProfileScreen(
                currentUser = currentUser,
                userRepository = userRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.FriendsList.route,
            arguments = listOf(navArgument("userId") { type = NavType.StringType })
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId") ?: ""
            FriendsListScreen(
                userId = userId,
                userRepository = userRepository,
                onAuthorClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.FriendRequests.route) {
            FriendRequestsScreen(
                currentUser = currentUser,
                userRepository = userRepository,
                onAuthorClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.UserAbout.route,
            arguments = listOf(navArgument("userId") { type = NavType.StringType })
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId") ?: ""
            UserAboutScreen(
                userId = userId,
                userRepository = userRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.ProfilePhotos.route,
            arguments = listOf(navArgument("userId") { type = NavType.StringType })
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId") ?: ""
            ProfilePhotosScreen(
                userId = userId,
                postRepository = postRepository,
                onPhotoClick = { url ->
                    navController.navigate(Screen.MediaViewer.createRoute(url))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        // --- Groups Flow ---
        composable(
            route = Screen.GroupDetail.route,
            arguments = listOf(navArgument("groupId") { type = NavType.StringType })
        ) { backStackEntry ->
            val groupId = backStackEntry.arguments?.getString("groupId") ?: ""
            GroupDetailScreen(
                groupId = groupId,
                currentUser = currentUser,
                groupRepository = groupRepository,
                postRepository = postRepository,
                onCreateGroupPostClick = { gId ->
                    navController.navigate(Screen.CreatePost.createRoute(gId))
                },
                onMembersClick = { gId ->
                    navController.navigate(Screen.GroupMembers.createRoute(gId))
                },
                onPendingRequestsClick = { gId ->
                    navController.navigate(Screen.GroupPendingRequests.createRoute(gId))
                },
                onSettingsClick = { gId ->
                    navController.navigate(Screen.GroupSettings.createRoute(gId))
                },
                onMediaClick = { gId ->
                    navController.navigate(Screen.GroupMedia.createRoute(gId))
                },
                onPostClick = { pId ->
                    navController.navigate(Screen.PostDetail.createRoute(pId))
                },
                onAuthorClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onPhotoClick = { url ->
                    navController.navigate(Screen.MediaViewer.createRoute(url))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.CreateGroup.route) {
            CreateGroupScreen(
                currentUser = currentUser,
                groupRepository = groupRepository,
                onGroupCreated = { groupId ->
                    navController.navigate(Screen.GroupDetail.createRoute(groupId)) {
                        popUpTo(Screen.CreateGroup.route) { inclusive = true }
                    }
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.GroupMembers.route,
            arguments = listOf(navArgument("groupId") { type = NavType.StringType })
        ) { backStackEntry ->
            val groupId = backStackEntry.arguments?.getString("groupId") ?: ""
            GroupMembersScreen(
                groupId = groupId,
                groupRepository = groupRepository,
                onAuthorClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.GroupPendingRequests.route,
            arguments = listOf(navArgument("groupId") { type = NavType.StringType })
        ) { backStackEntry ->
            val groupId = backStackEntry.arguments?.getString("groupId") ?: ""
            GroupPendingRequestsScreen(
                groupId = groupId,
                groupRepository = groupRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.GroupSettings.route,
            arguments = listOf(navArgument("groupId") { type = NavType.StringType })
        ) { backStackEntry ->
            val groupId = backStackEntry.arguments?.getString("groupId") ?: ""
            GroupSettingsScreen(
                groupId = groupId,
                groupRepository = groupRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.GroupMedia.route,
            arguments = listOf(navArgument("groupId") { type = NavType.StringType })
        ) { backStackEntry ->
            val groupId = backStackEntry.arguments?.getString("groupId") ?: ""
            GroupMediaScreen(
                groupId = groupId,
                groupRepository = groupRepository,
                onPhotoClick = { url ->
                    navController.navigate(Screen.MediaViewer.createRoute(url))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        // --- Search, Settings & Logs ---
        composable(Screen.GlobalSearch.route) {
            GlobalSearchScreen(
                userRepository = userRepository,
                groupRepository = groupRepository,
                postRepository = postRepository,
                onUserClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onGroupClick = { gId ->
                    navController.navigate(Screen.GroupDetail.createRoute(gId))
                },
                onPostClick = { pId ->
                    navController.navigate(Screen.PostDetail.createRoute(pId))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                currentUser = currentUser,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ActivityLog.route) {
            ActivityLogScreen(
                interactionRepository = interactionRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.BlockedUsers.route) {
            BlockedUsersScreen(
                currentUser = currentUser,
                userRepository = userRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.HelpSupport.route) {
            HelpSupportScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}
