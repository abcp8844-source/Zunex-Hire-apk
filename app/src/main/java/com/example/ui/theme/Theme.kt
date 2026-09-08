package com.example.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = ZunexPrimaryBlue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE7F3FF),
    onPrimaryContainer = ZunexPrimaryBlue,
    secondary = ZunexAccentGold,
    onSecondary = Color.Black,
    secondaryContainer = Color(0xFFFFF3E0),
    onSecondaryContainer = Color(0xFF5D4037),
    background = FbBackground,
    onBackground = FbTextPrimary,
    surface = FbCardBg,
    onSurface = FbTextPrimary,
    surfaceVariant = FbInputBg,
    onSurfaceVariant = FbTextSecondary,
    outline = FbBorder
)

private val DarkColorScheme = darkColorScheme(
    primary = ZunexPrimaryLight,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF1B3B6F),
    onPrimaryContainer = Color.White,
    secondary = ZunexAccentGold,
    onSecondary = Color.Black,
    background = Color(0xFF18191A),
    onBackground = Color(0xFFE4E6EB),
    surface = Color(0xFF242526),
    onSurface = Color(0xFFE4E6EB),
    surfaceVariant = Color(0xFF3A3B3C),
    onSurfaceVariant = Color(0xFFB0B3B8),
    outline = Color(0xFF3E4042)
)

@Composable
fun ZunexTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = colorScheme.surface.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
