package com.example.ui.screens.feed

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ColorLens
import androidx.compose.material.icons.filled.EmojiEmotions
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.example.data.model.CommentEntity
import com.example.data.model.PostEntity
import com.example.data.model.StoryEntity
import com.example.data.model.UserEntity
import com.example.data.repository.PostRepository
import com.example.ui.components.CommentItem
import com.example.ui.components.MediaPickerBottomSheet
import com.example.ui.components.POPULAR_PRESET_IMAGES
import com.example.ui.components.PostCard
import com.example.ui.components.ZunexHeader
import com.example.ui.components.ZunexLoader
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
    onCreateStoryClick: () -> Unit,
    onStoryClick: (String) -> Unit,
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onGroupClick: (String) -> Unit,
    onPhotoClick: (String) -> Unit,
    onSearchClick: () -> Unit,
    onNotificationsClick: () -> Unit,
    onEditPostClick: (String) -> Unit
) {
    val posts by postRepository.feedPosts.collectAsStateWithLifecycle(initialValue = emptyList())
    val stories by postRepository.stories.collectAsStateWithLifecycle(initialValue = emptyList())
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
            // 1. "What's on your mind?" Facebook Publisher Card
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
                                model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                                contentDescription = "Profile Avatar",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .size(42.dp)
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
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.15f),
                            thickness = 0.8.dp,
                            modifier = Modifier.padding(horizontal = 14.dp)
                        )

                        // Quick Action Buttons (Photo, Feeling, Story)
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
                                    .clickable { onCreateStoryClick() }
                                    .padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.PhotoCamera,
                                    contentDescription = "Story",
                                    tint = ZunexPrimaryBlue,
                                    modifier = Modifier.size(20.dp)
                                )
                                Text(
                                    text = "Story",
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
                                    contentDescription = "Feeling",
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

            // 2. Facebook Style Stories Carousel
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(0.dp)
                ) {
                    Column(modifier = Modifier.padding(vertical = 12.dp)) {
                        Text(
                            text = "Stories",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 2.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp)
                        ) {
                            // First Card: Create Story
                            item {
                                Card(
                                    modifier = Modifier
                                        .size(width = 105.dp, height = 175.dp)
                                        .clickable { onCreateStoryClick() }
                                        .testTag("create_story_card"),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                                ) {
                                    Box(modifier = Modifier.fillMaxSize()) {
                                        AsyncImage(
                                            model = currentUser?.avatarUrl?.ifBlank { "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
                                            contentDescription = "My Avatar",
                                            contentScale = ContentScale.Crop,
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(115.dp)
                                        )

                                        Box(
                                            modifier = Modifier
                                                .align(Alignment.BottomCenter)
                                                .fillMaxWidth()
                                                .height(65.dp)
                                                .background(MaterialTheme.colorScheme.surface)
                                        ) {
                                            Column(
                                                modifier = Modifier.fillMaxSize(),
                                                horizontalAlignment = Alignment.CenterHorizontally,
                                                verticalArrangement = Arrangement.Center
                                            ) {
                                                Spacer(modifier = Modifier.height(12.dp))
                                                Text(
                                                    text = "Create story",
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 12.sp,
                                                    textAlign = TextAlign.Center
                                                )
                                            }
                                        }

                                        // Plus Button in Circle
                                        Box(
                                            modifier = Modifier
                                                .align(Alignment.BottomCenter)
                                                .padding(bottom = 45.dp)
                                                .size(32.dp)
                                                .clip(CircleShape)
                                                .background(ZunexPrimaryBlue)
                                                .border(2.dp, MaterialTheme.colorScheme.surface, CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Add,
                                                contentDescription = "Add Story",
                                                tint = Color.White,
                                                modifier = Modifier.size(20.dp)
                                            )
                                        }
                                    }
                                }
                            }

                            // Stories from friends
                            items(stories, key = { it.id }) { story ->
                                Card(
                                    modifier = Modifier
                                        .size(width = 105.dp, height = 175.dp)
                                        .clickable { onStoryClick(story.id) }
                                        .testTag("story_card_${story.id}"),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Box(modifier = Modifier.fillMaxSize()) {
                                        AsyncImage(
                                            model = story.mediaUrl,
                                            contentDescription = "Story media",
                                            contentScale = ContentScale.Crop,
                                            modifier = Modifier.fillMaxSize()
                                        )

                                        // Gradient dark overlay for text readability
                                        Box(
                                            modifier = Modifier
                                                .fillMaxSize()
                                                .background(
                                                    Brush.verticalGradient(
                                                        listOf(Color.Transparent, Color.Black.copy(alpha = 0.7f)),
                                                        startY = 100f
                                                    )
                                                )
                                        )

                                        // Author Avatar with Blue Ring
                                        Box(
                                            modifier = Modifier
                                                .padding(8.dp)
                                                .size(34.dp)
                                                .clip(CircleShape)
                                                .background(ZunexPrimaryBlue)
                                                .padding(2.dp)
                                        ) {
                                            AsyncImage(
                                                model = story.authorAvatar,
                                                contentDescription = story.authorName,
                                                contentScale = ContentScale.Crop,
                                                modifier = Modifier
                                                    .fillMaxSize()
                                                    .clip(CircleShape)
                                            )
                                        }

                                        // Author Name
                                        Text(
                                            text = story.authorName,
                                            color = Color.White,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            maxLines = 2,
                                            overflow = TextOverflow.Ellipsis,
                                            modifier = Modifier
                                                .align(Alignment.BottomStart)
                                                .padding(8.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 3. Posts Feed
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
    groupId: String? = null,
    groupName: String? = null,
    postRepository: PostRepository,
    onPostCreated: () -> Unit,
    onNavigateBack: () -> Unit
) {
    var content by remember { mutableStateOf("") }
    var selectedPhotoUrl by remember { mutableStateOf<String?>(null) }
    var selectedBgColor by remember { mutableStateOf<String?>(null) }
    var privacy by remember { mutableStateOf("public") }
    var isAnonymous by remember { mutableStateOf(false) }
    var selectedTopic by remember { mutableStateOf<String?>(null) }
    var showColorPicker by remember { mutableStateOf(false) }
    var showPhotoPickerSheet by remember { mutableStateOf(false) }
    var showAnonymousDisclaimer by remember { mutableStateOf(false) }
    var isSubmitting by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()

    val backgroundPresets = listOf(
        null,
        "#1E88E5",
        "#263238",
        "#8E24AA",
        "#00897B",
        "#FB8C00",
        "#E53935"
    )

    val groupTopics = listOf("jobs and job", "travel", "Announcements", "visa help", "general")

    if (showPhotoPickerSheet) {
        MediaPickerBottomSheet(
            title = "Attach Photo to Post",
            presets = POPULAR_PRESET_IMAGES,
            onPhotoSelected = { url ->
                selectedPhotoUrl = url
                selectedBgColor = null
                showPhotoPickerSheet = false
            },
            onDismiss = { showPhotoPickerSheet = false }
        )
    }

    if (showAnonymousDisclaimer) {
        AlertDialog(
            onDismissRequest = { showAnonymousDisclaimer = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Shield, contentDescription = null, tint = ZunexPrimaryBlue)
                    Text("Post Anonymously")
                }
            },
            text = {
                Text(
                    "Your name and profile picture won't be shown to the group. Group admins, moderators, and Zunex systems will still be able to see your identity for safety and moderation.",
                    fontSize = 14.sp,
                    lineHeight = 19.sp
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        isAnonymous = true
                        showAnonymousDisclaimer = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue)
                ) {
                    Text("I Understand & Enable")
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showAnonymousDisclaimer = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (groupId != null) "Create Group Post" else "Create Post", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.Close, contentDescription = "Cancel")
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            if (currentUser == null || (content.isBlank() && selectedPhotoUrl == null)) return@Button
                            isSubmitting = true
                            coroutineScope.launch {
                                postRepository.createPost(
                                    currentUser = currentUser,
                                    content = content,
                                    photoUrl = selectedPhotoUrl,
                                    backgroundColorHex = selectedBgColor,
                                    privacy = privacy,
                                    isAnonymous = isAnonymous,
                                    topic = selectedTopic,
                                    groupId = groupId,
                                    groupName = groupName
                                )
                                isSubmitting = false
                                onPostCreated()
                            }
                        },
                        enabled = (content.isNotBlank() || selectedPhotoUrl != null) && !isSubmitting,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = ZunexPrimaryBlue,
                            disabledContainerColor = ZunexPrimaryBlue.copy(alpha = 0.4f)
                        ),
                        modifier = Modifier.testTag("submit_post_button")
                    ) {
                        Text("Post", fontWeight = FontWeight.Bold, color = Color.White)
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
            // User Header Row (Avatar, Name, Privacy/Anonymous badges)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                AsyncImage(
                    model = if (isAnonymous) "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" else currentUser?.avatarUrl,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(46.dp)
                        .clip(CircleShape)
                )

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Text(
                        text = if (isAnonymous) "Anonymous participant" else (currentUser?.name ?: "You"),
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )

                    Spacer(modifier = Modifier.height(3.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        // Privacy Chip
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.clickable {
                                privacy = when (privacy) {
                                    "public" -> "friends"
                                    "friends" -> "only_me"
                                    else -> "public"
                                }
                            }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
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
                                    modifier = Modifier.size(12.dp)
                                )
                                Text(
                                    text = when (privacy) {
                                        "friends" -> "Friends"
                                        "only_me" -> "Only Me"
                                        else -> "Public"
                                    },
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }

                        // Anonymous Badge
                        if (isAnonymous) {
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color(0xFFE8F5E9)
                            ) {
                                Text(
                                    text = "Anonymous on",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF2E7D32),
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Group topic selector if in group
            if (groupId != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text("Select topic (optional):", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.padding(vertical = 4.dp)
                ) {
                    items(groupTopics) { topic ->
                        FilterChip(
                            selected = selectedTopic == topic,
                            onClick = { selectedTopic = if (selectedTopic == topic) null else topic },
                            label = { Text(topic) }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Text Input Box (or Colored Background Card)
            if (selectedBgColor != null && selectedPhotoUrl == null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(240.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(android.graphics.Color.parseColor(selectedBgColor))),
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
                        textStyle = androidx.compose.ui.text.TextStyle(
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center,
                            color = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                            .testTag("post_content_input")
                    )
                }
            } else {
                TextField(
                    value = content,
                    onValueChange = { content = it },
                    placeholder = {
                        Text(
                            "What's on your mind?",
                            fontSize = 17.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
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
                        contentDescription = "Selected Photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    IconButton(
                        onClick = { selectedPhotoUrl = null },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                            .size(32.dp)
                            .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Remove photo", tint = Color.White, modifier = Modifier.size(18.dp))
                    }
                }
            }

            // Color Palette Selector
            AnimatedVisibility(visible = showColorPicker) {
                Column(modifier = Modifier.padding(vertical = 10.dp)) {
                    Text("Select Background Color:", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        backgroundPresets.forEach { colorHex ->
                            val isSelected = selectedBgColor == colorHex
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (colorHex == null) MaterialTheme.colorScheme.surfaceVariant
                                        else Color(android.graphics.Color.parseColor(colorHex))
                                    )
                                    .border(
                                        width = if (isSelected) 3.dp else 1.dp,
                                        color = if (isSelected) ZunexAccentGold else Color.Gray.copy(alpha = 0.4f),
                                        shape = CircleShape
                                    )
                                    .clickable {
                                        selectedBgColor = colorHex
                                        if (colorHex != null) selectedPhotoUrl = null
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                if (colorHex == null) {
                                    Icon(Icons.Default.Close, contentDescription = "None", modifier = Modifier.size(16.dp))
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Bottom Attachment Bar (Photo Gallery, Colors, Anonymous Toggle)
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Add to your post", fontWeight = FontWeight.Bold, fontSize = 14.sp)

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        // Photo Gallery Picker Trigger
                        IconButton(
                            onClick = { showPhotoPickerSheet = true },
                            modifier = Modifier.testTag("attach_photo_btn")
                        ) {
                            Icon(Icons.Default.PhotoLibrary, contentDescription = "Photos", tint = Color(0xFF4CAF50))
                        }

                        // Background Color Picker
                        IconButton(onClick = { showColorPicker = !showColorPicker }) {
                            Icon(Icons.Default.ColorLens, contentDescription = "Colors", tint = ZunexPrimaryBlue)
                        }

                        // Anonymous Posting Toggle
                        IconButton(
                            onClick = {
                                if (!isAnonymous) {
                                    showAnonymousDisclaimer = true
                                } else {
                                    isAnonymous = false
                                }
                            }
                        ) {
                            Icon(
                                Icons.Default.Shield,
                                contentDescription = "Anonymous",
                                tint = if (isAnonymous) Color(0xFF2E7D32) else Color.Gray
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
fun CreateStoryScreen(
    currentUser: UserEntity?,
    postRepository: PostRepository,
    onStoryCreated: () -> Unit,
    onNavigateBack: () -> Unit
) {
    var selectedMediaUrl by remember { mutableStateOf<String?>(POPULAR_PRESET_IMAGES.first()) }
    var caption by remember { mutableStateOf("") }
    var showPhotoPickerSheet by remember { mutableStateOf(false) }
    var isSubmitting by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    if (showPhotoPickerSheet) {
        MediaPickerBottomSheet(
            title = "Choose Photo for Story",
            presets = POPULAR_PRESET_IMAGES,
            onPhotoSelected = { url ->
                selectedMediaUrl = url
                showPhotoPickerSheet = false
            },
            onDismiss = { showPhotoPickerSheet = false }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Create Story", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.Close, contentDescription = "Cancel")
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            if (currentUser == null || selectedMediaUrl == null) return@Button
                            isSubmitting = true
                            coroutineScope.launch {
                                postRepository.createStory(
                                    currentUser = currentUser,
                                    mediaUrl = selectedMediaUrl!!,
                                    caption = caption
                                )
                                isSubmitting = false
                                onStoryCreated()
                            }
                        },
                        enabled = selectedMediaUrl != null && !isSubmitting,
                        colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                        modifier = Modifier.testTag("share_story_btn")
                    ) {
                        Text("Share to Story", fontWeight = FontWeight.Bold, color = Color.White)
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
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color.Black)
            ) {
                if (selectedMediaUrl != null) {
                    AsyncImage(
                        model = selectedMediaUrl,
                        contentDescription = "Story Preview",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                }

                if (caption.isNotBlank()) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.Center)
                            .background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(caption, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                    }
                }

                Button(
                    onClick = { showPhotoPickerSheet = true },
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Black.copy(alpha = 0.7f))
                ) {
                    Icon(Icons.Default.PhotoLibrary, contentDescription = null, tint = Color.White)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Change Photo / Gallery", color = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = caption,
                onValueChange = { caption = it },
                label = { Text("Add a text caption...") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
        }
    }
}

@Composable
fun StoryViewerScreen(
    storyId: String,
    postRepository: PostRepository,
    onNavigateBack: () -> Unit
) {
    val stories by postRepository.stories.collectAsStateWithLifecycle(initialValue = emptyList())
    val story = stories.find { it.id == storyId } ?: stories.firstOrNull()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        if (story != null) {
            AsyncImage(
                model = story.mediaUrl,
                contentDescription = "Story",
                contentScale = ContentScale.Fit,
                modifier = Modifier.fillMaxSize()
            )

            // Header Bar (Author Avatar, Name, Close)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 40.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                AsyncImage(
                    model = story.authorAvatar,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                )

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(story.authorName, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("Story update", color = Color.LightGray, fontSize = 12.sp)
                }

                IconButton(
                    onClick = onNavigateBack,
                    modifier = Modifier
                        .size(36.dp)
                        .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                }
            }

            if (story.caption.isNotBlank()) {
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 50.dp)
                        .padding(horizontal = 24.dp)
                        .background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(story.caption, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center)
                }
            }
        } else {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Story unavailable", color = Color.White)
            }
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
    var commentText by remember { mutableStateOf("") }
    val coroutineScope = rememberCoroutineScope()

    val currentPost = post

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
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = currentUser?.avatarUrl,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    OutlinedTextField(
                        value = commentText,
                        onValueChange = { commentText = it },
                        placeholder = { Text("Write a comment...") },
                        modifier = Modifier
                            .weight(1f)
                            .testTag("comment_input"),
                        shape = RoundedCornerShape(20.dp),
                        maxLines = 3
                    )

                    Spacer(modifier = Modifier.width(6.dp))

                    IconButton(
                        onClick = {
                            if (currentUser != null && commentText.isNotBlank() && currentPost != null) {
                                coroutineScope.launch {
                                    postRepository.addComment(
                                        postId = currentPost.id,
                                        currentUser = currentUser,
                                        content = commentText
                                    )
                                    commentText = ""
                                }
                            }
                        },
                        enabled = commentText.isNotBlank(),
                        modifier = Modifier.testTag("send_comment_btn")
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send",
                            tint = if (commentText.isNotBlank()) ZunexPrimaryBlue else Color.Gray
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        if (currentPost == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Post not found.")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
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
                        }
                    )
                }

                item {
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                    Text(
                        text = "Comments (${comments.size})",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
                    )
                }

                if (comments.isEmpty()) {
                    item {
                        Text(
                            text = "No comments yet. Be the first to comment!",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 13.sp,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
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
                            }
                        )
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
    val post by postRepository.getPostById(postId).collectAsStateWithLifecycle(initialValue = null)
    var content by remember { mutableStateOf("") }
    var isLoaded by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    val currentPost = post
    if (currentPost != null && !isLoaded) {
        content = currentPost.content
        isLoaded = true
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Post", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.Close, contentDescription = "Cancel")
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            if (currentPost != null) {
                                coroutineScope.launch {
                                    postRepository.updatePost(currentPost.copy(content = content))
                                    onPostUpdated()
                                }
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
                .padding(16.dp)
        ) {
            OutlinedTextField(
                value = content,
                onValueChange = { content = it },
                label = { Text("Post content") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            )
        }
    }
}

@Composable
fun MediaViewerScreen(
    url: String,
    onNavigateBack: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        AsyncImage(
            model = url,
            contentDescription = "Full Image",
            contentScale = ContentScale.Fit,
            modifier = Modifier.fillMaxSize()
        )

        IconButton(
            onClick = onNavigateBack,
            modifier = Modifier
                .padding(top = 40.dp, start = 16.dp)
                .size(40.dp)
                .background(Color.Black.copy(alpha = 0.5f), CircleShape)
        ) {
            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
        }
    }
}
