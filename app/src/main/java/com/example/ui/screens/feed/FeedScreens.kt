package com.example.ui.screens.feed

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ColorLens
import androidx.compose.material.icons.filled.EmojiEmotions
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Photo
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.example.data.model.CommentEntity
import com.example.data.model.PostEntity
import com.example.data.model.UserEntity
import com.example.data.repository.PostRepository
import com.example.ui.components.CommentItem
import com.example.ui.components.PostCard
import com.example.ui.components.ZunexHeader
import com.example.ui.components.ZunexLoader
import com.example.ui.theme.FbBackground
import com.example.ui.theme.FbBorder
import com.example.ui.theme.FbInputBg
import com.example.ui.theme.PostBgBlue
import com.example.ui.theme.PostBgDark
import com.example.ui.theme.PostBgOrange
import com.example.ui.theme.PostBgPurple
import com.example.ui.theme.PostBgRed
import com.example.ui.theme.PostBgTeal
import com.example.ui.theme.ZunexAccentGold
import com.example.ui.theme.ZunexPrimaryBlue
import kotlinx.coroutines.launch

@Composable
fun FeedScreen(
    currentUser: UserEntity?,
    postRepository: PostRepository,
    unreadNotificationsCount: Int,
    onCreatePostClick: () -> Unit,
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onGroupClick: (String) -> Unit,
    onPhotoClick: (String) -> Unit,
    onSearchClick: () -> Unit,
    onNotificationsClick: () -> Unit,
    onEditPostClick: (String) -> Unit
) {
    val posts by postRepository.feedPosts.collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            ZunexHeader(
                currentUser = currentUser,
                unreadNotificationsCount = unreadNotificationsCount,
                onSearchClick = onSearchClick,
                onProfileClick = { currentUser?.let { onAuthorClick(it.id) } },
                onNotificationsClick = onNotificationsClick
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .testTag("feed_list"),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // "What's on your mind?" Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(0.dp)
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AsyncImage(
                                model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                contentDescription = "Profile Avatar",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .clickable { currentUser?.let { onAuthorClick(it.id) } }
                            )

                            Spacer(modifier = Modifier.width(10.dp))

                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                                    .clickable { onCreatePostClick() }
                                    .padding(horizontal = 16.dp, vertical = 10.dp)
                                    .testTag("whats_on_your_mind_box")
                            ) {
                                Text(
                                    text = "What's on your mind, ${currentUser?.name?.split(" ")?.firstOrNull() ?: "there"}?",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 14.sp
                                )
                            }
                        }

                        HorizontalDivider(
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                            thickness = 0.8.dp,
                            modifier = Modifier.padding(horizontal = 14.dp)
                        )

                        // Quick Action Buttons (Photo, Feeling)
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .clickable { onCreatePostClick() }
                                    .padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.PhotoLibrary,
                                    contentDescription = "Photo",
                                    tint = Color(0xFF4CAF50),
                                    modifier = Modifier.size(20.dp)
                                )
                                Text(
                                    text = "Photo",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 13.sp
                                )
                            }

                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .clickable { onCreatePostClick() }
                                    .padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.EmojiEmotions,
                                    contentDescription = "Feeling/Activity",
                                    tint = Color(0xFFFFA000),
                                    modifier = Modifier.size(20.dp)
                                )
                                Text(
                                    text = "Feeling",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 13.sp
                                )
                            }
                        }
                    }
                }
            }

            // Posts Feed
            if (posts.isEmpty()) {
                item {
                    ZunexLoader(text = "Loading your feed...")
                }
            } else {
                items(posts, key = { it.id }) { post ->
                    PostCard(
                        post = post,
                        currentUserId = currentUser?.id ?: "",
                        onAuthorClick = onAuthorClick,
                        onGroupClick = onGroupClick,
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
                        onEditClick = { onEditPostClick(post.id) },
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreatePostScreen(
    currentUser: UserEntity?,
    postRepository: PostRepository,
    groupId: String? = null,
    groupName: String? = null,
    onPostCreated: () -> Unit,
    onNavigateBack: () -> Unit
) {
    var content by remember { mutableStateOf("") }
    var selectedPhotoUrl by remember { mutableStateOf<String?>(null) }
    var selectedColorBg by remember { mutableStateOf<String?>(null) }
    var privacy by remember { mutableStateOf("public") }
    var isPosting by remember { mutableStateOf(false) }
    var showPrivacyMenu by remember { mutableStateOf(false) }
    var showPhotoPickerSheet by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()

    val samplePhotos = listOf(
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&q=80"
    )

    val backgroundPresets = listOf(
        "#1E88E5" to PostBgBlue,
        "#E53935" to PostBgRed,
        "#8E24AA" to PostBgPurple,
        "#FB8C00" to PostBgOrange,
        "#00897B" to PostBgTeal,
        "#263238" to PostBgDark
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = if (groupId != null) "Create Group Post" else "Create Post",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Close")
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            if (currentUser == null || (content.isBlank() && selectedPhotoUrl == null)) return@Button
                            isPosting = true
                            coroutineScope.launch {
                                postRepository.createPost(
                                    currentUser = currentUser,
                                    content = content,
                                    photoUrl = selectedPhotoUrl,
                                    backgroundColorHex = selectedColorBg,
                                    privacy = privacy,
                                    groupId = groupId,
                                    groupName = groupName
                                )
                                isPosting = false
                                onPostCreated()
                            }
                        },
                        enabled = !isPosting && (content.isNotBlank() || selectedPhotoUrl != null),
                        colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .padding(end = 8.dp)
                            .testTag("post_publish_button")
                    ) {
                        if (isPosting) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text("Post", fontWeight = FontWeight.Bold)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.surface
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // User Header & Privacy Selector
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                AsyncImage(
                    model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                    contentDescription = "User Avatar",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                )

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(
                        text = currentUser?.name ?: "Zunex User",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )

                    Spacer(modifier = Modifier.height(2.dp))

                    // Privacy Pill Button
                    Box {
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .clickable { showPrivacyMenu = true }
                                .padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = when (privacy) {
                                    "friends" -> Icons.Default.Group
                                    "only_me" -> Icons.Default.Lock
                                    else -> Icons.Default.Public
                                },
                                contentDescription = null,
                                modifier = Modifier.size(12.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = when (privacy) {
                                    "friends" -> "Friends"
                                    "only_me" -> "Only me"
                                    else -> "Public"
                                },
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "▼",
                                fontSize = 8.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        DropdownMenu(
                            expanded = showPrivacyMenu,
                            onDismissRequest = { showPrivacyMenu = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Public") },
                                leadingIcon = { Icon(Icons.Default.Public, contentDescription = null) },
                                onClick = {
                                    privacy = "public"
                                    showPrivacyMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Friends") },
                                leadingIcon = { Icon(Icons.Default.Group, contentDescription = null) },
                                onClick = {
                                    privacy = "friends"
                                    showPrivacyMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Only me") },
                                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                                onClick = {
                                    privacy = "only_me"
                                    showPrivacyMenu = false
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Post Content Input Area (Colored or Plain)
            if (selectedColorBg != null && selectedPhotoUrl == null) {
                val bgCol = try {
                    Color(android.graphics.Color.parseColor(selectedColorBg))
                } catch (e: Exception) {
                    ZunexPrimaryBlue
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(240.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(bgCol)
                        .padding(20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    TextField(
                        value = content,
                        onValueChange = { content = it },
                        placeholder = {
                            Text(
                                "What's on your mind?",
                                color = Color.White.copy(alpha = 0.8f),
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.fillMaxWidth()
                            )
                        },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color.Transparent,
                            unfocusedContainerColor = Color.Transparent,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent
                        ),
                        textStyle = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center,
                            color = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxSize()
                            .testTag("colored_post_input")
                    )
                }
            } else {
                TextField(
                    value = content,
                    onValueChange = { content = it },
                    placeholder = {
                        Text(
                            text = if (groupId != null) "Write something in $groupName..." else "What's on your mind?",
                            fontSize = 18.sp
                        )
                    },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp)
                        .testTag("post_content_input")
                )
            }

            // Attached Photo Preview
            if (selectedPhotoUrl != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(220.dp)
                        .clip(RoundedCornerShape(12.dp))
                ) {
                    AsyncImage(
                        model = selectedPhotoUrl,
                        contentDescription = "Attached Photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    IconButton(
                        onClick = { selectedPhotoUrl = null },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.6f))
                    ) {
                        Icon(
                            Icons.Default.Close,
                            contentDescription = "Remove photo",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Background Color Presets Row
            if (selectedPhotoUrl == null) {
                Text(
                    text = "Background Themes",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Plain White/Clear Option
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .border(
                                1.5.dp,
                                if (selectedColorBg == null) ZunexPrimaryBlue else Color.LightGray,
                                RoundedCornerShape(8.dp)
                            )
                            .background(Color.White)
                            .clickable { selectedColorBg = null },
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Aa", fontWeight = FontWeight.Bold, color = Color.Black)
                    }

                    backgroundPresets.forEach { (hex, col) ->
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(col)
                                .border(
                                    2.dp,
                                    if (selectedColorBg == hex) Color.Black else Color.Transparent,
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedColorBg = hex }
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Media Selection Drawer / Gallery Picker
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Add to your post",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Row {
                            IconButton(onClick = { showPhotoPickerSheet = !showPhotoPickerSheet }) {
                                Icon(Icons.Default.PhotoLibrary, contentDescription = "Add Photo", tint = Color(0xFF4CAF50))
                            }
                            IconButton(onClick = { }) {
                                Icon(Icons.Default.EmojiEmotions, contentDescription = "Feeling", tint = Color(0xFFFFA000))
                            }
                        }
                    }

                    if (showPhotoPickerSheet) {
                        Text(
                            text = "Select from sample gallery:",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(vertical = 6.dp)
                        ) {
                            items(samplePhotos) { photo ->
                                AsyncImage(
                                    model = photo,
                                    contentDescription = null,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier
                                        .size(70.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .clickable {
                                            selectedPhotoUrl = photo
                                            selectedColorBg = null
                                            showPhotoPickerSheet = false
                                        }
                                )
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
fun EditPostScreen(
    postId: String,
    postRepository: PostRepository,
    onPostUpdated: () -> Unit,
    onNavigateBack: () -> Unit
) {
    val postState by postRepository.getPostById(postId).collectAsStateWithLifecycle(initialValue = null)
    var content by remember { mutableStateOf("") }
    var privacy by remember { mutableStateOf("public") }
    var isInitialized by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()

    if (postState != null && !isInitialized) {
        content = postState?.content ?: ""
        privacy = postState?.privacy ?: "public"
        isInitialized = true
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Post", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            val currentPost = postState ?: return@Button
                            coroutineScope.launch {
                                postRepository.updatePost(currentPost.copy(content = content, privacy = privacy))
                                onPostUpdated()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue)
                    ) {
                        Text("Save", fontWeight = FontWeight.Bold)
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
            OutlinedTextField(
                value = content,
                onValueChange = { content = it },
                label = { Text("Post caption") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PostDetailScreen(
    postId: String,
    currentUser: UserEntity?,
    postRepository: PostRepository,
    onAuthorClick: (String) -> Unit,
    onPhotoClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val post by postRepository.getPostById(postId).collectAsStateWithLifecycle(initialValue = null)
    val comments by postRepository.getCommentsForPost(postId).collectAsStateWithLifecycle(initialValue = emptyList())
    var newCommentText by remember { mutableStateOf("") }
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Post", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 4.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                        contentDescription = "User Avatar",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    TextField(
                        value = newCommentText,
                        onValueChange = { newCommentText = it },
                        placeholder = { Text("Write a comment...", fontSize = 14.sp) },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent
                        ),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("comment_input_field")
                    )

                    Spacer(modifier = Modifier.width(6.dp))

                    IconButton(
                        onClick = {
                            if (newCommentText.isBlank() || currentUser == null) return@IconButton
                            val textToSend = newCommentText
                            newCommentText = ""
                            coroutineScope.launch {
                                postRepository.addComment(postId, currentUser, textToSend)
                            }
                        },
                        enabled = newCommentText.isNotBlank(),
                        modifier = Modifier.testTag("send_comment_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send Comment",
                            tint = if (newCommentText.isNotBlank()) ZunexPrimaryBlue else Color.Gray
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            val currentPost = post
            if (currentPost != null) {
                item {
                    PostCard(
                        post = currentPost,
                        currentUserId = currentUser?.id ?: "",
                        onAuthorClick = onAuthorClick,
                        onPhotoClick = onPhotoClick,
                        onCommentClick = { },
                        onReactionToggle = { reaction ->
                            coroutineScope.launch {
                                postRepository.toggleReaction(currentPost.id, reaction)
                            }
                        },
                        onShareClick = {
                            if (currentUser != null) {
                                coroutineScope.launch {
                                    postRepository.sharePost(currentPost, currentUser)
                                }
                            }
                        },
                        onEditClick = { },
                        onDeleteClick = {
                            coroutineScope.launch {
                                postRepository.deletePost(currentPost.id)
                                onNavigateBack()
                            }
                        }
                    )

                    HorizontalDivider(thickness = 1.dp, color = FbBorder.copy(alpha = 0.5f))

                    Text(
                        text = "Comments",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
                    )
                }

                if (comments.isEmpty()) {
                    item {
                        Text(
                            text = "No comments yet. Be the first to comment!",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                } else {
                    items(comments, key = { it.id }) { comment ->
                        CommentItem(
                            comment = comment,
                            onAuthorClick = onAuthorClick,
                            onLikeToggle = {
                                coroutineScope.launch {
                                    postRepository.toggleCommentLike(comment)
                                }
                            },
                            onReplyClick = {
                                newCommentText = "@${comment.authorName} "
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun MediaViewerScreen(
    photoUrl: String,
    onNavigateBack: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        AsyncImage(
            model = photoUrl,
            contentDescription = "Full Screen Photo",
            contentScale = ContentScale.Fit,
            modifier = Modifier.fillMaxSize()
        )

        IconButton(
            onClick = onNavigateBack,
            modifier = Modifier
                .padding(16.dp)
                .size(40.dp)
                .clip(CircleShape)
                .background(Color.Black.copy(alpha = 0.6f))
                .align(Alignment.TopStart)
        ) {
            Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
        }
    }
}
