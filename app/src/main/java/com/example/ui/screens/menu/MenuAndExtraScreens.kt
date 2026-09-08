package com.example.ui.screens.menu

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.automirrored.filled.Help
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Help
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.ThumbUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.example.data.model.UserEntity
import com.example.data.repository.AuthRepository
import com.example.data.repository.GroupRepository
import com.example.data.repository.InteractionRepository
import com.example.data.repository.PostRepository
import com.example.data.repository.UserRepository
import com.example.ui.components.formatTimeAgo
import com.example.ui.theme.FbBorder
import com.example.ui.theme.ReactionLikeBlue
import com.example.ui.theme.ZunexAccentGold
import com.example.ui.theme.ZunexPrimaryBlue
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(
    interactionRepository: InteractionRepository,
    onNotificationClick: (String, String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val notifications by interactionRepository.notifications.collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Notifications", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = {
                        coroutineScope.launch {
                            interactionRepository.markAllAsRead()
                        }
                    }) {
                        Icon(Icons.Default.DoneAll, contentDescription = "Mark all as read", tint = ZunexPrimaryBlue)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        if (notifications.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No notifications yet.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                items(notifications, key = { it.id }) { notif ->
                    ListItem(
                        headlineContent = {
                            Text(
                                text = notif.title,
                                fontWeight = if (!notif.isRead) FontWeight.Bold else FontWeight.Normal,
                                fontSize = 14.sp
                            )
                        },
                        supportingContent = {
                            Column {
                                Text(notif.message, fontSize = 13.sp)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(formatTimeAgo(notif.createdAt), fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        },
                        leadingContent = {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(
                                        when (notif.type) {
                                            "like" -> ReactionLikeBlue.copy(alpha = 0.15f)
                                            "comment" -> Color(0xFF4CAF50).copy(alpha = 0.15f)
                                            "friend_request" -> ZunexPrimaryBlue.copy(alpha = 0.15f)
                                            else -> ZunexAccentGold.copy(alpha = 0.2f)
                                        }
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = when (notif.type) {
                                        "like" -> Icons.Default.ThumbUp
                                        "comment" -> Icons.AutoMirrored.Filled.Chat
                                        "friend_request" -> Icons.Default.PersonAdd
                                        else -> Icons.Default.Notifications
                                    },
                                    contentDescription = null,
                                    tint = when (notif.type) {
                                        "like" -> ReactionLikeBlue
                                        "comment" -> Color(0xFF4CAF50)
                                        "friend_request" -> ZunexPrimaryBlue
                                        else -> ZunexAccentGold
                                    },
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        },
                        trailingContent = {
                            if (!notif.isRead) {
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .clip(CircleShape)
                                        .background(ZunexPrimaryBlue)
                                )
                            }
                        },
                        modifier = Modifier
                            .clickable {
                                coroutineScope.launch {
                                    interactionRepository.markAsRead(notif.id)
                                    onNotificationClick(notif.targetType, notif.targetId)
                                }
                            }
                            .background(if (!notif.isRead) ZunexPrimaryBlue.copy(alpha = 0.05f) else Color.Transparent)
                    )
                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.1f))
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GlobalSearchScreen(
    userRepository: UserRepository,
    groupRepository: GroupRepository,
    postRepository: PostRepository,
    onUserClick: (String) -> Unit,
    onGroupClick: (String) -> Unit,
    onPostClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    var query by remember { mutableStateOf("") }
    var selectedTab by remember { mutableIntStateOf(0) }

    val userResults by userRepository.searchUsers(query).collectAsStateWithLifecycle(initialValue = emptyList())
    val groupResults by groupRepository.searchGroups(query).collectAsStateWithLifecycle(initialValue = emptyList())
    val postResults by postRepository.searchPosts(query).collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    OutlinedTextField(
                        value = query,
                        onValueChange = { query = it },
                        placeholder = { Text("Search Zunex...") },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                        trailingIcon = {
                            if (query.isNotEmpty()) {
                                IconButton(onClick = { query = "" }) {
                                    Icon(Icons.Default.Close, contentDescription = "Clear")
                                }
                            }
                        },
                        singleLine = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("global_search_input"),
                        shape = RoundedCornerShape(24.dp)
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = ZunexPrimaryBlue
            ) {
                Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("People") })
                Tab(selected = selectedTab == 1, onClick = { selectedTab = 1 }, text = { Text("Groups") })
                Tab(selected = selectedTab == 2, onClick = { selectedTab = 2 }, text = { Text("Posts") })
            }

            if (query.isBlank()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Type something to search people, groups, or posts", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            } else {
                when (selectedTab) {
                    0 -> {
                        // People
                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            items(userResults, key = { it.id }) { user ->
                                ListItem(
                                    headlineContent = { Text(user.name, fontWeight = FontWeight.Bold) },
                                    supportingContent = { Text(user.bio.ifBlank { user.livesIn }) },
                                    leadingContent = {
                                        AsyncImage(
                                            model = user.avatarUrl.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                            contentDescription = null,
                                            modifier = Modifier
                                                .size(44.dp)
                                                .clip(CircleShape)
                                        )
                                    },
                                    modifier = Modifier.clickable { onUserClick(user.id) }
                                )
                                HorizontalDivider()
                            }
                        }
                    }
                    1 -> {
                        // Groups
                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            items(groupResults, key = { it.id }) { group ->
                                ListItem(
                                    headlineContent = { Text(group.name, fontWeight = FontWeight.Bold) },
                                    supportingContent = { Text("${group.membersCount} members • ${group.privacy}") },
                                    leadingContent = {
                                        AsyncImage(
                                            model = group.coverPhotoUrl,
                                            contentDescription = null,
                                            contentScale = ContentScale.Crop,
                                            modifier = Modifier
                                                .size(44.dp)
                                                .clip(RoundedCornerShape(8.dp))
                                        )
                                    },
                                    modifier = Modifier.clickable { onGroupClick(group.id) }
                                )
                                HorizontalDivider()
                            }
                        }
                    }
                    2 -> {
                        // Posts
                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            items(postResults, key = { it.id }) { post ->
                                ListItem(
                                    headlineContent = { Text(post.authorName, fontWeight = FontWeight.Bold) },
                                    supportingContent = { Text(post.content, maxLines = 2) },
                                    leadingContent = {
                                        AsyncImage(
                                            model = post.authorAvatar,
                                            contentDescription = null,
                                            modifier = Modifier
                                                .size(40.dp)
                                                .clip(CircleShape)
                                        )
                                    },
                                    modifier = Modifier.clickable { onPostClick(post.id) }
                                )
                                HorizontalDivider()
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MenuScreen(
    currentUser: UserEntity?,
    authRepository: AuthRepository,
    onProfileClick: () -> Unit,
    onGroupsClick: () -> Unit,
    onFriendsClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onActivityLogClick: () -> Unit,
    onBlockedUsersClick: () -> Unit,
    onHelpClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Menu", fontWeight = FontWeight.ExtraBold, fontSize = 22.sp) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Profile Card Shortcut
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onProfileClick() }
                    .testTag("menu_profile_shortcut"),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                        contentDescription = "Profile",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(52.dp)
                            .clip(CircleShape)
                    )

                    Spacer(modifier = Modifier.width(14.dp))

                    Column {
                        Text(
                            text = currentUser?.name ?: "Zunex User",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Text(
                            text = "See your profile",
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Text("All Shortcuts", fontWeight = FontWeight.Bold, fontSize = 16.sp, modifier = Modifier.padding(top = 4.dp))

            // Facebook Style 2-column shortcuts grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                MenuShortcutCard(
                    title = "Groups",
                    icon = Icons.Default.Group,
                    iconColor = ZunexPrimaryBlue,
                    modifier = Modifier.weight(1f),
                    onClick = onGroupsClick
                )
                MenuShortcutCard(
                    title = "Friends",
                    icon = Icons.Default.People,
                    iconColor = Color(0xFF1E88E5),
                    modifier = Modifier.weight(1f),
                    onClick = onFriendsClick
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                MenuShortcutCard(
                    title = "Activity Log",
                    icon = Icons.Default.History,
                    iconColor = ZunexAccentGold,
                    modifier = Modifier.weight(1f),
                    onClick = onActivityLogClick
                )
                MenuShortcutCard(
                    title = "Saved Posts",
                    icon = Icons.Default.Bookmark,
                    iconColor = Color(0xFF8E24AA),
                    modifier = Modifier.weight(1f),
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text("Settings & Preferences", fontWeight = FontWeight.Bold, fontSize = 16.sp)

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Settings & Privacy", fontWeight = FontWeight.SemiBold) },
                        leadingContent = { Icon(Icons.Default.Settings, contentDescription = null, tint = ZunexPrimaryBlue) },
                        modifier = Modifier.clickable { onSettingsClick() }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Blocked Accounts", fontWeight = FontWeight.SemiBold) },
                        leadingContent = { Icon(Icons.Default.Block, contentDescription = null, tint = Color(0xFFE53935)) },
                        modifier = Modifier.clickable { onBlockedUsersClick() }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Help & Support", fontWeight = FontWeight.SemiBold) },
                        leadingContent = { Icon(Icons.AutoMirrored.Filled.Help, contentDescription = null, tint = Color(0xFF43A047)) },
                        modifier = Modifier.clickable { onHelpClick() }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Log Out Button
            Button(
                onClick = {
                    coroutineScope.launch {
                        authRepository.logout()
                        onLogoutClick()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .testTag("menu_logout_button"),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, tint = Color(0xFFE53935))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Log Out", color = Color(0xFFE53935), fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun MenuShortcutCard(
    title: String,
    icon: ImageVector,
    iconColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(90.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Icon(imageVector = icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(26.dp))
            Text(text = title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    currentUser: UserEntity?,
    onNavigateBack: () -> Unit
) {
    var notificationsEnabled by remember { mutableStateOf(true) }
    var soundEnabled by remember { mutableStateOf(true) }
    var tagApproval by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Text("Preferences", fontWeight = FontWeight.Bold, fontSize = 16.sp)

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Push Notifications") },
                        trailingContent = {
                            Switch(checked = notificationsEnabled, onCheckedChange = { notificationsEnabled = it })
                        }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Sound and Vibrations") },
                        trailingContent = {
                            Switch(checked = soundEnabled, onCheckedChange = { soundEnabled = it })
                        }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Review tags before they appear") },
                        trailingContent = {
                            Switch(checked = tagApproval, onCheckedChange = { tagApproval = it })
                        }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActivityLogScreen(
    interactionRepository: InteractionRepository,
    onNavigateBack: () -> Unit
) {
    val logs by interactionRepository.activityLogs.collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Activity Log", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = {
                        coroutineScope.launch {
                            interactionRepository.clearActivityLogs()
                        }
                    }) {
                        Icon(Icons.Default.DeleteSweep, contentDescription = "Clear Logs")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (logs.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No recent activity records.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                items(logs, key = { it.id }) { log ->
                    ListItem(
                        headlineContent = { Text(log.description, fontSize = 14.sp) },
                        supportingContent = { Text(formatTimeAgo(log.timestamp), fontSize = 12.sp) },
                        leadingContent = {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = ZunexPrimaryBlue)
                        }
                    )
                    HorizontalDivider()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BlockedUsersScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onNavigateBack: () -> Unit
) {
    val blocked by userRepository.getBlockedUsers(currentUser?.id ?: "").collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Blocked People", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (blocked.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("You haven't blocked anyone.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(12.dp)
            ) {
                items(blocked, key = { it.id }) { item ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(item.blockedUserName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Button(
                                onClick = {
                                    if (currentUser != null) {
                                        coroutineScope.launch {
                                            userRepository.unblockUser(currentUser.id, item.blockedUserId)
                                        }
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Text("Unblock", color = MaterialTheme.colorScheme.onSurface)
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HelpSupportScreen(
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Help & Support", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Zunex Help Center", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = ZunexPrimaryBlue)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Welcome to Zunex Community! Here you can connect with colleagues, share status posts, react with custom emojis, and join groups.", fontSize = 14.sp)
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Frequently Asked Questions", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Q: Are videos and live streaming supported?", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    Text("A: Zunex focuses purely on rich text posts, photo sharing, groups, discussions, and friend networking without video distractions.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}
