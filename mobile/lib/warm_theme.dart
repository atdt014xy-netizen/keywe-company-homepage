import 'package:flutter/material.dart';

abstract final class Warm {
  static const outerPadding = 5.0;
  static const pagePadding = 5.0;
  static const background = Color(0xfffaf6ef);
  static const ink = Color(0xff2c1b13);
  static const muted = Color(0xff806e61);
  static const accent = Color(0xfff06416);
  static const pressed = Color(0xffd94f08);
  // Darker tone for small orange text on ivory, preserving readable contrast.
  static const actionText = Color(0xffb74306);
  static const soft = Color(0xfffff0e2);
  static const border = Color(0xffeadfd3);
  static const out = Color(0xffd92d20);
  static const outSoft = Color(0xfffeece8);
  static const low = Color(0xffb85a0a);
  static const lowSoft = Color(0xfffff2df);
  static const good = Color(0xff16803c);
  static const goodSoft = Color(0xffeaf5eb);

  static ThemeData get theme => ThemeData(
    useMaterial3: true,
    fontFamily: 'NotoSansKR',
    scaffoldBackgroundColor: background,
    colorScheme: ColorScheme.fromSeed(seedColor: accent).copyWith(
      primary: accent,
      onPrimary: ink,
      surface: Colors.white,
      onSurface: ink,
      secondary: actionText,
      outline: border,
      error: out,
    ),
    textTheme: ThemeData.light().textTheme.apply(
      fontFamily: 'NotoSansKR',
      bodyColor: ink,
      displayColor: ink,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: background,
      foregroundColor: ink,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
    ),
    cardTheme: const CardThemeData(
      color: Colors.white,
      surfaceTintColor: Colors.transparent,
      elevation: 0.4,
      shadowColor: Color(0x182c1b13),
      margin: EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
        side: BorderSide(color: border),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: accent, width: 2),
      ),
      hintStyle: const TextStyle(color: muted, fontSize: 14),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: ButtonStyle(
        minimumSize: const WidgetStatePropertyAll(Size(48, 50)),
        padding: const WidgetStatePropertyAll(
          EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        ),
        backgroundColor: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.disabled)
              ? border
              : s.contains(WidgetState.pressed)
              ? pressed
              : accent,
        ),
        foregroundColor: const WidgetStatePropertyAll(ink),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: actionText,
        minimumSize: const Size(48, 48),
      ),
    ),
    iconButtonTheme: IconButtonThemeData(
      style: IconButton.styleFrom(minimumSize: const Size(48, 48)),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: Colors.white,
      selectedColor: actionText,
      side: const BorderSide(color: border),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 9),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: Colors.white,
      surfaceTintColor: Colors.transparent,
      indicatorColor: soft,
      height: 76,
      labelTextStyle: WidgetStateProperty.resolveWith(
        (s) => TextStyle(
          fontFamily: 'NotoSansKR',
          fontSize: 12,
          fontWeight: s.contains(WidgetState.selected)
              ? FontWeight.w700
              : FontWeight.w500,
          color: s.contains(WidgetState.selected) ? actionText : muted,
        ),
      ),
      iconTheme: WidgetStateProperty.resolveWith(
        (s) => IconThemeData(
          color: s.contains(WidgetState.selected) ? accent : muted,
        ),
      ),
    ),
    dividerTheme: const DividerThemeData(color: border),
    listTileTheme: const ListTileThemeData(
      iconColor: actionText,
      textColor: ink,
      minVerticalPadding: 12,
    ),
    dialogTheme: const DialogThemeData(
      backgroundColor: background,
      surfaceTintColor: Colors.transparent,
    ),
    snackBarTheme: const SnackBarThemeData(
      backgroundColor: ink,
      contentTextStyle: TextStyle(color: Colors.white),
    ),
  );
}

class WarmBadge extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color, background;
  const WarmBadge({
    super.key,
    required this.label,
    required this.icon,
    this.color = Warm.muted,
    this.background = Warm.background,
  });
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
    decoration: BoxDecoration(
      color: background,
      borderRadius: BorderRadius.circular(8),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 5),
        Flexible(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ),
      ],
    ),
  );
}
