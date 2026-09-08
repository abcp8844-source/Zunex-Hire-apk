package com.example.ui.screens.profile

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Cake
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.EmojiEmotions
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Flight
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.PersonRemove
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Stars
import androidx.compose.material.icons.filled.Visibility
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
import com.example.data.repository.PostRepository
import com.example.data.repository.UserRepository
import com.example.ui.components.MediaPickerBottomSheet
import com.example.ui.components.POPULAR_PRESET_IMAGES
import com.example.ui.components.PostCard
import com.example.ui.theme.ZunexAccentGold
import com.example.ui.theme.ZunexPrimaryBlue
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ProfileScreen(
    userId: String,
    currentUser: UserEntity?,
    userRepository: UserRepository,
    postRepository: PostRepository,
    onEditProfileClick: () -> Unit,
    onLockProfileClick: () -> Unit,
    onProfessionalDashboardClick: () -> Unit,
    onCreateStoryClick: () -> Unit,
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
    var showAvatarPicker by remember { mutableStateOf(false) }
    var showCoverPicker by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()
    val isMyProfile = currentUser?.id == userId
    val displayUser = targetUser ?: (if (isMyProfile) currentUser else null)

    // Direct Gallery & Preset Pickers for Avatar and Cover Photo
    if (showAvatarPicker && displayUser != null) {
        MediaPickerBottomSheet(
            title = "Update Profile Picture",
            presets = POPULAR_PRESET_IMAGES,
            onPhotoSelected = { url ->
                coroutineScope.launch {
                    userRepository.updateProfile(displayUser.copy(avatarUrl = url))
                }
                showAvatarPicker = false
            },
            onDismiss = { showAvatarPicker = false }
        )
    }

    if (showCoverPicker && displayUser != null) {
        MediaPickerBottomSheet(
            title = "Update Cover Photo",
            presets = POPULAR_PRESET_IMAGES,
            onPhotoSelected = { url ->
                coroutineScope.launch {
                    userRepository.updateProfile(displayUser.copy(coverPhotoUrl = url))
                }
                showCoverPicker = false
            },
            onDismiss = { showCoverPicker = false }
        )
    }

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
                            if (isMyProfile) {
                                DropdownMenuItem(
                                    text = { Text("Lock Profile") },
                                    leadingIcon = { Icon(Icons.Default.Shield, contentDescription = null) },
                                    onClick = {
                                        showMoreMenu = false
                                        onLockProfileClick()
                                    }
                                )
                                DropdownMenuItem(
                                    text = { Text("Professional Dashboard") },
                                    leadingIcon = { Icon(Icons.Default.Dashboard, contentDescription = null) },
                                    onClick = {
                                        showMoreMenu = false
                                        onProfessionalDashboardClick()
                                    }
                                )
                            } else if (displayUser != null && currentUser != null) {
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
                // 1. Profile Header Card (Cover Photo, Profile Picture, Badges, Bio, Buttons)
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
                                    .height(200.dp)
                            ) {
                                AsyncImage(
                                    model = displayUser.coverPhotoUrl.ifBlank { "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80" },
                                    contentDescription = "Cover Photo",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )

                                if (isMyProfile) {
                                    // Camera button to change cover photo from gallery
                                    IconButton(
                                        onClick = { showCoverPicker = true },
                                        modifier = Modifier
                                            .align(Alignment.BottomEnd)
                                            .padding(12.dp)
                                            .size(36.dp)
                                            .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                                            .testTag("edit_cover_photo_btn")
                                    ) {
                                        Icon(Icons.Default.CameraAlt, contentDescription = "Edit Cover", tint = Color.White, modifier = Modifier.size(18.dp))
                                    }
                                }

                                // Profile Picture overlay
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomStart)
                                        .padding(start = 16.dp)
                                        .offset(y = 44.dp)
                                ) {
                                    AsyncImage(
                                        model = displayUser.avatarUrl.ifBlank { "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                                        contentDescription = "Profile Picture",
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier
                                            .size(120.dp)
                                            .clip(CircleShape)
                                            .border(4.dp, MaterialTheme.colorScheme.surface, CircleShape)
                                    )

                                    if (isMyProfile) {
                                        // Camera button on avatar to pick from gallery
                                        IconButton(
                                            onClick = { showAvatarPicker = true },
                                            modifier = Modifier
                                                .align(Alignment.BottomEnd)
                                                .size(36.dp)
                                                .background(MaterialTheme.colorScheme.surfaceVariant, CircleShape)
                                                .border(2.dp, MaterialTheme.colorScheme.surface, CircleShape)
                                                .testTag("edit_avatar_photo_btn")
                                        ) {
                                            Icon(Icons.Default.CameraAlt, contentDescription = "Edit Avatar", modifier = Modifier.size(18.dp))
                                        }
                                    }
                                }

                                // "Current Vibe" Speech Bubble next to avatar
                                if (displayUser.currentVibe.isNotBlank()) {
                                    Box(
                                        modifier = Modifier
                                            .align(Alignment.BottomEnd)
                                            .offset(y = 35.dp)
                                            .padding(end = 16.dp)
                                            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(16.dp))
                                            .padding(horizontal = 12.dp, vertical = 6.dp)
                                    ) {
                                        Text(
                                            text = displayUser.currentVibe,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(52.dp))

                            // Name, Verified Badge & Bio
                            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text(
                                        text = displayUser.name,
                                        fontSize = 24.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )

                                    if (displayUser.isVerified) {
                                        Icon(
                                            imageVector = Icons.Default.CheckCircle,
                                            contentDescription = "Verified Badge",
                                            tint = ZunexPrimaryBlue,
                                            modifier = Modifier.size(22.dp)
                                        )
                                    }
                                }

                                if (displayUser.bio.isNotBlank()) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = displayUser.bio,
                                        fontSize = 14.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        lineHeight = 18.sp
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                // Friends count indicator
                                Text(
                                    text = "${userFriends.size} friends",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.clickable { onFriendsListClick(userId) }
                                )

                                Spacer(modifier = Modifier.height(14.dp))

                                // Facebook Action Buttons Row
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    if (isMyProfile) {
                                        Button(
                                            onClick = onCreateStoryClick,
                                            colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.weight(1.3f)
                                        ) {
                                            Icon(Icons.Default.Add, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Add to story", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        }

                                        Button(
                                            onClick = onEditProfileClick,
                                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.weight(1.1f).testTag("edit_profile_btn")
                                        ) {
                                            Icon(Icons.Default.Edit, contentDescription = null, tint = MaterialTheme.colorScheme.onSurface, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Edit profile", color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        }

                                        IconButton(
                                            onClick = { showMoreMenu = true },
                                            modifier = Modifier
                                                .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                                .size(40.dp)
                                        ) {
                                            Icon(Icons.Default.MoreHoriz, contentDescription = "More")
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

                            // Profile Lock Badge Card (If Profile is locked)
                            if (displayUser.isLocked) {
                                Spacer(modifier = Modifier.height(14.dp))
                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp),
                                    colors = CardDefaults.cardColors(containerColor = ZunexPrimaryBlue.copy(alpha = 0.08f)),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(Icons.Default.Shield, contentDescription = null, tint = ZunexPrimaryBlue, modifier = Modifier.size(24.dp))
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Column {
                                            Text("You locked your profile", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                            Text("Only your friends can see your full photos and timeline.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }
                                    }
                                }
                            }

                            // Professional Mode Dashboard Card
                            if (isMyProfile && displayUser.isProfessionalMode) {
                                Spacer(modifier = Modifier.height(10.dp))
                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp)
                                        .clickable { onProfessionalDashboardClick() },
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.7f)),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(14.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(Icons.Default.Dashboard, contentDescription = null, tint = ZunexAccentGold, modifier = Modifier.size(24.dp))
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text("Professional dashboard", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                            Text("Insights, tools and audience monetization", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }
                                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, modifier = Modifier.offset(x = 4.dp))
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

                // 2. Facebook Profile Details Section Card
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        shape = RoundedCornerShape(0.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Details", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Spacer(modifier = Modifier.height(12.dp))

                            // Work
                            if (displayUser.work.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.Work, text = displayUser.work)
                            }
                            // Education
                            if (displayUser.education.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.School, text = "Studied at ${displayUser.education}")
                            }
                            // Lives in
                            if (displayUser.livesIn.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.Home, text = "Lives in ${displayUser.livesIn}")
                            }
                            // From
                            if (displayUser.fromCity.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.LocationOn, text = "From ${displayUser.fromCity}")
                            }
                            // Relationship
                            if (displayUser.relationshipStatus.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.Favorite, text = displayUser.relationshipStatus)
                            }
                            // Phone
                            if (displayUser.phone.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.Phone, text = displayUser.phone)
                            }
                            // Sports / Interests (from screenshot)
                            if (displayUser.interests.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.Stars, text = displayUser.interests)
                            }
                            // Links
                            if (displayUser.links.isNotBlank()) {
                                DetailRowItem(icon = Icons.Default.Link, text = displayUser.links)
                            }

                            // Hobbies Tags
                            if (displayUser.hobbies.isNotBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Hobbies", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                Spacer(modifier = Modifier.height(6.dp))
                                FlowRow(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    displayUser.hobbies.split(",").forEach { hobby ->
                                        Surface(
                                            shape = RoundedCornerShape(16.dp),
                                            color = MaterialTheme.colorScheme.surfaceVariant
                                        ) {
                                            Text(
                                                text = hobby.trim(),
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Medium,
                                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                            )
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))
                            OutlinedButton(
                                onClick = { onAboutClick(userId) },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("See your About info", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                // 3. Profile Posts
                if (selectedTab == 0) {
                    if (userPosts.isEmpty()) {
                        item {
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                            ) {
                                Column(
                                    modifier = Modifier.padding(24.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text("No posts yet", fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text("Posts shared will appear here on the profile.", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                                }
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

@Composable
fun DetailRowItem(icon: ImageVector, text: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = text,
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onProfileSaved: () -> Unit,
    onNavigateBack: () -> Unit
) {
    var name by remember { mutableStateOf(currentUser?.name ?: "") }
    var bio by remember { mutableStateOf(currentUser?.bio ?: "") }
    var currentVibe by remember { mutableStateOf(currentUser?.currentVibe ?: "") }
    var avatarUrl by remember { mutableStateOf(currentUser?.avatarUrl ?: "") }
    var coverPhotoUrl by remember { mutableStateOf(currentUser?.coverPhotoUrl ?: "") }
    var work by remember { mutableStateOf(currentUser?.work ?: "") }
    var education by remember { mutableStateOf(currentUser?.education ?: "") }
    var livesIn by remember { mutableStateOf(currentUser?.livesIn ?: "") }
    var fromCity by remember { mutableStateOf(currentUser?.fromCity ?: "") }
    var relationshipStatus by remember { mutableStateOf(currentUser?.relationshipStatus ?: "Single") }
    var phone by remember { mutableStateOf(currentUser?.phone ?: "") }
    var dob by remember { mutableStateOf(currentUser?.dob ?: "5 July 1998") }
    var gender by remember { mutableStateOf(currentUser?.gender ?: "Male") }
    var languages by remember { mutableStateOf(currentUser?.languages ?: "English, Urdu") }
    var hobbies by remember { mutableStateOf(currentUser?.hobbies ?: "Coding, Travel, Photography") }
    var interests by remember { mutableStateOf(currentUser?.interests ?: "") }
    var links by remember { mutableStateOf(currentUser?.links ?: "") }
    var socialLinks by remember { mutableStateOf(currentUser?.socialLinks ?: "") }

    var showAvatarPicker by remember { mutableStateOf(false) }
    var showCoverPicker by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    if (showAvatarPicker) {
        MediaPickerBottomSheet(
            title = "Choose Profile Picture",
            presets = POPULAR_PRESET_IMAGES,
            onPhotoSelected = { url ->
                avatarUrl = url
                showAvatarPicker = false
            },
            onDismiss = { showAvatarPicker = false }
        )
    }

    if (showCoverPicker) {
        MediaPickerBottomSheet(
            title = "Choose Cover Photo",
            presets = POPULAR_PRESET_IMAGES,
            onPhotoSelected = { url ->
                coverPhotoUrl = url
                showCoverPicker = false
            },
            onDismiss = { showCoverPicker = false }
        )
    }

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
                            if (currentUser != null) {
                                coroutineScope.launch {
                                    userRepository.updateProfile(
                                        currentUser.copy(
                                            name = name,
                                            bio = bio,
                                            currentVibe = currentVibe,
                                            avatarUrl = avatarUrl,
                                            coverPhotoUrl = coverPhotoUrl,
                                            work = work,
                                            education = education,
                                            livesIn = livesIn,
                                            fromCity = fromCity,
                                            relationshipStatus = relationshipStatus,
                                            phone = phone,
                                            dob = dob,
                                            gender = gender,
                                            languages = languages,
                                            hobbies = hobbies,
                                            interests = interests,
                                            links = links,
                                            socialLinks = socialLinks
                                        )
                                    )
                                    onProfileSaved()
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                        modifier = Modifier.testTag("save_profile_btn")
                    ) {
                        Text("Save")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
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
            // Profile Picture
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Profile picture", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                TextButton(onClick = { showAvatarPicker = true }) {
                    Text("Edit / Gallery", color = ZunexPrimaryBlue, fontWeight = FontWeight.Bold)
                }
            }
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .clickable { showAvatarPicker = true }
                    .align(Alignment.CenterHorizontally)
            ) {
                AsyncImage(
                    model = avatarUrl.ifBlank { "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(12.dp))

            // Cover Photo
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Cover photo", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                TextButton(onClick = { showCoverPicker = true }) {
                    Text("Edit / Gallery", color = ZunexPrimaryBlue, fontWeight = FontWeight.Bold)
                }
            }
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { showCoverPicker = true }
            ) {
                AsyncImage(
                    model = coverPhotoUrl.ifBlank { "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80" },
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(12.dp))

            // Text Fields
            Text("Personal Details", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Full Name") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = currentVibe,
                onValueChange = { currentVibe = it },
                label = { Text("Current Vibe / Status") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = bio,
                onValueChange = { bio = it },
                label = { Text("Bio") },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 3
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = work,
                onValueChange = { work = it },
                label = { Text("Work / Workplace") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = education,
                onValueChange = { education = it },
                label = { Text("Education / University") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = livesIn,
                onValueChange = { livesIn = it },
                label = { Text("Current City / Town") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = fromCity,
                onValueChange = { fromCity = it },
                label = { Text("Hometown") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it },
                label = { Text("Phone Number") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = relationshipStatus,
                onValueChange = { relationshipStatus = it },
                label = { Text("Relationship Status") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = hobbies,
                onValueChange = { hobbies = it },
                label = { Text("Hobbies (comma separated)") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = interests,
                onValueChange = { interests = it },
                label = { Text("Sports Teams & Athletes") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = links,
                onValueChange = { links = it },
                label = { Text("Websites / Portfolio Links") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = socialLinks,
                onValueChange = { socialLinks = it },
                label = { Text("Social Links (Instagram/Twitter)") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LockProfileScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onNavigateBack: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    val isLocked = currentUser?.isLocked == true

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Lock Your Profile", fontWeight = FontWeight.Bold) },
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
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .background(ZunexPrimaryBlue.copy(alpha = 0.1f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Shield, contentDescription = null, tint = ZunexPrimaryBlue, modifier = Modifier.size(50.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = if (isLocked) "Your Profile Is Locked" else "Make Your Photos and Posts More Private",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Locking your profile makes your photos, posts and stories visible only to people who are your confirmed friends on Zunex.",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(28.dp))

            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                LockBenefitRow(
                    icon = Icons.Default.Visibility,
                    title = "Only friends will see photos and posts",
                    subtitle = "People you aren't friends with won't see your timeline content."
                )
                LockBenefitRow(
                    icon = Icons.Default.CameraAlt,
                    title = "Only friends see full-size profile and cover photo",
                    subtitle = "Strangers can only see a small thumbnail."
                )
                LockBenefitRow(
                    icon = Icons.Default.PersonAdd,
                    title = "People can still find and friend you",
                    subtitle = "Your name and search results remain discoverable."
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = {
                    if (currentUser != null) {
                        coroutineScope.launch {
                            userRepository.updateProfile(currentUser.copy(isLocked = !isLocked))
                            onNavigateBack()
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isLocked) MaterialTheme.colorScheme.surfaceVariant else ZunexPrimaryBlue
                ),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(
                    text = if (isLocked) "Unlock Your Profile" else "Lock Your Profile",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = if (isLocked) MaterialTheme.colorScheme.onSurface else Color.White
                )
            }
        }
    }
}

@Composable
fun LockBenefitRow(icon: ImageVector, title: String, subtitle: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = ZunexPrimaryBlue, modifier = Modifier.size(24.dp))
        Spacer(modifier = Modifier.width(14.dp))
        Column {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text(subtitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 16.sp)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfessionalDashboardScreen(
    currentUser: UserEntity?,
    onNavigateBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Professional Dashboard", fontWeight = FontWeight.Bold) },
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
            Text("Insights Overview (Last 28 days)", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(10.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                DashboardMetricCard(title = "Post Reach", value = "12.4K", growth = "+14.2%", modifier = Modifier.weight(1f))
                DashboardMetricCard(title = "Engagement", value = "3,180", growth = "+28.5%", modifier = Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                DashboardMetricCard(title = "Net Followers", value = "1,450", growth = "+8.1%", modifier = Modifier.weight(1f))
                DashboardMetricCard(title = "Content Published", value = "24", growth = "+5", modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(24.dp))
            Text("Your Tools & Growth", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(10.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column {
                    ListItem(
                        headlineContent = { Text("Monetization & Badges", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Eligible for stars and creator support") },
                        leadingContent = { Icon(Icons.Default.Stars, contentDescription = null, tint = ZunexAccentGold) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Fan Engagement Hub", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Top fans badges and comments priority") },
                        leadingContent = { Icon(Icons.Default.Favorite, contentDescription = null, tint = Color(0xFFE91E63)) }
                    )
                    HorizontalDivider()
                    ListItem(
                        headlineContent = { Text("Ad Center", fontWeight = FontWeight.SemiBold) },
                        supportingContent = { Text("Boost posts to reach more people") },
                        leadingContent = { Icon(Icons.Default.Public, contentDescription = null, tint = ZunexPrimaryBlue) }
                    )
                }
            }
        }
    }
}

@Composable
fun DashboardMetricCard(title: String, value: String, growth: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(growth, fontSize = 12.sp, color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FriendsListScreen(
    userId: String,
    userRepository: UserRepository,
    onAuthorClick: (String) -> Unit,
    onFindFriendsClick: () -> Unit,
    onNavigateBack: () -> Unit
) {
    val friends by userRepository.getFriendsForUser(userId).collectAsStateWithLifecycle(initialValue = emptyList())
    var searchQuery by remember { mutableStateOf("") }

    val filteredFriends = friends.filter { it.friendName.contains(searchQuery, ignoreCase = true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Friends (${friends.size})", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onFindFriendsClick) {
                        Icon(Icons.Default.PersonAdd, contentDescription = "Find Friends")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search friends...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 14.dp, vertical = 8.dp),
                shape = RoundedCornerShape(24.dp)
            )

            if (filteredFriends.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No friends found.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(12.dp)
                ) {
                    items(filteredFriends, key = { it.id }) { friend ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onAuthorClick(friend.userId2) },
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AsyncImage(
                                    model = friend.friendAvatar.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                    contentDescription = null,
                                    modifier = Modifier
                                        .size(50.dp)
                                        .clip(CircleShape)
                                )
                                Spacer(modifier = Modifier.width(14.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(friend.friendName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    if (friend.mutualFriendsCount > 0) {
                                        Text("${friend.mutualFriendsCount} mutual friends", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
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
fun FindFriendsScreen(
    currentUser: UserEntity?,
    userRepository: UserRepository,
    onAuthorClick: (String) -> Unit,
    onFriendRequestsClick: () -> Unit,
    onNavigateBack: () -> Unit
) {
    val suggestions by userRepository.getSuggestedFriends().collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Find Friends", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    TextButton(onClick = onFriendRequestsClick) {
                        Text("Requests", fontWeight = FontWeight.Bold)
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
                Text("People You May Know", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            }

            items(suggestions, key = { it.id }) { user ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onAuthorClick(user.id) },
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
                                .size(56.dp)
                                .clip(CircleShape)
                        )
                        Spacer(modifier = Modifier.width(14.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(user.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            if (user.bio.isNotBlank()) {
                                Text(user.bio, maxLines = 1, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Button(
                                onClick = {
                                    if (currentUser != null) {
                                        coroutineScope.launch {
                                            userRepository.sendFriendRequest(currentUser, user)
                                        }
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("Add Friend", fontSize = 12.sp, fontWeight = FontWeight.Bold)
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
    val pendingRequests by userRepository.getPendingFriendRequests(currentUser?.id ?: "").collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Friend Requests (${pendingRequests.size})", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (pendingRequests.isEmpty()) {
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
                items(pendingRequests, key = { it.id }) { req ->
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
                                    .size(54.dp)
                                    .clip(CircleShape)
                            )
                            Spacer(modifier = Modifier.width(14.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(req.senderName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                if (req.mutualFriendsCount > 0) {
                                    Text("${req.mutualFriendsCount} mutual friends", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Button(
                                        onClick = {
                                            if (currentUser != null) {
                                                coroutineScope.launch {
                                                    userRepository.acceptFriendRequest(req, currentUser)
                                                }
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue)
                                    ) {
                                        Text("Confirm")
                                    }
                                    OutlinedButton(
                                        onClick = {
                                            coroutineScope.launch {
                                                userRepository.rejectFriendRequest(req.id)
                                            }
                                        }
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
                title = { Text("About ${user?.name ?: ""}", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        val u = user
        if (u == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Loading details...")
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                Text("Overview", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(modifier = Modifier.height(10.dp))
                DetailRowItem(icon = Icons.Default.Work, text = "Work: ${u.work}")
                DetailRowItem(icon = Icons.Default.School, text = "Education: ${u.education}")
                DetailRowItem(icon = Icons.Default.Home, text = "Lives in: ${u.livesIn}")
                DetailRowItem(icon = Icons.Default.LocationOn, text = "From: ${u.fromCity}")
                DetailRowItem(icon = Icons.Default.Favorite, text = "Relationship: ${u.relationshipStatus}")

                Spacer(modifier = Modifier.height(20.dp))
                HorizontalDivider()
                Spacer(modifier = Modifier.height(16.dp))

                Text("Basic & Contact Info", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(modifier = Modifier.height(10.dp))
                DetailRowItem(icon = Icons.Default.Phone, text = "Phone: ${u.phone}")
                DetailRowItem(icon = Icons.Default.Cake, text = "Date of Birth: ${u.dob}")
                DetailRowItem(icon = Icons.Default.Person, text = "Gender: ${u.gender}")
                DetailRowItem(icon = Icons.Default.Language, text = "Languages: ${u.languages}")
                DetailRowItem(icon = Icons.Default.Link, text = "Links: ${u.links}")
                DetailRowItem(icon = Icons.Default.Stars, text = "Socials: ${u.socialLinks}")
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
                items(photos) { photoUrl ->
                    AsyncImage(
                        model = photoUrl,
                        contentDescription = "Photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .height(120.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .clickable { onPhotoClick(photoUrl) }
                    )
                }
            }
        }
    }
}
