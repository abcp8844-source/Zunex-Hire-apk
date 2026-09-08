package com.example.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.People
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import coil.compose.AsyncImage
import com.example.data.model.UserEntity
import com.example.data.repository.AuthRepository
import com.example.data.repository.GroupRepository
import com.example.data.repository.InteractionRepository
import com.example.data.repository.PostRepository
import com.example.data.repository.UserRepository
import com.example.ui.screens.auth.ForgotPasswordScreen
import com.example.ui.screens.auth.LoginScreen
import com.example.ui.screens.auth.RegisterScreen
import com.example.ui.screens.feed.CreatePostScreen
import com.example.ui.screens.feed.CreateStoryScreen
import com.example.ui.screens.feed.EditPostScreen
import com.example.ui.screens.feed.FeedScreen
import com.example.ui.screens.feed.MediaViewerScreen
import com.example.ui.screens.feed.PostDetailScreen
import com.example.ui.screens.feed.StoryViewerScreen
import com.example.ui.screens.groups.CreateGroupScreen
import com.example.ui.screens.groups.GroupAdminToolsScreen
import com.example.ui.screens.groups.GroupDetailScreen
import com.example.ui.screens.groups.GroupListScreen
import com.example.ui.screens.groups.GroupMediaScreen
import com.example.ui.screens.groups.GroupMembersScreen
import com.example.ui.screens.groups.GroupPendingRequestsScreen
import com.example.ui.screens.groups.GroupSettingsScreen
import com.example.ui.screens.menu.ActivityLogScreen
import com.example.ui.screens.menu.HelpAndSupportScreen
import com.example.ui.screens.menu.MenuScreen
import com.example.ui.screens.menu.NotificationsScreen
import com.example.ui.screens.menu.SavedPostsScreen
import com.example.ui.screens.menu.SearchScreen
import com.example.ui.screens.menu.SettingsBlockingScreen
import com.example.ui.screens.menu.SettingsPasswordSecurityScreen
import com.example.ui.screens.menu.SettingsPermissionsScreen
import com.example.ui.screens.menu.SettingsPersonalDetailsScreen
import com.example.ui.screens.menu.SettingsScreen
import com.example.ui.screens.profile.EditProfileScreen
import com.example.ui.screens.profile.FindFriendsScreen
import com.example.ui.screens.profile.FriendRequestsScreen
import com.example.ui.screens.profile.FriendsListScreen
import com.example.ui.screens.profile.LockProfileScreen
import com.example.ui.screens.profile.ProfessionalDashboardScreen
import com.example.ui.screens.profile.ProfilePhotosScreen
import com.example.ui.screens.profile.ProfileScreen
import com.example.ui.screens.profile.UserAboutScreen
import com.example.ui.theme.ZunexPrimaryBlue
import kotlinx.coroutines.launch

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
    val coroutineScope = rememberCoroutineScope()

    val startDestination = if (currentUser != null) "main_tabs" else Screen.Login.route

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // --- Auth Flow ---
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

        // --- Main Tabs Container ---
        composable("main_tabs") {
            MainTabScaffold(
                currentUser = currentUser,
                userRepository = userRepository,
                postRepository = postRepository,
                groupRepository = groupRepository,
                interactionRepository = interactionRepository,
                onCreatePostClick = {
                    navController.navigate(Screen.CreatePost.createRoute())
                },
                onCreateStoryClick = {
                    navController.navigate(Screen.CreateStory.route)
                },
                onStoryClick = { storyId ->
                    navController.navigate(Screen.StoryViewer.createRoute(storyId))
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
                onNotificationsClick = {
                    navController.navigate(Screen.Notifications.route)
                },
                onEditPostClick = { postId ->
                    navController.navigate(Screen.EditPost.createRoute(postId))
                },
                onSavedPostsClick = {
                    navController.navigate(Screen.SavedPosts.route)
                },
                onFriendsClick = {
                    currentUser?.let { user ->
                        navController.navigate(Screen.FriendsList.createRoute(user.id))
                    }
                },
                onProfileClick = {
                    currentUser?.let { user ->
                        navController.navigate(Screen.Profile.createRoute(user.id))
                    }
                },
                onLockProfileClick = {
                    navController.navigate(Screen.LockProfile.route)
                },
                onProfessionalDashboardClick = {
                    navController.navigate(Screen.ProfessionalDashboard.route)
                },
                onSettingsClick = {
                    navController.navigate(Screen.Settings.route)
                },
                onActivityLogClick = {
                    navController.navigate(Screen.ActivityLog.route)
                },
                onHelpClick = {
                    navController.navigate(Screen.HelpSupport.route)
                },
                onLogoutClick = {
                    coroutineScope.launch {
                        authRepository.logout()
                        navController.navigate(Screen.Login.route) {
                            popUpTo("main_tabs") { inclusive = true }
                        }
                    }
                }
            )
        }

        // --- Stories Flow ---
        composable(Screen.CreateStory.route) {
            CreateStoryScreen(
                currentUser = currentUser,
                postRepository = postRepository,
                onStoryCreated = { navController.popBackStack() },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.StoryViewer.route,
            arguments = listOf(navArgument("storyId") { type = NavType.StringType })
        ) { backStackEntry ->
            val storyId = backStackEntry.arguments?.getString("storyId") ?: ""
            StoryViewerScreen(
                storyId = storyId,
                postRepository = postRepository,
                onNavigateBack = { navController.popBackStack() }
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
                groupId = groupId,
                postRepository = postRepository,
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
                url = url,
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
                onLockProfileClick = {
                    navController.navigate(Screen.LockProfile.route)
                },
                onProfessionalDashboardClick = {
                    navController.navigate(Screen.ProfessionalDashboard.route)
                },
                onCreateStoryClick = {
                    navController.navigate(Screen.CreateStory.route)
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
                onProfileSaved = { navController.popBackStack() },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.LockProfile.route) {
            LockProfileScreen(
                currentUser = currentUser,
                userRepository = userRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ProfessionalDashboard.route) {
            ProfessionalDashboardScreen(
                currentUser = currentUser,
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
                onFindFriendsClick = {
                    navController.navigate(Screen.FindFriends.route)
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.FindFriends.route) {
            FindFriendsScreen(
                currentUser = currentUser,
                userRepository = userRepository,
                onAuthorClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onFriendRequestsClick = {
                    navController.navigate(Screen.FriendRequests.route)
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
                onAdminToolsClick = { gId ->
                    navController.navigate(Screen.GroupAdminTools.createRoute(gId))
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

        composable(
            route = Screen.GroupAdminTools.route,
            arguments = listOf(navArgument("groupId") { type = NavType.StringType })
        ) { backStackEntry ->
            val groupId = backStackEntry.arguments?.getString("groupId") ?: ""
            GroupAdminToolsScreen(
                groupId = groupId,
                groupRepository = groupRepository,
                onSettingsClick = { gId ->
                    navController.navigate(Screen.GroupSettings.createRoute(gId))
                },
                onPendingRequestsClick = { gId ->
                    navController.navigate(Screen.GroupPendingRequests.createRoute(gId))
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

        // --- Search, Notifications, Saved, Settings Sub-pages ---
        composable(Screen.GlobalSearch.route) {
            SearchScreen(
                userRepository = userRepository,
                postRepository = postRepository,
                groupRepository = groupRepository,
                onAuthorClick = { uId ->
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

        composable(Screen.Notifications.route) {
            NotificationsScreen(
                currentUser = currentUser,
                interactionRepository = interactionRepository,
                onPostClick = { pId ->
                    navController.navigate(Screen.PostDetail.createRoute(pId))
                },
                onAuthorClick = { uId ->
                    navController.navigate(Screen.Profile.createRoute(uId))
                },
                onGroupClick = { gId ->
                    navController.navigate(Screen.GroupDetail.createRoute(gId))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.SavedPosts.route) {
            SavedPostsScreen(
                currentUser = currentUser,
                postRepository = postRepository,
                onPostClick = { pId ->
                    navController.navigate(Screen.PostDetail.createRoute(pId))
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                currentUser = currentUser,
                onPersonalDetailsClick = { navController.navigate(Screen.SettingsPersonalDetails.route) },
                onPasswordSecurityClick = { navController.navigate(Screen.SettingsPasswordSecurity.route) },
                onLockProfileClick = { navController.navigate(Screen.LockProfile.route) },
                onBlockingClick = { navController.navigate(Screen.SettingsBlocking.route) },
                onPermissionsClick = { navController.navigate(Screen.SettingsPermissions.route) },
                onActivityLogClick = { navController.navigate(Screen.ActivityLog.route) },
                onHelpCenterClick = { navController.navigate(Screen.HelpSupport.route) },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.SettingsPersonalDetails.route) {
            SettingsPersonalDetailsScreen(
                currentUser = currentUser,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.SettingsPasswordSecurity.route) {
            SettingsPasswordSecurityScreen(
                currentUser = currentUser,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.SettingsBlocking.route) {
            SettingsBlockingScreen(
                currentUser = currentUser,
                userRepository = userRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.SettingsPermissions.route) {
            SettingsPermissionsScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ActivityLog.route) {
            ActivityLogScreen(
                currentUser = currentUser,
                postRepository = postRepository,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.HelpSupport.route) {
            HelpAndSupportScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}

@Composable
fun MainTabScaffold(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    postRepository: PostRepository,
    groupRepository: GroupRepository,
    interactionRepository: InteractionRepository,
    onCreatePostClick: () -> Unit,
    onCreateStoryClick: () -> Unit,
    onStoryClick: (String) -> Unit,
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onGroupClick: (String) -> Unit,
    onCreateGroupClick: () -> Unit,
    onPhotoClick: (String) -> Unit,
    onSearchClick: () -> Unit,
    onNotificationsClick: () -> Unit,
    onEditPostClick: (String) -> Unit,
    onSavedPostsClick: () -> Unit,
    onFriendsClick: () -> Unit,
    onProfileClick: () -> Unit,
    onLockProfileClick: () -> Unit,
    onProfessionalDashboardClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onActivityLogClick: () -> Unit,
    onHelpClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    var selectedTabIndex by remember { mutableIntStateOf(0) }
    val unreadCount by interactionRepository.unreadNotificationsCount.collectAsStateWithLifecycle(initialValue = 0)

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = ZunexPrimaryBlue
            ) {
                // Tab 0: Home Feed
                NavigationBarItem(
                    selected = selectedTabIndex == 0,
                    onClick = { selectedTabIndex = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Feed") },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = ZunexPrimaryBlue, indicatorColor = MaterialTheme.colorScheme.surfaceVariant),
                    modifier = Modifier.testTag("tab_home")
                )

                // Tab 1: Friends
                NavigationBarItem(
                    selected = selectedTabIndex == 1,
                    onClick = { selectedTabIndex = 1 },
                    icon = { Icon(Icons.Default.People, contentDescription = "Friends") },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = ZunexPrimaryBlue, indicatorColor = MaterialTheme.colorScheme.surfaceVariant),
                    modifier = Modifier.testTag("tab_friends")
                )

                // Tab 2: Groups
                NavigationBarItem(
                    selected = selectedTabIndex == 2,
                    onClick = { selectedTabIndex = 2 },
                    icon = { Icon(Icons.Default.Group, contentDescription = "Groups") },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = ZunexPrimaryBlue, indicatorColor = MaterialTheme.colorScheme.surfaceVariant),
                    modifier = Modifier.testTag("tab_groups")
                )

                // Tab 3: Notifications
                NavigationBarItem(
                    selected = selectedTabIndex == 3,
                    onClick = { selectedTabIndex = 3 },
                    icon = {
                        BadgedBox(
                            badge = {
                                if (unreadCount > 0) {
                                    Badge(containerColor = Color.Red, contentColor = Color.White) {
                                        Text("$unreadCount", fontSize = 10.sp)
                                    }
                                }
                            }
                        ) {
                            Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                        }
                    },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = ZunexPrimaryBlue, indicatorColor = MaterialTheme.colorScheme.surfaceVariant),
                    modifier = Modifier.testTag("tab_notifications")
                )

                // Tab 4: Menu
                NavigationBarItem(
                    selected = selectedTabIndex == 4,
                    onClick = { selectedTabIndex = 4 },
                    icon = {
                        Box(
                            modifier = Modifier
                                .size(26.dp)
                                .clip(CircleShape)
                                .border(
                                    width = if (selectedTabIndex == 4) 2.dp else 1.dp,
                                    color = if (selectedTabIndex == 4) ZunexPrimaryBlue else Color.Transparent,
                                    shape = CircleShape
                                )
                        ) {
                            AsyncImage(
                                model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                                contentDescription = "Menu Avatar",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        }
                    },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = ZunexPrimaryBlue, indicatorColor = MaterialTheme.colorScheme.surfaceVariant),
                    modifier = Modifier.testTag("tab_menu")
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedTabIndex) {
                0 -> FeedScreen(
                    currentUser = currentUser,
                    postRepository = postRepository,
                    unreadNotificationsCount = unreadCount,
                    onCreatePostClick = onCreatePostClick,
                    onCreateStoryClick = onCreateStoryClick,
                    onStoryClick = onStoryClick,
                    onPostClick = onPostClick,
                    onAuthorClick = onAuthorClick,
                    onGroupClick = onGroupClick,
                    onPhotoClick = onPhotoClick,
                    onSearchClick = onSearchClick,
                    onNotificationsClick = { selectedTabIndex = 3 },
                    onEditPostClick = onEditPostClick
                )

                1 -> FindFriendsScreen(
                    currentUser = currentUser,
                    userRepository = userRepository,
                    onAuthorClick = onAuthorClick,
                    onFriendRequestsClick = {
                        onFriendsClick()
                    },
                    onNavigateBack = { selectedTabIndex = 0 }
                )

                2 -> GroupListScreen(
                    currentUser = currentUser,
                    groupRepository = groupRepository,
                    onCreateGroupClick = onCreateGroupClick,
                    onGroupClick = onGroupClick,
                    onSearchClick = onSearchClick
                )

                3 -> NotificationsScreen(
                    currentUser = currentUser,
                    interactionRepository = interactionRepository,
                    onPostClick = onPostClick,
                    onAuthorClick = onAuthorClick,
                    onGroupClick = onGroupClick,
                    onNavigateBack = { selectedTabIndex = 0 }
                )

                4 -> MenuScreen(
                    currentUser = currentUser,
                    onProfileClick = onProfileClick,
                    onGroupsClick = { selectedTabIndex = 2 },
                    onSavedPostsClick = onSavedPostsClick,
                    onFriendsClick = onFriendsClick,
                    onSettingsClick = onSettingsClick,
                    onActivityLogClick = onActivityLogClick,
                    onHelpClick = onHelpClick,
                    onProfessionalDashboardClick = onProfessionalDashboardClick,
                    onLockProfileClick = onLockProfileClick,
                    onLogoutClick = onLogoutClick
                )
            }
        }
    }
}
