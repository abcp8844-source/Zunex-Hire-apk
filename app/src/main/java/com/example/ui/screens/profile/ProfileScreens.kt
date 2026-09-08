package com.example.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
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
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.PersonRemove
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Work
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
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.example.data.model.UserEntity
import com.example.data.repository.PostRepository
import com.example.data.repository.UserRepository
import com.example.ui.components.PostCard
import com.example.ui.theme.FbBorder
import com.example.ui.theme.ZunexAccentGold
import com.example.ui.theme.ZunexPrimaryBlue
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    userId: String,
    currentUser: UserEntity?,
    userRepository: UserRepository,
    postRepository: PostRepository,
    onEditProfileClick: () -> Unit,
    onFriendsListClick: (String) -> Unit,
    onAboutClick: (String) -> Unit,
    onPhotosClick: (String) -> Unit,
    onPostClick: (String) -> Unit,
    onPhotoClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val targetUser by userRepository.getUserById(userId).collectAsStateWithLifecycle(initialValue = null)
    val userPosts by postRepository.getUserPosts(userId).collectAsStateWithLifecycle(initialValue = emptyList())
    val userFriends by userRepository.getFriendsForUser(userId).collectAsStateWithLifecycle(initialValue = emptyList())
    var selectedTab by remember { mutableIntStateOf(0) }
    var showMoreMenu by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()
    val isMyProfile = currentUser?.id == userId

    val displayUser = targetUser ?: (if (isMyProfile) currentUser else null)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(displayUser?.name ?: "Profile", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Box {
                        IconButton(onClick = { showMoreMenu = true }) {
                            Icon(Icons.Default.MoreHoriz, contentDescription = "More")
                        }
                        DropdownMenu(
                            expanded = showMoreMenu,
                            onDismissRequest = { showMoreMenu = false }
                        ) {
                            if (!isMyProfile && displayUser != null && currentUser != null) {
                                DropdownMenuItem(
                                    text = { Text("Block User", color = Color(0xFFE53935)) },
                                    leadingIcon = { Icon(Icons.Default.Block, contentDescription = null, tint = Color(0xFFE53935)) },
                                    onClick = {
                                        showMoreMenu = false
                                        coroutineScope.launch {
                                            userRepository.blockUser(currentUser.id, displayUser)
                                            onNavigateBack()
                                        }
                                    }
                                )
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        if (displayUser == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Loading profile...")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .testTag("profile_view"),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Profile Header Card (Cover Photo, Profile Picture, Bio, Stats)
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        shape = RoundedCornerShape(0.dp)
                    ) {
                        Column {
                            // Cover photo container
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(190.dp)
                            ) {
                                AsyncImage(
                                    model = displayUser.coverPhotoUrl.ifBlank { "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&q=80" },
                                    contentDescription = "Cover Photo",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )

                                // Profile Picture overlay
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomStart)
                                        .padding(start = 16.dp)
                                        .offset(y = 40.dp)
                                ) {
                                    AsyncImage(
                                        model = displayUser.avatarUrl.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                        contentDescription = "Profile Picture",
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier
                                            .size(110.dp)
                                            .clip(CircleShape)
                                            .border(4.dp, MaterialTheme.colorScheme.surface, CircleShape)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(48.dp))

                            // Name & Bio
                            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                                Text(
                                    text = displayUser.name,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )

                                if (displayUser.bio.isNotBlank()) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = displayUser.bio,
                                        fontSize = 14.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        lineHeight = 18.sp
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                // Friends count indicator
                                Text(
                                    text = "${userFriends.size} friends",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.clickable { onFriendsListClick(userId) }
                                )

                                Spacer(modifier = Modifier.height(14.dp))

                                // Action Buttons
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    if (isMyProfile) {
                                        Button(
                                            onClick = onEditProfileClick,
                                            modifier = Modifier.weight(1f),
                                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Icon(Icons.Default.Edit, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text("Edit Profile", color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Bold)
                                        }
                                    } else {
                                        Button(
                                            onClick = {
                                                if (currentUser != null) {
                                                    coroutineScope.launch {
                                                        userRepository.sendFriendRequest(currentUser, displayUser)
                                                    }
                                                }
                                            },
                                            modifier = Modifier.weight(1f),
                                            colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Icon(Icons.Default.PersonAdd, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text("Add Friend", color = Color.White, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            // Profile Tabs
                            ScrollableTabRow(
                                selectedTabIndex = selectedTab,
                                containerColor = MaterialTheme.colorScheme.surface,
                                edgePadding = 12.dp
                            ) {
                                Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("Posts", fontWeight = FontWeight.Bold) })
                                Tab(selected = selectedTab == 1, onClick = { onAboutClick(userId) }, text = { Text("About", fontWeight = FontWeight.Bold) })
                                Tab(selected = selectedTab == 2, onClick = { onFriendsListClick(userId) }, text = { Text("Friends", fontWeight = FontWeight.Bold) })
                                Tab(selected = selectedTab == 3, onClick = { onPhotosClick(userId) }, text = { Text("Photos", fontWeight = FontWeight.Bold) })
                            }
                        }
                    }
                }

                // Profile Posts
                if (selectedTab == 0) {
                    if (userPosts.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("No posts to show.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    } else {
                        items(userPosts, key = { it.id }) { post ->
                            PostCard(
                                post = post,
                                currentUserId = currentUser?.id ?: "",
                                onAuthorClick = onAuthorClick,
                                onPhotoClick = onPhotoClick,
                                onCommentClick = { onPostClick(post.id) },
                                onReactionToggle = { reaction ->
                                    coroutineScope.launch {
                                        postRepository.toggleReaction(post.id, reaction)
                                    }
                                },
                                onShareClick = {
                                    if (currentUser != null) {
                                        coroutineScope.launch {
                                            postRepository.sharePost(post, currentUser)
                                        }
                                    }
                                },
                                onEditClick = { },
                                onDeleteClick = {
                                    coroutineScope.launch {
                                        postRepository.deletePost(post.id)
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onNavigateBack: () -> Unit
) {
    var name by remember { mutableStateOf(currentUser?.name ?: "") }
    var bio by remember { mutableStateOf(currentUser?.bio ?: "") }
    var avatarUrl by remember { mutableStateOf(currentUser?.avatarUrl ?: "") }
    var coverPhotoUrl by remember { mutableStateOf(currentUser?.coverPhotoUrl ?: "") }
    var work by remember { mutableStateOf(currentUser?.work ?: "") }
    var education by remember { mutableStateOf(currentUser?.education ?: "") }
    var livesIn by remember { mutableStateOf(currentUser?.livesIn ?: "") }
    var relationship by remember { mutableStateOf(currentUser?.relationshipStatus ?: "Single") }

    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Profile", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            val user = currentUser ?: return@Button
                            coroutineScope.launch {
                                userRepository.updateProfile(
                                    user.copy(
                                        name = name,
                                        bio = bio,
                                        avatarUrl = avatarUrl,
                                        coverPhotoUrl = coverPhotoUrl,
                                        work = work,
                                        education = education,
                                        livesIn = livesIn,
                                        relationshipStatus = relationship
                                    )
                                )
                                onNavigateBack()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue)
                    ) {
                        Text("Save")
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
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Full Name") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = bio,
                onValueChange = { bio = it },
                label = { Text("Bio") },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 3
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = avatarUrl,
                onValueChange = { avatarUrl = it },
                label = { Text("Profile Avatar Image URL") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = coverPhotoUrl,
                onValueChange = { coverPhotoUrl = it },
                label = { Text("Cover Photo Image URL") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = work,
                onValueChange = { work = it },
                label = { Text("Work / Workplace") },
                leadingIcon = { Icon(Icons.Default.Work, contentDescription = null) },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = education,
                onValueChange = { education = it },
                label = { Text("Education / College") },
                leadingIcon = { Icon(Icons.Default.School, contentDescription = null) },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = livesIn,
                onValueChange = { livesIn = it },
                label = { Text("Current City / Town") },
                leadingIcon = { Icon(Icons.Default.Home, contentDescription = null) },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FriendsListScreen(
    userId: String,
    userRepository: UserRepository,
    onAuthorClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val friends by userRepository.getFriendsForUser(userId).collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Friends (${friends.size})", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (friends.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No friends to show.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(friends, key = { it.id }) { item ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onAuthorClick(item.userId2) },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AsyncImage(
                                model = item.friendAvatar.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                contentDescription = null,
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(CircleShape)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(item.friendName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                if (item.mutualFriendsCount > 0) {
                                    Text("${item.mutualFriendsCount} mutual friends", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
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
fun FindFriendsScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onFriendRequestsClick: () -> Unit,
    onAuthorClick: (String) -> Unit,
    onSearchClick: () -> Unit
) {
    val suggested by userRepository.getSuggestedFriends().collectAsStateWithLifecycle(initialValue = emptyList())
    val friendRequests by userRepository.getPendingFriendRequests(currentUser?.id ?: "").collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Friends", fontWeight = FontWeight.ExtraBold, fontSize = 22.sp) },
                actions = {
                    IconButton(onClick = onSearchClick) {
                        Icon(Icons.Default.Search, contentDescription = "Search Friends")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Friend Requests Shortcut Pill
            if (friendRequests.isNotEmpty()) {
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onFriendRequestsClick() },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.PersonAdd, contentDescription = null, tint = ZunexPrimaryBlue)
                                Spacer(modifier = Modifier.width(10.dp))
                                Text("Friend Requests", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            }
                            Text("${friendRequests.size}", color = Color(0xFFE53935), fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            item {
                Text(
                    text = "People You May Know",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
            }

            items(suggested, key = { it.id }) { user ->
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
                            model = user.avatarUrl.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                            contentDescription = null,
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .clickable { onAuthorClick(user.id) }
                        )

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = user.name,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                modifier = Modifier.clickable { onAuthorClick(user.id) }
                            )
                            if (user.bio.isNotBlank()) {
                                Text(
                                    text = user.bio,
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 1
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = {
                                        if (currentUser != null) {
                                            coroutineScope.launch {
                                                userRepository.sendFriendRequest(currentUser, user)
                                            }
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Add Friend")
                                }

                                OutlinedButton(
                                    onClick = { },
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Remove")
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
fun FriendRequestsScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onAuthorClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val requests by userRepository.getPendingFriendRequests(currentUser?.id ?: "").collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Friend Requests (${requests.size})", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (requests.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No pending friend requests.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(requests, key = { it.id }) { req ->
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
                                model = req.senderAvatar.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                contentDescription = null,
                                modifier = Modifier
                                    .size(60.dp)
                                    .clip(CircleShape)
                                    .clickable { onAuthorClick(req.senderId) }
                            )

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = req.senderName,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    modifier = Modifier.clickable { onAuthorClick(req.senderId) }
                                )
                                if (req.mutualFriendsCount > 0) {
                                    Text("${req.mutualFriendsCount} mutual friends", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Button(
                                        onClick = {
                                            if (currentUser != null) {
                                                coroutineScope.launch {
                                                    userRepository.acceptFriendRequest(req, currentUser)
                                                }
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("Confirm")
                                    }

                                    OutlinedButton(
                                        onClick = {
                                            coroutineScope.launch {
                                                userRepository.rejectFriendRequest(req.id)
                                            }
                                        },
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("Delete")
                                    }
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
fun UserAboutScreen(
    userId: String,
    userRepository: UserRepository,
    onNavigateBack: () -> Unit
) {
    val user by userRepository.getUserById(userId).collectAsStateWithLifecycle(initialValue = null)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("About", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        val currentUser = user
        if (currentUser == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Loading details...")
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Overview", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(10.dp))

                        if (currentUser.work.isNotBlank()) {
                            ListItem(
                                headlineContent = { Text(currentUser.work) },
                                leadingContent = { Icon(Icons.Default.Work, contentDescription = null, tint = ZunexPrimaryBlue) }
                            )
                        }

                        if (currentUser.education.isNotBlank()) {
                            ListItem(
                                headlineContent = { Text(currentUser.education) },
                                leadingContent = { Icon(Icons.Default.School, contentDescription = null, tint = ZunexPrimaryBlue) }
                            )
                        }

                        if (currentUser.livesIn.isNotBlank()) {
                            ListItem(
                                headlineContent = { Text("Lives in ${currentUser.livesIn}") },
                                leadingContent = { Icon(Icons.Default.Home, contentDescription = null, tint = ZunexPrimaryBlue) }
                            )
                        }

                        if (currentUser.fromCity.isNotBlank()) {
                            ListItem(
                                headlineContent = { Text("From ${currentUser.fromCity}") },
                                leadingContent = { Icon(Icons.Default.LocationOn, contentDescription = null, tint = ZunexPrimaryBlue) }
                            )
                        }

                        ListItem(
                            headlineContent = { Text(currentUser.relationshipStatus) },
                            leadingContent = { Icon(Icons.Default.Favorite, contentDescription = null, tint = Color(0xFFE53935)) }
                        )

                        ListItem(
                            headlineContent = { Text("Joined ${currentUser.joinedDate}") },
                            leadingContent = { Icon(Icons.Default.Person, contentDescription = null, tint = ZunexPrimaryBlue) }
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfilePhotosScreen(
    userId: String,
    postRepository: PostRepository,
    onPhotoClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val photos by postRepository.getUserPhotos(userId).collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Photos", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (photos.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No photos uploaded yet.")
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(photos) { url ->
                    AsyncImage(
                        model = url,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .height(120.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .clickable { onPhotoClick(url) }
                    )
                }
            }
        }
    }
}
