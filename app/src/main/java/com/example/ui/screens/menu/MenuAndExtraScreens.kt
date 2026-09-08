package com.example.ui.screens.menu

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Help
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.PermMedia
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Policy
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.ThumbUp
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.AlertDialog
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
import androidx.compose.material3.Surface
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
import com.example.ui.theme.ReactionLikeBlue
import com.example.ui.theme.ZunexAccentGold
import com.example.ui.theme.ZunexPrimaryBlue
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MenuScreen(
    currentUser: UserEntity?,
    onProfileClick: () -> Unit,
    onGroupsClick: () -> Unit,
    onSavedPostsClick: () -> Unit,
    onFriendsClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onActivityLogClick: () -> Unit,
    onHelpClick: () -> Unit,
    onProfessionalDashboardClick: () -> Unit,
    onLockProfileClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Menu", fontWeight = FontWeight.ExtraBold, fontSize = 24.sp) },
                actions = {
                    IconButton(onClick = onSettingsClick) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
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
                .verticalScroll(rememberScrollState())
                .padding(14.dp)
        ) {
            // User Profile Header Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onProfileClick() }
                    .testTag("menu_profile_card"),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                        contentDescription = "Avatar",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                    )

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = currentUser?.name ?: "Zunex User",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp
                        )
                        Text(
                            text = "See your profile",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 13.sp
                        )
                    }

                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Shortcuts Grid
            Text("All shortcuts", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(10.dp))

            val shortcuts = listOf(
                ShortcutItem("Groups", Icons.Default.Group, ZunexPrimaryBlue, onGroupsClick),
                ShortcutItem("Friends", Icons.Default.People, Color(0xFF1E88E5), onFriendsClick),
                ShortcutItem("Saved", Icons.Default.Bookmark, Color(0xFFAB47BC), onSavedPostsClick),
                ShortcutItem("Professional Hub", Icons.Default.Dashboard, ZunexAccentGold, onProfessionalDashboardClick),
                ShortcutItem("Lock Profile", Icons.Default.Shield, Color(0xFF00897B), onLockProfileClick),
                ShortcutItem("Activity Log", Icons.Default.History, Color(0xFF5E35B1), onActivityLogClick)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                userScrollEnabled = false
            ) {
                items(shortcuts) { item ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(75.dp)
                            .clickable { item.onClick() },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .background(item.iconTint.copy(alpha = 0.12f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(item.icon, contentDescription = null, tint = item.iconTint, modifier = Modifier.size(22.dp))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(item.title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Settings & Privacy Expandable Row
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSettingsClick() },
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                ListItem(
                    headlineContent = { Text("Settings & Privacy", fontWeight = FontWeight.SemiBold) },
                    leadingContent = { Icon(Icons.Default.Settings, contentDescription = null, tint = ZunexPrimaryBlue) },
                    trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Help & Support Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onHelpClick() },
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                ListItem(
                    headlineContent = { Text("Help & Support", fontWeight = FontWeight.SemiBold) },
                    leadingContent = { Icon(Icons.AutoMirrored.Filled.Help, contentDescription = null, tint = Color(0xFFFB8C00)) },
                    trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Log Out Button
            Button(
                onClick = onLogoutClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .testTag("logout_button"),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Log Out", color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

data class ShortcutItem(
    val title: String,
    val icon: ImageVector,
    val iconTint: Color,
    val onClick: () -> Unit
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    currentUser: UserEntity?,
    onPersonalDetailsClick: () -> Unit,
    onPasswordSecurityClick: () -> Unit,
    onLockProfileClick: () -> Unit,
    onBlockingClick: () -> Unit,
    onPermissionsClick: () -> Unit,
    onActivityLogClick: () -> Unit,
    onHelpCenterClick: () -> Unit,
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings & Privacy", fontWeight = FontWeight.Bold) },
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // 1. Meta / Zunex Accounts Center Card (from screenshots)
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Shield, contentDescription = null, tint = ZunexPrimaryBlue, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Zunex Accounts Center", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = ZunexPrimaryBlue)
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "Manage your connected experiences and account settings across Zunex technologies.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 16.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))
                    HorizontalDivider()

                    ListItem(
                        headlineContent = { Text("Personal details", fontWeight = FontWeight.SemiBold, fontSize = 14.sp) },
                        leadingContent = { Icon(Icons.Default.Person, contentDescription = null, tint = ZunexPrimaryBlue) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onPersonalDetailsClick() }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Password and security", fontWeight = FontWeight.SemiBold, fontSize = 14.sp) },
                        leadingContent = { Icon(Icons.Default.Security, contentDescription = null, tint = ZunexPrimaryBlue) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onPasswordSecurityClick() }
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 2. Audience and Visibility
            Text("Audience and visibility", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text("Control who can see what you share on Zunex.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(10.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Profile locking", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text(if (currentUser?.isLocked == true) "Locked (Friends only)" else "Unlocked") },
                        leadingContent = { Icon(Icons.Default.Shield, contentDescription = null) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onLockProfileClick() }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Blocking", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Review people you previously blocked") },
                        leadingContent = { Icon(Icons.Default.Block, contentDescription = null) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onBlockingClick() }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Device permissions", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Camera, Photos, Location, Microphone") },
                        leadingContent = { Icon(Icons.Default.PermMedia, contentDescription = null) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onPermissionsClick() }
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 3. Your Information
            Text("Your information", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(8.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Activity log", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("View and manage your activity history") },
                        leadingContent = { Icon(Icons.Default.History, contentDescription = null) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onActivityLogClick() }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Help Center & Policies", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Terms, safety and privacy guidelines") },
                        leadingContent = { Icon(Icons.Default.Policy, contentDescription = null) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) },
                        modifier = Modifier.clickable { onHelpCenterClick() }
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsPersonalDetailsScreen(
    currentUser: UserEntity?,
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Personal Details", fontWeight = FontWeight.Bold) },
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text("Accounts Center uses this information to verify your identity and keep our community safe.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Contact Info", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text(currentUser?.email ?: "user@example.com") },
                        leadingContent = { Icon(Icons.Default.Email, contentDescription = null) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Phone Number", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text(currentUser?.phone?.ifBlank { "+92 300 1234567" } ?: "+92 300 1234567") },
                        leadingContent = { Icon(Icons.Default.Place, contentDescription = null) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Birthday", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text(currentUser?.dob?.ifBlank { "5 July 1998" } ?: "5 July 1998") },
                        leadingContent = { Icon(Icons.Default.Person, contentDescription = null) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Identity confirmation", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Confirmed ✓") },
                        leadingContent = { Icon(Icons.Default.CheckCircle, contentDescription = null, tint = ZunexPrimaryBlue) }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsPasswordSecurityScreen(
    currentUser: UserEntity?,
    onNavigateBack: () -> Unit
) {
    var twoFactorEnabled by remember { mutableStateOf(true) }
    var savedLoginEnabled by remember { mutableStateOf(true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Password & Security", fontWeight = FontWeight.Bold) },
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text("Login & Recovery", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(10.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Change Password", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Last changed 3 months ago") },
                        leadingContent = { Icon(Icons.Default.Key, contentDescription = null) },
                        trailingContent = { Icon(Icons.Default.ChevronRight, contentDescription = null) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Two-factor authentication", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("We'll ask for a login code if we notice an attempted login from an unrecognized device.") },
                        leadingContent = { Icon(Icons.Default.Security, contentDescription = null, tint = ZunexPrimaryBlue) },
                        trailingContent = {
                            Switch(checked = twoFactorEnabled, onCheckedChange = { twoFactorEnabled = it })
                        }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Saved login", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Remember your login info on this browser/app") },
                        leadingContent = { Icon(Icons.Default.CheckCircle, contentDescription = null) },
                        trailingContent = {
                            Switch(checked = savedLoginEnabled, onCheckedChange = { savedLoginEnabled = it })
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
            Text("Where You're Logged In", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(10.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                ListItem(
                    headlineContent = { Text("Android Device • Bangkok, Thailand", fontWeight = FontWeight.SemiBold) },
                    supportingContent = { Text("Active now • Zunex App") },
                    leadingContent = { Icon(Icons.Default.Place, contentDescription = null, tint = Color(0xFF2E7D32)) }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsBlockingScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onNavigateBack: () -> Unit
) {
    val blockedUsers by userRepository.getBlockedUsers(currentUser?.id ?: "").collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Blocking", fontWeight = FontWeight.Bold) },
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
                .padding(16.dp)
        ) {
            Text(
                "Once you block someone, that person can no longer see things you post on your timeline, tag you, invite you to groups, or start a conversation with you.",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            if (blockedUsers.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("You haven't blocked anyone.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(blockedUsers, key = { it.id }) { user ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AsyncImage(
                                    model = user.blockedUserAvatar.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                    contentDescription = null,
                                    modifier = Modifier
                                        .size(44.dp)
                                        .clip(CircleShape)
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(user.blockedUserName, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                                OutlinedButton(
                                    onClick = {
                                        if (currentUser != null) {
                                            coroutineScope.launch {
                                                userRepository.unblockUser(currentUser.id, user.blockedUserId)
                                            }
                                        }
                                    }
                                ) {
                                    Text("Unblock")
                                }
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
fun SettingsPermissionsScreen(
    onNavigateBack: () -> Unit
) {
    var cameraAllowed by remember { mutableStateOf(true) }
    var photoAllowed by remember { mutableStateOf(true) }
    var locationAllowed by remember { mutableStateOf(true) }
    var micAllowed by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Device Permissions", fontWeight = FontWeight.Bold) },
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text("Control how Zunex accesses hardware and capabilities on your device.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Photos and Videos", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Used for attaching images from your device gallery to posts and profile") },
                        leadingContent = { Icon(Icons.Default.PermMedia, contentDescription = null, tint = ZunexPrimaryBlue) },
                        trailingContent = {
                            Switch(checked = photoAllowed, onCheckedChange = { photoAllowed = it })
                        }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Camera", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Used to capture new photos and stories") },
                        leadingContent = { Icon(Icons.Default.PhotoCamera, contentDescription = null, tint = ZunexPrimaryBlue) },
                        trailingContent = {
                            Switch(checked = cameraAllowed, onCheckedChange = { cameraAllowed = it })
                        }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Location", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Used for tagging cities and finding local group posts") },
                        leadingContent = { Icon(Icons.Default.Place, contentDescription = null, tint = ZunexPrimaryBlue) },
                        trailingContent = {
                            Switch(checked = locationAllowed, onCheckedChange = { locationAllowed = it })
                        }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Microphone", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Used for voice input") },
                        leadingContent = { Icon(Icons.Default.Mic, contentDescription = null, tint = ZunexPrimaryBlue) },
                        trailingContent = {
                            Switch(checked = micAllowed, onCheckedChange = { micAllowed = it })
                        }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(
    currentUser: UserEntity?,
    interactionRepository: InteractionRepository,
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onGroupClick: (String) -> Unit,
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
                        Icon(Icons.Default.DoneAll, contentDescription = "Mark all read")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (notifications.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No notifications yet.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                items(notifications, key = { it.id }) { notif ->
                    Surface(
                        color = if (notif.isRead) MaterialTheme.colorScheme.surface else ZunexPrimaryBlue.copy(alpha = 0.08f),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                coroutineScope.launch {
                                    interactionRepository.markAsRead(notif.id)
                                }
                                if (notif.targetType == "post" && notif.targetId.isNotBlank()) {
                                    onPostClick(notif.targetId)
                                } else if (notif.targetType == "group" && notif.targetId.isNotBlank()) {
                                    onGroupClick(notif.targetId)
                                } else if (notif.targetId.isNotBlank()) {
                                    onAuthorClick(notif.targetId)
                                }
                            }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box {
                                AsyncImage(
                                    model = notif.actorAvatar.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                    contentDescription = null,
                                    modifier = Modifier
                                        .size(52.dp)
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.surfaceVariant)
                                )

                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomEnd)
                                        .size(20.dp)
                                        .clip(CircleShape)
                                        .background(
                                            when (notif.type) {
                                                "like" -> ReactionLikeBlue
                                                "comment" -> Color(0xFF4CAF50)
                                                "friend_request" -> ZunexPrimaryBlue
                                                else -> ZunexAccentGold
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
                                        tint = Color.White,
                                        modifier = Modifier.size(12.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = if (notif.message.isNotBlank()) notif.message else notif.title,
                                    fontSize = 14.sp,
                                    fontWeight = if (!notif.isRead) FontWeight.Bold else FontWeight.Normal
                                )
                                Spacer(modifier = Modifier.height(3.dp))
                                Text(
                                    text = formatTimeAgo(notif.createdAt),
                                    fontSize = 12.sp,
                                    color = if (!notif.isRead) ZunexPrimaryBlue else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            if (!notif.isRead) {
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .background(ZunexPrimaryBlue, CircleShape)
                                )
                            }
                        }
                    }
                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.1f))
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    userRepository: UserRepository,
    postRepository: PostRepository,
    groupRepository: GroupRepository,
    onAuthorClick: (String) -> Unit,
    onGroupClick: (String) -> Unit,
    onPostClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    var query by remember { mutableStateOf("") }
    val allUsers by userRepository.allUsers.collectAsStateWithLifecycle(initialValue = emptyList())
    val allGroups by groupRepository.allGroups.collectAsStateWithLifecycle(initialValue = emptyList())
    val allPosts by postRepository.feedPosts.collectAsStateWithLifecycle(initialValue = emptyList())

    val filteredUsers = if (query.isBlank()) emptyList() else allUsers.filter { it.name.contains(query, ignoreCase = true) }
    val filteredGroups = if (query.isBlank()) emptyList() else allGroups.filter { it.name.contains(query, ignoreCase = true) }
    val filteredPosts = if (query.isBlank()) emptyList() else allPosts.filter { it.content.contains(query, ignoreCase = true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    OutlinedTextField(
                        value = query,
                        onValueChange = { query = it },
                        placeholder = { Text("Search Zunex...") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(24.dp),
                        singleLine = true
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (query.isBlank()) {
                item {
                    Text("Search for people, groups, and posts across Zunex.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            } else {
                if (filteredUsers.isNotEmpty()) {
                    item {
                        Text("People", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    items(filteredUsers, key = { it.id }) { user ->
                        ListItem(
                            headlineContent = { Text(user.name, fontWeight = FontWeight.Bold) },
                            supportingContent = { Text(user.bio.ifBlank { "Zunex User" }, maxLines = 1) },
                            leadingContent = {
                                AsyncImage(
                                    model = user.avatarUrl,
                                    contentDescription = null,
                                    modifier = Modifier.size(40.dp).clip(CircleShape)
                                )
                            },
                            modifier = Modifier.clickable { onAuthorClick(user.id) }
                        )
                    }
                }

                if (filteredGroups.isNotEmpty()) {
                    item {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Groups", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    items(filteredGroups, key = { it.id }) { group ->
                        ListItem(
                            headlineContent = { Text(group.name, fontWeight = FontWeight.Bold) },
                            supportingContent = { Text("${group.membersCount} members · ${group.privacy}") },
                            leadingContent = {
                                AsyncImage(
                                    model = group.coverPhotoUrl,
                                    contentDescription = null,
                                    modifier = Modifier.size(40.dp).clip(RoundedCornerShape(8.dp))
                                )
                            },
                            modifier = Modifier.clickable { onGroupClick(group.id) }
                        )
                    }
                }

                if (filteredPosts.isNotEmpty()) {
                    item {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Posts", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    items(filteredPosts, key = { it.id }) { post ->
                        ListItem(
                            headlineContent = { Text(post.authorName, fontWeight = FontWeight.Bold) },
                            supportingContent = { Text(post.content, maxLines = 2) },
                            modifier = Modifier.clickable { onPostClick(post.id) }
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavedPostsScreen(
    currentUser: UserEntity?,
    postRepository: PostRepository,
    onPostClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val savedPosts by postRepository.getSavedPosts(currentUser?.id ?: "").collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Saved Items", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (savedPosts.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No saved posts yet.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(savedPosts, key = { it.id }) { post ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onPostClick(post.id) },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text(post.authorName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(post.content, fontSize = 14.sp, maxLines = 3)
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActivityLogScreen(
    currentUser: UserEntity?,
    postRepository: PostRepository,
    onNavigateBack: () -> Unit
) {
    val posts by postRepository.getUserPosts(currentUser?.id ?: "").collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Activity Log", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            item {
                Text("Your Posts & Interactions", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            items(posts, key = { it.id }) { post ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.History, contentDescription = null, tint = ZunexPrimaryBlue)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text("You published a post", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text(post.content, maxLines = 1, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HelpAndSupportScreen(
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
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Help Center", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Find answers to frequently asked questions") },
                        leadingContent = { Icon(Icons.AutoMirrored.Filled.Help, contentDescription = null, tint = ZunexPrimaryBlue) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Report a Problem", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Let us know if something isn't working") },
                        leadingContent = { Icon(Icons.Default.Email, contentDescription = null, tint = Color(0xFFE53935)) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Terms & Policies", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Community standards and terms of service") },
                        leadingContent = { Icon(Icons.Default.Policy, contentDescription = null, tint = Color(0xFF2E7D32)) }
                    )
                }
            }
        }
    }
}
