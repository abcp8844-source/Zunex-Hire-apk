package com.example.ui.screens.groups

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
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Switch
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.example.data.model.GroupEntity
import com.example.data.model.GroupMemberEntity
import com.example.data.model.UserEntity
import com.example.data.repository.GroupRepository
import com.example.data.repository.PostRepository
import com.example.ui.components.PostCard
import com.example.ui.theme.FbBorder
import com.example.ui.theme.ZunexAccentGold
import com.example.ui.theme.ZunexPrimaryBlue
import com.example.ui.theme.ZunexPrimaryLight
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GroupsHomeScreen(
    currentUser: UserEntity?,
    groupRepository: GroupRepository,
    onGroupClick: (String) -> Unit,
    onCreateGroupClick: () -> Unit,
    onSearchClick: () -> Unit
) {
    val joinedGroups by groupRepository.joinedGroups.collectAsStateWithLifecycle(initialValue = emptyList())
    val suggestedGroups by groupRepository.suggestedGroups.collectAsStateWithLifecycle(initialValue = emptyList())
    var selectedTab by remember { mutableIntStateOf(0) }
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Groups", fontWeight = FontWeight.ExtraBold, fontSize = 22.sp) },
                actions = {
                    IconButton(onClick = onCreateGroupClick, modifier = Modifier.testTag("create_group_action")) {
                        Icon(Icons.Default.Add, contentDescription = "Create Group")
                    }
                    IconButton(onClick = onSearchClick) {
                        Icon(Icons.Default.Search, contentDescription = "Search Groups")
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
            // Facebook Style Tab Bar (Your Groups / Discover)
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = ZunexPrimaryBlue
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Your Groups (${joinedGroups.size})", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Discover", fontWeight = FontWeight.Bold) }
                )
            }

            if (selectedTab == 0) {
                // Joined Groups List
                if (joinedGroups.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.Group, contentDescription = null, modifier = Modifier.size(64.dp), tint = Color.Gray)
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("You haven't joined any groups yet", fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(onClick = { selectedTab = 1 }, colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue)) {
                                Text("Discover Groups")
                            }
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(12.dp)
                    ) {
                        items(joinedGroups, key = { it.id }) { group ->
                            GroupCard(
                                group = group,
                                onClick = { onGroupClick(group.id) },
                                onJoinToggle = {
                                    if (currentUser != null) {
                                        coroutineScope.launch {
                                            if (group.isJoined) {
                                                groupRepository.leaveGroup(group, currentUser)
                                            } else {
                                                groupRepository.joinGroup(group, currentUser)
                                            }
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            } else {
                // Suggested / Discover Groups
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(12.dp)
                ) {
                    item {
                        Text(
                            text = "Suggested For You",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                    }

                    items(suggestedGroups, key = { it.id }) { group ->
                        GroupCard(
                            group = group,
                            onClick = { onGroupClick(group.id) },
                            onJoinToggle = {
                                if (currentUser != null) {
                                    coroutineScope.launch {
                                        groupRepository.joinGroup(group, currentUser)
                                    }
                                }
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun GroupCard(
    group: GroupEntity,
    onClick: () -> Unit,
    onJoinToggle: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .testTag("group_card_${group.id}"),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column {
            AsyncImage(
                model = group.coverPhotoUrl.ifBlank { "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" },
                contentDescription = "Group Cover",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
            )

            Column(modifier = Modifier.padding(14.dp)) {
                Text(
                    text = group.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(
                        imageVector = if (group.privacy == "private") Icons.Default.Lock else Icons.Default.Public,
                        contentDescription = null,
                        modifier = Modifier.size(12.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${group.privacy.replaceFirstChar { it.uppercase() }} Group • ${group.membersCount} members",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = group.description,
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                Button(
                    onClick = onJoinToggle,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (group.isJoined) MaterialTheme.colorScheme.surfaceVariant else ZunexPrimaryBlue
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = if (group.isJoined) "Joined ✓" else "Join Group",
                        fontWeight = FontWeight.Bold,
                        color = if (group.isJoined) MaterialTheme.colorScheme.onSurface else Color.White
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GroupDetailScreen(
    groupId: String,
    currentUser: UserEntity?,
    groupRepository: GroupRepository,
    postRepository: PostRepository,
    onCreateGroupPostClick: (String) -> Unit,
    onMembersClick: (String) -> Unit,
    onPendingRequestsClick: (String) -> Unit,
    onSettingsClick: (String) -> Unit,
    onMediaClick: (String) -> Unit,
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onPhotoClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val group by groupRepository.getGroupById(groupId).collectAsStateWithLifecycle(initialValue = null)
    val groupPosts by postRepository.getGroupPosts(groupId).collectAsStateWithLifecycle(initialValue = emptyList())
    var selectedTab by remember { mutableIntStateOf(0) }
    val coroutineScope = rememberCoroutineScope()

    val currentGroup = group

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(currentGroup?.name ?: "Group", maxLines = 1, overflow = TextOverflow.Ellipsis, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (currentGroup?.userRole == "admin") {
                        IconButton(onClick = { onSettingsClick(groupId) }) {
                            Icon(Icons.Default.Settings, contentDescription = "Group Settings")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        if (currentGroup == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Group not found")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Group Header Banner
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surface)
                    ) {
                        AsyncImage(
                            model = currentGroup.coverPhotoUrl.ifBlank { "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" },
                            contentDescription = "Cover",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp)
                        )

                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = currentGroup.name,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = if (currentGroup.privacy == "private") Icons.Default.Lock else Icons.Default.Public,
                                    contentDescription = null,
                                    modifier = Modifier.size(14.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = "${currentGroup.privacy.replaceFirstChar { it.uppercase() }} Group • ${currentGroup.membersCount} members",
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Action Buttons
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Button(
                                    onClick = {
                                        if (currentUser != null) {
                                            coroutineScope.launch {
                                                if (currentGroup.isJoined) {
                                                    groupRepository.leaveGroup(currentGroup, currentUser)
                                                } else {
                                                    groupRepository.joinGroup(currentGroup, currentUser)
                                                }
                                            }
                                        }
                                    },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (currentGroup.isJoined) MaterialTheme.colorScheme.surfaceVariant else ZunexPrimaryBlue
                                    ),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = if (currentGroup.isJoined) "Joined ✓" else "+ Join Group",
                                        fontWeight = FontWeight.Bold,
                                        color = if (currentGroup.isJoined) MaterialTheme.colorScheme.onSurface else Color.White
                                    )
                                }

                                if (currentGroup.isJoined) {
                                    Button(
                                        onClick = { onCreateGroupPostClick(groupId) },
                                        modifier = Modifier.weight(1f),
                                        colors = ButtonDefaults.buttonColors(containerColor = ZunexAccentGold),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Text("+ Post", fontWeight = FontWeight.Bold, color = Color.Black)
                                    }
                                }
                            }

                            // Admin Manage Quick Action
                            if (currentGroup.userRole == "admin") {
                                Spacer(modifier = Modifier.height(8.dp))
                                OutlinedButton(
                                    onClick = { onPendingRequestsClick(groupId) },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Icon(Icons.Default.AdminPanelSettings, contentDescription = null, tint = ZunexPrimaryBlue)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Admin: Manage Member Requests", color = ZunexPrimaryBlue, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        // Group Navigation Bar (Discussion, Members, Media, About)
                        ScrollableTabRow(
                            selectedTabIndex = selectedTab,
                            containerColor = MaterialTheme.colorScheme.surface,
                            edgePadding = 12.dp
                        ) {
                            Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("Discussion", fontWeight = FontWeight.Bold) })
                            Tab(selected = selectedTab == 1, onClick = { onMembersClick(groupId) }, text = { Text("Members", fontWeight = FontWeight.Bold) })
                            Tab(selected = selectedTab == 2, onClick = { onMediaClick(groupId) }, text = { Text("Photos", fontWeight = FontWeight.Bold) })
                            Tab(selected = selectedTab == 3, onClick = { selectedTab = 3 }, text = { Text("About", fontWeight = FontWeight.Bold) })
                        }
                    }
                }

                if (selectedTab == 0) {
                    // Group Feed
                    if (groupPosts.isEmpty()) {
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
                                    Text("No posts in this group yet", fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Button(onClick = { onCreateGroupPostClick(groupId) }, colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue)) {
                                        Text("Write First Post")
                                    }
                                }
                            }
                        }
                    } else {
                        items(groupPosts, key = { it.id }) { post ->
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
                } else if (selectedTab == 3) {
                    // Group About Details
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text("About this group", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(currentGroup.description, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)

                                Spacer(modifier = Modifier.height(16.dp))
                                HorizontalDivider()
                                Spacer(modifier = Modifier.height(16.dp))

                                Text("Group Rules", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(currentGroup.rules, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
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
fun CreateGroupScreen(
    currentUser: UserEntity?,
    groupRepository: GroupRepository,
    onGroupCreated: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    var groupName by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("General") }
    var privacy by remember { mutableStateOf("public") }
    var requireApproval by remember { mutableStateOf(false) }
    var rules by remember { mutableStateOf("1. Be respectful\n2. No spam\n3. Relevant topics only") }
    var isCreating by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Create Group", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
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
                .padding(20.dp)
        ) {
            OutlinedTextField(
                value = groupName,
                onValueChange = { groupName = it },
                label = { Text("Name your group") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("create_group_name_input"),
                shape = RoundedCornerShape(10.dp)
            )

            Spacer(modifier = Modifier.height(14.dp))

            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Group description") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                maxLines = 4
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text("Privacy", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Row(
                modifier = Modifier.padding(vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                FilterChip(
                    selected = privacy == "public",
                    onClick = { privacy = "public" },
                    label = { Text("Public") },
                    leadingIcon = { Icon(Icons.Default.Public, contentDescription = null, modifier = Modifier.size(16.dp)) }
                )
                FilterChip(
                    selected = privacy == "private",
                    onClick = { privacy = "private" },
                    label = { Text("Private") },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(16.dp)) }
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Require post approval", fontWeight = FontWeight.SemiBold)
                    Text("Admins must approve posts before they appear", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Switch(checked = requireApproval, onCheckedChange = { requireApproval = it })
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    if (currentUser == null || groupName.isBlank()) return@Button
                    isCreating = true
                    coroutineScope.launch {
                        val groupId = groupRepository.createGroup(
                            currentUser = currentUser,
                            name = groupName,
                            description = description,
                            category = category,
                            privacy = privacy,
                            requireApproval = requireApproval,
                            rules = rules
                        )
                        isCreating = false
                        onGroupCreated(groupId)
                    }
                },
                enabled = groupName.isNotBlank() && !isCreating,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .testTag("create_group_submit_button"),
                colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Create Group", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GroupMembersScreen(
    groupId: String,
    groupRepository: GroupRepository,
    onAuthorClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val members by groupRepository.getGroupMembers(groupId).collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Group Members (${members.size})", fontWeight = FontWeight.Bold) },
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
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(members, key = { it.id }) { member ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onAuthorClick(member.userId) },
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = member.userAvatar.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                            contentDescription = null,
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(member.userName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text(
                                text = member.role.replaceFirstChar { it.uppercase() },
                                fontSize = 12.sp,
                                color = if (member.role == "admin") ZunexPrimaryBlue else MaterialTheme.colorScheme.onSurfaceVariant,
                                fontWeight = if (member.role == "admin") FontWeight.Bold else FontWeight.Normal
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
fun GroupPendingRequestsScreen(
    groupId: String,
    groupRepository: GroupRepository,
    onNavigateBack: () -> Unit
) {
    val pending by groupRepository.getPendingRequests(groupId).collectAsStateWithLifecycle(initialValue = emptyList())
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pending Member Requests", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (pending.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No pending member requests.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(pending, key = { it.id }) { req ->
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
                                model = req.userAvatar.ifBlank { "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
                                contentDescription = null,
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(CircleShape)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(req.userName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                Text("Requested to join", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Button(
                                    onClick = {
                                        coroutineScope.launch {
                                            groupRepository.approvePendingRequest(req)
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = ZunexPrimaryBlue)
                                ) {
                                    Text("Approve")
                                }

                                OutlinedButton(
                                    onClick = {
                                        coroutineScope.launch {
                                            groupRepository.rejectPendingRequest(req)
                                        }
                                    }
                                ) {
                                    Text("Decline")
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
fun GroupSettingsScreen(
    groupId: String,
    groupRepository: GroupRepository,
    onNavigateBack: () -> Unit
) {
    val group by groupRepository.getGroupById(groupId).collectAsStateWithLifecycle(initialValue = null)
    var name by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var requireApproval by remember { mutableStateOf(false) }
    var rules by remember { mutableStateOf("") }
    var isLoaded by remember { mutableStateOf(false) }

    val currentGroup = group
    if (currentGroup != null && !isLoaded) {
        name = currentGroup.name
        description = currentGroup.description
        requireApproval = currentGroup.requirePostApproval
        rules = currentGroup.rules
        isLoaded = true
    }

    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Group Settings", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            if (currentGroup != null) {
                                coroutineScope.launch {
                                    groupRepository.updateGroupSettings(
                                        group = currentGroup,
                                        name = name,
                                        description = description,
                                        privacy = currentGroup.privacy,
                                        requireApproval = requireApproval,
                                        rules = rules
                                    )
                                    onNavigateBack()
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Group Name") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(12.dp))
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description") },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 4
            )
            Spacer(modifier = Modifier.height(12.dp))
            OutlinedTextField(
                value = rules,
                onValueChange = { rules = it },
                label = { Text("Group Rules") },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 6
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Require post approval", fontWeight = FontWeight.Bold)
                Switch(checked = requireApproval, onCheckedChange = { requireApproval = it })
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GroupMediaScreen(
    groupId: String,
    groupRepository: GroupRepository,
    onPhotoClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val photos by groupRepository.getGroupPhotos(groupId).collectAsStateWithLifecycle(initialValue = emptyList())

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Group Photos", fontWeight = FontWeight.Bold) },
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
                Text("No photos shared in this group yet.")
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
