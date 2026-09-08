package com.example.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.outlined.Group
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Menu
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.People
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
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.UserEntity
import com.example.data.repository.AuthRepository
import com.example.data.repository.GroupRepository
import com.example.data.repository.InteractionRepository
import com.example.data.repository.PostRepository
import com.example.data.repository.UserRepository
import com.example.ui.screens.feed.FeedScreen
import com.example.ui.screens.groups.GroupsHomeScreen
import com.example.ui.screens.menu.MenuScreen
import com.example.ui.screens.menu.NotificationsScreen
import com.example.ui.screens.profile.FindFriendsScreen
import com.example.ui.theme.ZunexPrimaryBlue

data class NavTabItem(
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val testTag: String
)

@Composable
fun MainTabScaffold(
    currentUser: UserEntity?,
    authRepository: AuthRepository,
    userRepository: UserRepository,
    postRepository: PostRepository,
    groupRepository: GroupRepository,
    interactionRepository: InteractionRepository,
    onCreatePostClick: () -> Unit,
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onGroupClick: (String) -> Unit,
    onCreateGroupClick: () -> Unit,
    onPhotoClick: (String) -> Unit,
    onSearchClick: () -> Unit,
    onEditPostClick: (String) -> Unit,
    onFriendRequestsClick: () -> Unit,
    onProfileClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onActivityLogClick: () -> Unit,
    onBlockedUsersClick: () -> Unit,
    onHelpClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    var selectedTabIndex by rememberSaveable { mutableIntStateOf(0) }
    val unreadNotifs by interactionRepository.unreadCount.collectAsStateWithLifecycle(initialValue = 0)

    val tabItems = listOf(
        NavTabItem("Home", Icons.Filled.Home, Icons.Outlined.Home, "tab_home"),
        NavTabItem("Friends", Icons.Filled.People, Icons.Outlined.People, "tab_friends"),
        NavTabItem("Groups", Icons.Filled.Group, Icons.Outlined.Group, "tab_groups"),
        NavTabItem("Notifications", Icons.Filled.Notifications, Icons.Outlined.Notifications, "tab_notifications"),
        NavTabItem("Menu", Icons.Filled.Menu, Icons.Outlined.Menu, "tab_menu")
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 6.dp
            ) {
                tabItems.forEachIndexed { index, tab ->
                    val isSelected = selectedTabIndex == index
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { selectedTabIndex = index },
                        icon = {
                            if (index == 3 && unreadNotifs > 0) {
                                BadgedBox(
                                    badge = {
                                        Badge(containerColor = Color(0xFFE53935)) {
                                            Text(
                                                text = if (unreadNotifs > 9) "9+" else unreadNotifs.toString(),
                                                color = Color.White,
                                                fontSize = 10.sp
                                            )
                                        }
                                    }
                                ) {
                                    Icon(
                                        imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                                        contentDescription = tab.title
                                    )
                                }
                            } else {
                                Icon(
                                    imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                                    contentDescription = tab.title
                                )
                            }
                        },
                        label = {
                            Text(
                                text = tab.title,
                                fontSize = 11.sp,
                                color = if (isSelected) ZunexPrimaryBlue else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = ZunexPrimaryBlue,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            indicatorColor = ZunexPrimaryBlue.copy(alpha = 0.12f)
                        ),
                        modifier = Modifier.testTag(tab.testTag)
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (selectedTabIndex) {
                0 -> FeedScreen(
                    currentUser = currentUser,
                    postRepository = postRepository,
                    unreadNotificationsCount = unreadNotifs,
                    onCreatePostClick = onCreatePostClick,
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
                    onFriendRequestsClick = onFriendRequestsClick,
                    onAuthorClick = onAuthorClick,
                    onSearchClick = onSearchClick
                )
                2 -> GroupsHomeScreen(
                    currentUser = currentUser,
                    groupRepository = groupRepository,
                    onGroupClick = onGroupClick,
                    onCreateGroupClick = onCreateGroupClick,
                    onSearchClick = onSearchClick
                )
                3 -> NotificationsScreen(
                    interactionRepository = interactionRepository,
                    onNotificationClick = { targetType, targetId ->
                        when (targetType) {
                            "post" -> onPostClick(targetId)
                            "group" -> onGroupClick(targetId)
                            "user" -> onAuthorClick(targetId)
                        }
                    },
                    onNavigateBack = { selectedTabIndex = 0 }
                )
                4 -> MenuScreen(
                    currentUser = currentUser,
                    authRepository = authRepository,
                    onProfileClick = onProfileClick,
                    onGroupsClick = { selectedTabIndex = 2 },
                    onFriendsClick = { selectedTabIndex = 1 },
                    onSettingsClick = onSettingsClick,
                    onActivityLogClick = onActivityLogClick,
                    onBlockedUsersClick = onBlockedUsersClick,
                    onHelpClick = onHelpClick,
                    onLogoutClick = onLogoutClick
                )
            }
        }
    }
}
