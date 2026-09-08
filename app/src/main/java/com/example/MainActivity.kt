package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.lifecycleScope
import com.example.data.local.AppDatabase
import com.example.data.local.DatabaseInitializer
import com.example.data.repository.AuthRepository
import com.example.data.repository.GroupRepository
import com.example.data.repository.InteractionRepository
import com.example.data.repository.PostRepository
import com.example.data.repository.UserRepository
import com.example.ui.navigation.AppNavigator
import com.example.ui.theme.ZunexTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private lateinit var database: AppDatabase
    private lateinit var authRepository: AuthRepository
    private lateinit var userRepository: UserRepository
    private lateinit var postRepository: PostRepository
    private lateinit var groupRepository: GroupRepository
    private lateinit var interactionRepository: InteractionRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        database = AppDatabase.getDatabase(applicationContext)

        // Seed initial data asynchronously on first run
        lifecycleScope.launch {
            DatabaseInitializer.seedDatabaseIfEmpty(database)
        }

        // Initialize repositories
        authRepository = AuthRepository(database)
        userRepository = UserRepository(database)
        postRepository = PostRepository(database)
        groupRepository = GroupRepository(database)
        interactionRepository = InteractionRepository(database)

        setContent {
            ZunexTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    AppNavigator(
                        authRepository = authRepository,
                        userRepository = userRepository,
                        postRepository = postRepository,
                        groupRepository = groupRepository,
                        interactionRepository = interactionRepository
                    )
                }
            }
        }
    }
}
