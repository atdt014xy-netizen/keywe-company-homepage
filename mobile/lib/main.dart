import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import 'config.dart';
import 'model.dart';
import 'repository.dart';
import 'strings.dart';
import 'warm_theme.dart';

// Keep dialog controllers alive until the closing transition has unmounted fields.
Future<T?> settledDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
}) async {
  final route = DialogRoute<T>(context: context, builder: builder);
  final result = await Navigator.of(context, rootNavigator: true).push(route);
  await route.completed;
  return result;
}

@pragma('vm:entry-point')
Future<void> backgroundMessage(RemoteMessage message) async {
  await Firebase.initializeApp(options: firebaseOptions);
  // Durable inbox belongs to the server. Never mutate local inventory from push data.
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  String? error;
  if (!demoMode) {
    try {
      await Firebase.initializeApp(options: firebaseOptions);
      FirebaseMessaging.onBackgroundMessage(backgroundMessage);
    } catch (_) {
      error = 'initialError';
    }
  }
  runApp(
    StoreControlApp(
      repository: demoMode ? DemoRepository() : LiveRepository(),
      initialError: error,
    ),
  );
}

const navy = Warm.ink,
    blue = Warm.accent,
    orange = Warm.low,
    red = Warm.out,
    green = Warm.good;

class StoreControlApp extends StatefulWidget {
  final Repository repository;
  final String? initialError;
  const StoreControlApp({
    super.key,
    required this.repository,
    this.initialError,
  });
  @override
  State<StoreControlApp> createState() => _StoreControlAppState();
}

class _StoreControlAppState extends State<StoreControlApp>
    with WidgetsBindingObserver {
  Repository get repo => widget.repository;
  final messenger = GlobalKey<ScaffoldMessengerState>();
  String lang = 'ko', filter = 'all', query = '', demoState = 'normal';
  int tab = 0;
  bool attentionOnly = false;
  bool unreadOnly = false;
  final searchController = TextEditingController();
  bool loading = true, busy = false, login = false;
  String? failure, selected;
  String permission = 'pushUnknown';
  RemoteMessage? pending;
  String? token;
  final seenPush = <String>{};
  final subscriptions = <StreamSubscription<dynamic>>[];
  String t(String key) =>
      translations[lang]?[key] ?? translations['en']?[key] ?? key;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    unawaited(boot());
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    searchController.dispose();
    for (final s in subscriptions) {
      unawaited(s.cancel());
    }
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && !login && repo.shop.isNotEmpty) {
      unawaited(refresh());
    }
  }

  Future<void> boot() async {
    if (widget.initialError != null) {
      setState(() {
        failure = widget.initialError;
        loading = false;
      });
      return;
    }
    if (repo is LiveRepository) {
      subscriptions.add(FirebaseMessaging.onMessageOpenedApp.listen(openPush));
      subscriptions.add(
        FirebaseMessaging.onMessage.listen((message) {
          notice(t('notification'));
          unawaited(refresh());
        }),
      );
      subscriptions.add(
        FirebaseMessaging.instance.onTokenRefresh.listen((value) {
          token = value;
          if (repo.shop.isNotEmpty && !login) {
            unawaited(
              perform(
                () => (repo as LiveRepository).registerToken(value),
                notify: false,
              ),
            );
          }
        }),
      );
      pending = await FirebaseMessaging.instance.getInitialMessage();
      if (FirebaseAuth.instance.currentUser == null) {
        if (mounted) {
          setState(() {
            login = true;
            loading = false;
          });
        }
        return;
      }
      try {
        await (repo as LiveRepository).restore();
      } catch (e) {
        if (mounted) {
          setState(() {
            login = true;
            failure = t('loginExpired');
            loading = false;
          });
        }
        return;
      }
    }
    await refresh();
    if (repo is LiveRepository && !login && repo.shop.isNotEmpty) {
      await perform(restorePush, notify: false);
    }
    if (pending != null) await openPush(pending!);
  }

  Future<void> restorePush() async {
    final state = await FirebaseMessaging.instance.getNotificationSettings();
    if (mounted) {
      setState(
        () => permission =
            state.authorizationStatus == AuthorizationStatus.authorized
            ? 'pushGranted'
            : state.authorizationStatus == AuthorizationStatus.denied
            ? 'denied'
            : 'pushUnknown',
      );
    }
    if (state.authorizationStatus == AuthorizationStatus.authorized) {
      token = await FirebaseMessaging.instance.getToken();
      if (token != null) await (repo as LiveRepository).registerToken(token!);
    }
  }

  Future<void> refresh() async {
    if (repo.shop.isEmpty) {
      if (mounted) {
        setState(() {
          loading = false;
        });
      }
      return;
    }
    if (mounted) {
      setState(() {
        loading = true;
        failure = null;
      });
    }
    try {
      await repo.load();
      if (mounted) {
        setState(() {
          loading = false;
        });
      }
    } on SignInRequired {
      if (mounted) {
        setState(() {
          login = true;
          loading = false;
          failure = t('loginExpired');
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          failure = e.toString();
          loading = false;
        });
      }
    }
  }

  void notice(String text) {
    messenger.currentState?.showSnackBar(SnackBar(content: Text(text)));
  }

  Future<void> perform(
    Future<void> Function() action, {
    bool notify = true,
  }) async {
    if (busy) return;
    if (mounted) setState(() => busy = true);
    try {
      await action();
      if (mounted) setState(() {});
      if (notify) notice(t('saved'));
    } on SignInRequired {
      if (mounted) setState(() => login = true);
      notice(t('loginExpired'));
    } catch (e) {
      notice(e.toString());
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  Future<void> openPush(RemoteMessage message) async {
    pending = message;
    if (repo is! LiveRepository || login) return;
    final live = repo as LiveRepository;
    final shop = message.data['shop'];
    if (shop is! String) return;
    try {
      final stores = await live.request('stores');
      if (!(stores['stores'] as List).any((s) => s['shop'] == shop)) return;
      final key = message.data['alertId'] ?? message.messageId;
      if (key != null && seenPush.contains(key)) return;
      live.shop = shop;
      await live.storage.write(key: 'live_shop', value: shop);
      await live.load();
      if (key != null) seenPush.add(key);
      if (mounted) {
        setState(() {
          tab = 1;
          selected = message.data['itemId'];
          pending = null;
        });
      }
    } on SignInRequired {
      if (mounted) setState(() => login = true);
    } catch (e) {
      notice(e.toString());
    }
  }

  Future<void> enablePush() async {
    if (repo.demo) {
      notice(t('demoHelp'));
      return;
    }
    final result = await FirebaseMessaging.instance.requestPermission();
    if (mounted) {
      setState(
        () => permission =
            result.authorizationStatus == AuthorizationStatus.authorized
            ? 'pushGranted'
            : 'denied',
      );
    }
    if (result.authorizationStatus == AuthorizationStatus.authorized) {
      token = await FirebaseMessaging.instance.getToken();
      if (token != null) await (repo as LiveRepository).registerToken(token!);
    }
  }

  String date(String? value) {
    if (value == null) return t('never');
    final d = DateTime.tryParse(value);
    return d == null
        ? value
        : DateFormat(lang == 'ko' ? 'M월 d일 HH:mm' : 'MMM d, HH:mm')
              .format(d.toLocal());
  }

  Color color(String status) => switch (status) {
    'out' => red,
    'low' => orange,
    'healthy' => green,
    _ => Warm.muted,
  };
  IconData icon(String status) => switch (status) {
    'out' => Icons.error_outline,
    'low' => Icons.warning_amber_rounded,
    'healthy' => Icons.check_circle_outline,
    _ => Icons.remove_circle_outline,
  };
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      scaffoldMessengerKey: messenger,
      title: 'StoreControl',
      locale: Locale(lang),
      supportedLocales: const [Locale('en'), Locale('ko')],
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      builder: (context, child) => ColoredBox(
        color: const Color(0xffeee5d9),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Padding(
              padding: const EdgeInsets.all(Warm.outerPadding),
              child: LayoutBuilder(
                builder: (context, constraints) => MediaQuery(
                  data: MediaQuery.of(context)
                      .copyWith(size: constraints.biggest),
                  child: ClipRect(child: child ?? const SizedBox.shrink()),
                ),
              ),
            ),
          ),
        ),
      ),
      theme: Warm.theme,
      home: Builder(
        builder: (context) => Scaffold(
          appBar: AppBar(
            titleSpacing: Warm.pagePadding,
            title: const Text(
              'StoreControl',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                letterSpacing: -1,
              ),
            ),
            actions: [
              TextButton.icon(
                key: const ValueKey('language'),
                onPressed: () =>
                    setState(() => lang = lang == 'en' ? 'ko' : 'en'),
                icon: const Icon(Icons.translate, size: 18),
                label: Text(lang == 'ko' ? '한국어' : 'EN'),
              ),
              if (selected != null)
                IconButton(
                  tooltip: t('back'),
                  onPressed: () => setState(() => selected = null),
                  icon: const Icon(Icons.close),
                ),
              const SizedBox(width: 6),
            ],
          ),
          body: SafeArea(
            top: false,
            bottom: false,
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    Warm.pagePadding,
                    2,
                    Warm.pagePadding,
                    10,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        spacing: 8,
                        runSpacing: 6,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Text(
                            repo.shop.isEmpty ? 'KEYWE COMPANY' : repo.shop,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                            ),
                          ),
                          connectionBadge(),
                        ],
                      ),
                      const SizedBox(height: 5),
                      Text(
                        t(repo.demo ? 'demo' : 'live'),
                        style: const TextStyle(color: Warm.muted, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                if (busy) const LinearProgressIndicator(),
                Expanded(child: body(context)),
              ],
            ),
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: const {0: 0, 3: 1, 1: 2, 2: 3}[tab]!,
            onDestinationSelected: (i) => setState(() {
              tab = const [0, 3, 1, 2][i];
              selected = null;
              unreadOnly = false;
            }),
            destinations: [
              NavigationDestination(
                icon: const Icon(Icons.dashboard_outlined),
                selectedIcon: const Icon(Icons.dashboard),
                label: t('overview'),
              ),
              NavigationDestination(
                icon: const Icon(Icons.shopping_bag_outlined),
                selectedIcon: const Icon(Icons.shopping_bag),
                label: t('products'),
              ),
              NavigationDestination(
                icon: Badge(
                  isLabelVisible: repo.alerts.any((a) => !a.seen),
                  child: const Icon(Icons.notifications_outlined),
                ),
                label: t('alerts'),
              ),
              NavigationDestination(
                icon: const Icon(Icons.tune),
                label: t('settings'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget body(BuildContext context) {
    if (widget.initialError != null) {
      return statePanel(Icons.settings_outlined, t('initialError'));
    }
    if (login) return loginForm();
    if (repo is LiveRepository && repo.shop.isEmpty) return connectForm();
    if (selected != null) {
      final found = repo.items.where((i) => i.id == selected);
      if (found.isNotEmpty) return detail(context, found.first);
    }
    if (tab == 2) return settings(context);
    if (loading || demoState == 'loading') {
      return statePanel(Icons.hourglass_top, t('loading'), spinning: true);
    }
    if (failure != null || demoState == 'offline') {
      return statePanel(
        Icons.cloud_off_outlined,
        t('offlineHelp'),
        action: () => setState(() {
          demoState = 'normal';
          unawaited(refresh());
        }),
      );
    }
    return tab == 0 || tab == 3 ? overview(products: tab == 3) : inbox(context);
  }

  Widget statePanel(
    IconData icon,
    String text, {
    VoidCallback? action,
    bool spinning = false,
  }) => SingleChildScrollView(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (spinning)
            const CircularProgressIndicator()
          else
            Icon(icon, size: 44, color: Warm.actionText),
          const SizedBox(height: 20),
          Text(text, textAlign: TextAlign.center),
          if (action != null)
            Padding(
              padding: const EdgeInsets.only(top: 20),
              child: FilledButton(onPressed: action, child: Text(t('retry'))),
            ),
        ],
      ),
    ),
  );
  Widget heading(String title, String subtitle) => Padding(
    padding: const EdgeInsets.only(bottom: 20),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 6),
        Text(subtitle, style: const TextStyle(color: Warm.muted, height: 1.5)),
      ],
    ),
  );
  Widget connectionBadge() {
    final issue =
        failure != null || repo.error != null || demoState == 'offline';
    final connected =
        !repo.demo &&
        !login &&
        repo.shop.isNotEmpty &&
        repo.synced != null &&
        !repo.stale &&
        !issue;
    final label = repo.demo
        ? t('notConnected')
        : issue
        ? t('connectionCheck')
        : connected
        ? t('connected')
        : t('connectionPending');
    return WarmBadge(
      label: label,
      icon: connected ? Icons.check_circle_outline : Icons.cloud_off_outlined,
      color: connected ? Warm.good : Warm.muted,
      background: connected ? Warm.goodSoft : Warm.soft,
    );
  }

  Widget status(StockItem item) => WarmBadge(
    label:
        '${t(item.status)}${item.quantity == null ? '' : ' · ${item.quantity}${lang == 'ko' ? '개' : ' units'}'}',
    icon: icon(item.status),
    color: color(item.status),
    background: item.status == 'out'
        ? Warm.outSoft
        : item.status == 'low'
        ? Warm.lowSoft
        : item.status == 'healthy'
        ? Warm.goodSoft
        : Warm.background,
  );
  IconData demoProductIcon(String title) {
    if (title.contains('백') || title.contains('파우치')) {
      return Icons.shopping_bag_outlined;
    }
    if (title.contains('머그') || title.contains('커피') || title.contains('드리퍼')) {
      return Icons.coffee_outlined;
    }
    if (title.contains('티셔츠') || title.contains('삭스')) {
      return Icons.checkroom_outlined;
    }
    if (title.contains('노트') ||
        title.contains('플래너') ||
        title.contains('북마크')) {
      return Icons.menu_book_outlined;
    }
    if (title.contains('캔들')) return Icons.local_fire_department_outlined;
    if (title.contains('기프트') || title.contains('선물')) {
      return Icons.card_giftcard_outlined;
    }
    if (title.contains('워시') || title.contains('스프레이')) {
      return Icons.spa_outlined;
    }
    if (title.contains('텀블러') || title.contains('베이스')) {
      return Icons.local_drink_outlined;
    }
    return Icons.home_outlined;
  }

  Widget picture(StockItem item, {double size = 76}) {
    // Exact variant matches only; never reuse a different product's photograph.
    final asset = repo.demo
        ? const {
            'demo-1': 'tote',
            'demo-9': 'mug',
            'demo-21': 'tumbler',
          }[item.id]
        : null;
    Widget fallback() => Semantics(
      label: t('noImage'),
      child: Container(
        color: Warm.soft,
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              repo.demo
                  ? demoProductIcon(item.title)
                  : Icons.image_not_supported_outlined,
              size: size * .32,
              color: Warm.muted,
            ),
            if (size >= 76)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  t('noImage'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 9, color: Warm.muted),
                ),
              ),
          ],
        ),
      ),
    );
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: SizedBox(
        width: size,
        height: size,
        child: asset != null
            ? Image.asset(
                'assets/products/$asset.png',
                fit: BoxFit.cover,
                cacheWidth: (size * 3).round(),
                excludeFromSemantics: true,
                errorBuilder: (_, e, st) => fallback(),
              )
            : item.image == null
            ? fallback()
            : Image.network(
                item.image!,
                fit: BoxFit.cover,
                excludeFromSemantics: true,
                errorBuilder: (_, e, st) => fallback(),
                loadingBuilder: (_, child, loading) =>
                    loading == null ? child : fallback(),
              ),
      ),
    );
  }

  List<StockItem> get visibleItems {
    final values = demoState == 'blank'
        ? <StockItem>[]
        : repo.items
              .where(
                (i) =>
                    (filter == 'all' || i.status == filter) &&
                    (!attentionOnly ||
                        i.status == 'out' ||
                        i.status == 'low') &&
                    '${i.title} ${i.variant}'.toLowerCase().contains(
                      query.toLowerCase(),
                    ),
              )
              .toList();
    const rank = {'out': 0, 'low': 1, 'healthy': 2, 'untracked': 3};
    values.sort((a, b) => rank[a.status]!.compareTo(rank[b.status]!));
    return values;
  }

  Widget productCard(StockItem item) => Semantics(
    container: true,
    button: true,
    label:
        '${item.title}, ${item.variant}, ${t(item.status)}, ${item.quantity ?? '—'}, ${t('detail')}',
    child: Card(
      key: ValueKey('product-${item.id}'),
      child: InkWell(
        onTap: () => setState(() => selected = item.id),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              picture(item),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      item.variant,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: Warm.muted, fontSize: 12),
                    ),
                    const SizedBox(height: 8),
                    status(item),
                  ],
                ),
              ),
              const SizedBox(width: 4),
              const Icon(Icons.chevron_right, size: 20, color: Warm.muted),
            ],
          ),
        ),
      ),
    ),
  );

  Widget sectionTitle(String title, {VoidCallback? onView}) => Row(
    children: [
      Expanded(
        child: Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
        ),
      ),
      if (onView != null)
        TextButton(onPressed: onView, child: Text(t('viewAll'))),
    ],
  );

  Widget overview({bool products = false}) {
    final items = visibleItems;
    final inventory = demoState == 'blank' ? <StockItem>[] : repo.items;
    final attention = inventory
        .where((i) => i.status == 'low' || i.status == 'out')
        .length;
    final unread = repo.alerts.where((a) => !a.seen).length;
    final recent = [...repo.alerts]..sort((a, b) => b.time.compareTo(a.time));
    final shown = products ? items : items.take(3).toList();
    return RefreshIndicator(
      onRefresh: refresh,
      child: ListView(
        key: ValueKey(products ? 'products-list' : 'overview-list'),
        padding: const EdgeInsets.fromLTRB(
          Warm.pagePadding,
          14,
          Warm.pagePadding,
          28,
        ),
        children: [
          heading(
            t(products ? 'products' : 'storeOverview'),
            '${t('synced')}: ${date(repo.synced)}',
          ),
          if (repo.stale || repo.error != null)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(t('stale')),
                    TextButton.icon(
                      onPressed: refresh,
                      icon: const Icon(Icons.refresh),
                      label: Text(t('retry')),
                    ),
                  ],
                ),
              ),
            ),
          if (!products) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 20),
              decoration: BoxDecoration(
                color: Warm.soft,
                border: Border.all(color: Warm.border),
                borderRadius: BorderRadius.circular(18),
              ),
              child: IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    stat(
                      t('low'),
                      inventory.where((i) => i.status == 'low').length,
                      Warm.low,
                      onTap: () => openStockList('low'),
                    ),
                    const VerticalDivider(width: 1),
                    stat(
                      t('out'),
                      inventory.where((i) => i.status == 'out').length,
                      Warm.out,
                      onTap: () => openStockList('out'),
                    ),
                    const VerticalDivider(width: 1),
                    stat(
                      t('unreadAlerts'),
                      unread,
                      Warm.actionText,
                      onTap: () => setState(() {
                        tab = 1;
                        selected = null;
                        unreadOnly = true;
                      }),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),
            Material(
              color: attention == 0 ? Warm.goodSoft : Warm.accent,
              borderRadius: BorderRadius.circular(16),
              child: InkWell(
                key: const ValueKey('attention-panel'),
                borderRadius: BorderRadius.circular(16),
                onTap: attention == 0
                    ? null
                    : () => setState(() {
                        tab = 3;
                        attentionOnly = true;
                        filter = 'all';
                        query = '';
                        searchController.clear();
                      }),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(
                        attention == 0
                            ? Icons.check_circle_outline
                            : Icons.warning_amber_rounded,
                        color: Warm.ink,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          attention == 0
                              ? t('allHealthy')
                              : t('attentionCount')
                                    .replaceAll('{n}', '$attention'),
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            color: Warm.ink,
                          ),
                        ),
                      ),
                      if (attention > 0)
                        const Icon(
                          Icons.arrow_forward,
                          size: 20,
                          color: Warm.ink,
                        ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 22),
          ],
          TextField(
            key: const ValueKey('product-search'),
            controller: searchController,
            onChanged: (s) => setState(() => query = s),
            decoration: InputDecoration(
              hintText: t('search'),
              labelText: t('search'),
              prefixIcon: const Icon(Icons.search, size: 21),
              suffixIcon: query.isEmpty
                  ? null
                  : IconButton(
                      tooltip: t('clearSearch'),
                      onPressed: () => setState(() {
                        query = '';
                        searchController.clear();
                      }),
                      icon: const Icon(Icons.close),
                    ),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            runSpacing: 2,
            children: ['all', 'low', 'out', 'healthy']
                .map(
                  (s) => ChoiceChip(
                    key: ValueKey('filter-$s'),
                    label: Text(t(s)),
                    selected: !attentionOnly && filter == s,
                    showCheckmark: false,
                    labelStyle: TextStyle(
                      color: !attentionOnly && filter == s
                          ? Colors.white
                          : Warm.muted,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                    onSelected: (_) => setState(() {
                      filter = s;
                      attentionOnly = false;
                    }),
                  ),
                )
                .toList(),
          ),
          if (attentionOnly)
            InputChip(
              label: Text(t('attention')),
              onPressed: () => setState(() => attentionOnly = false),
              onDeleted: () => setState(() => attentionOnly = false),
            ),
          const SizedBox(height: 16),
          sectionTitle(
            t('inventoryCount').replaceAll('{n}', '${items.length}'),
            onView: products ? null : () => setState(() => tab = 3),
          ),
          const SizedBox(height: 10),
          if (items.isEmpty)
            statePanel(
              Icons.search_off,
              query.isNotEmpty ? t('noResults') : t('empty'),
            ),
          ...shown.map(productCard),
          if (!products) ...[
            const SizedBox(height: 14),
            sectionTitle(
              t('recentAlerts'),
              onView: () => setState(() {
                tab = 1;
                unreadOnly = false;
              }),
            ),
            const SizedBox(height: 10),
            if (recent.isEmpty)
              statePanel(Icons.notifications_none, t('noAlerts')),
            ...recent
                .take(3)
                .map(
                  (a) => Card(
                    child: ListTile(
                      leading: Icon(icon(a.kind), color: color(a.kind)),
                      title: Text(
                        a.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      subtitle: Text(
                        '${t(a.kind)} · ${date(a.time)}\n${t(a.seen ? 'reviewed' : 'unread')}',
                        style: const TextStyle(color: Warm.muted, fontSize: 11),
                      ),
                      trailing: a.seen
                          ? const Icon(Icons.done, color: Warm.good, size: 18)
                          : const Badge(smallSize: 7),
                      onTap: () => setState(() {
                        tab = 1;
                        unreadOnly = false;
                      }),
                    ),
                  ),
                ),
          ],
        ],
      ),
    );
  }

  void openStockList(String status) => setState(() {
    tab = 3;
    selected = null;
    filter = status;
    attentionOnly = false;
    query = '';
    searchController.clear();
  });

  Widget stat(
    String label,
    int value,
    Color c, {
    required VoidCallback onTap,
  }) => Expanded(
    child: Semantics(
      button: true,
      label: '$label, $value, ${t('viewAll')}',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          key: ValueKey('summary-$label'),
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  '$value',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    color: c,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 7),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Warm.muted,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
  Widget detail(BuildContext context, StockItem item) => ListView(
    padding: const EdgeInsets.fromLTRB(
      Warm.pagePadding,
      14,
      Warm.pagePadding,
      28,
    ),
    children: [
      heading(t('detail'), item.location),
      Card(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: picture(item, size: 200)),
              const SizedBox(height: 20),
              Text(
                item.title,
                style: const TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Text(item.variant),
              const SizedBox(height: 18),
              status(item),
              const SizedBox(height: 20),
              Text(t('available')),
              Text(
                item.quantity?.toString() ?? '—',
                style: TextStyle(
                  fontSize: 64,
                  fontWeight: FontWeight.w800,
                  color: color(item.status),
                ),
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.schedule, size: 17, color: Warm.muted),
                  const SizedBox(width: 7),
                  Expanded(
                    child: Text(
                      '${t('updated')}: ${date(item.updated)}',
                      style: const TextStyle(color: Warm.muted, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      Card(
        child: Column(
          children: [
            ListTile(
              title: Text(t('threshold')),
              trailing: Text(
                '${item.threshold}',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              onTap: () => editThreshold(context, item),
            ),
            SwitchListTile(
              title: Text(t('enabled')),
              value: item.enabled,
              onChanged: busy
                  ? null
                  : (v) =>
                        perform(() => repo.updateItem(item, item.threshold, v)),
            ),
          ],
        ),
      ),
      FilledButton.icon(
        onPressed: () async {
          if (repo.demo) {
            notice(t('demoAdmin'));
            return;
          }
          final id = item.productId.split('/').last;
          final uri = Uri.https(repo.shop, '/admin/products/$id');
          if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
            notice(t('error'));
          }
        },
        icon: const Icon(Icons.open_in_new),
        label: Text(t('admin')),
      ),
      const SizedBox(height: 20),
      Text(t('later')),
      const SizedBox(height: 10),
      Text(t('discountHelp')),
    ],
  );
  Future<void> editThreshold(BuildContext context, StockItem item) async {
    final controller = TextEditingController(text: '${item.threshold}');
    final value = await settledDialog<int>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text(t('threshold')),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        ),
        actions: [
          TextButton(
            onPressed: () {
              final n = int.tryParse(controller.text);
              if (n != null && n >= 1 && n <= 100000) Navigator.pop(c, n);
            },
            child: Text(t('save')),
          ),
        ],
      ),
    );
    controller.dispose();
    if (value != null) {
      await perform(() => repo.updateItem(item, value, item.enabled));
    }
  }

  Widget inbox(BuildContext context) {
    final shownAlerts = repo.alerts
        .where((a) => !unreadOnly || !a.seen)
        .toList();
    return ListView(
      padding: const EdgeInsets.fromLTRB(
        Warm.pagePadding,
        14,
        Warm.pagePadding,
        28,
      ),
      children: [
        heading(
          t('alerts'),
          '${repo.alerts.where((a) => !a.seen).length} ${t('unread')}',
        ),
        if (unreadOnly)
          Align(
            alignment: Alignment.centerLeft,
            child: InputChip(
              label: Text(t('unreadAlerts')),
              onPressed: () => setState(() => unreadOnly = false),
              onDeleted: () => setState(() => unreadOnly = false),
            ),
          ),
        if (shownAlerts.isEmpty)
          statePanel(Icons.check_circle_outline, t('noAlerts')),
        ...shownAlerts.map(
          (a) => Card(
            key: ValueKey('alert-${a.id}'),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(icon(a.kind), color: color(a.kind)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          a.title,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      Icon(
                        a.seen ? Icons.done : Icons.circle,
                        size: a.seen ? 20 : 8,
                        color: a.seen ? green : Warm.accent,
                        semanticLabel: t(a.seen ? 'reviewed' : 'unread'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('${date(a.time)} · ${a.location ?? repo.shop}'),
                  Text(
                    '${t('occurred')}: ${a.quantity ?? '—'}   ·   ${t('current')}: ${a.current ?? '—'}',
                  ),
                  if (a.note.isNotEmpty) Text(a.note),
                  Wrap(
                    spacing: 8,
                    children: [
                      if (a.itemId != null)
                        TextButton(
                          onPressed: () => setState(() => selected = a.itemId),
                          child: Text(t('detail')),
                        ),
                      TextButton(
                        onPressed: () => acknowledge(context, a),
                        child: Text(t('ack')),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> acknowledge(BuildContext context, AlertEntry alert) async {
    final controller = TextEditingController(text: alert.note);
    final note = await settledDialog<String>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text(t('note')),
        content: TextField(
          controller: controller,
          maxLength: 1000,
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(c, controller.text),
            child: Text(t('save')),
          ),
        ],
      ),
    );
    controller.dispose();
    if (note != null) await perform(() => repo.acknowledge(alert, note));
  }

  Widget settings(BuildContext context) => ListView(
    padding: const EdgeInsets.fromLTRB(
      Warm.pagePadding,
      14,
      Warm.pagePadding,
      28,
    ),
    children: [
      heading(t('settings'), repo.shop),
      Card(
        child: Column(
          children: [
            ListTile(
              leading: const Icon(Icons.store_outlined),
              title: Text(t('account')),
              subtitle: Text(
                repo.demo
                    ? t('demoHelp')
                    : FirebaseAuth.instance.currentUser?.email ?? '',
              ),
            ),
            ListTile(title: Text(t('free')), subtitle: Text(t('later'))),
          ],
        ),
      ),
      Card(
        child: Column(
          children: [
            ListTile(title: Text(t('push')), subtitle: Text(t(permission))),
            ListTile(
              leading: const Icon(Icons.notifications_active_outlined),
              title: Text(t('permission')),
              onTap: () => perform(enablePush, notify: false),
            ),
            ListTile(
              leading: const Icon(Icons.send_outlined),
              title: Text(t('test')),
              onTap: () => perform(() async {
                await repo.testPush();
                notice(t(repo.demo ? 'demoAction' : 'queued'));
              }, notify: false),
            ),
          ],
        ),
      ),
      Card(
        child: Column(
          children: [
            ListTile(
              title: Text(t('quiet')),
              subtitle: Text(
                '${repo.settings['timezone']} · ${clockText(repo.settings['quiet_start'] as int)}–${clockText(repo.settings['quiet_end'] as int)}',
              ),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => editSettings(context),
            ),
            ListTile(
              title: Text(t('threshold')),
              trailing: Text('${repo.settings['threshold']}'),
              onTap: () => editSettings(context),
            ),
            ListTile(
              leading: const Icon(Icons.sync),
              title: Text(t('sync')),
              onTap: () => perform(() async {
                await repo.sync();
                notice(t(repo.demo ? 'demoAction' : 'queued'));
              }, notify: false),
            ),
          ],
        ),
      ),
      if (repo.demo) ...[
        Text(t('demoStates')),
        Wrap(
          spacing: 8,
          children: ['normal', 'offline', 'blank', 'loading']
              .map(
                (s) => ChoiceChip(
                  label: Text(t(s)),
                  selected: demoState == s,
                  labelStyle: TextStyle(
                    color: demoState == s ? Colors.white : Warm.muted,
                  ),
                  onSelected: (_) => setState(() => demoState = s),
                ),
              )
              .toList(),
        ),
      ] else ...[
        SelectableText(
          '${t('uid')}: ${FirebaseAuth.instance.currentUser?.uid ?? ''}',
        ),
        TextButton(
          onPressed: () => perform(() async {
            await (repo as LiveRepository).logout(token);
            if (mounted) setState(() => login = true);
          }),
          child: Text(t('logout')),
        ),
        TextButton(
          onPressed: () => perform(() async {
            await (repo as LiveRepository).logout(token, disconnect: true);
            if (mounted) setState(() => login = true);
          }),
          child: Text(t('disconnect')),
        ),
      ],
      const SizedBox(height: 20),
      Text(t('delete'), style: const TextStyle(fontWeight: FontWeight.bold)),
      Text(t('deleteHelp')),
      const SizedBox(height: 24),
      const Text(
        'KEYWE COMPANY',
        style: TextStyle(fontSize: 12, letterSpacing: 1.4, color: Warm.muted),
      ),
    ],
  );
  String clockText(int minutes) =>
      '${(minutes ~/ 60).toString().padLeft(2, '0')}:${(minutes % 60).toString().padLeft(2, '0')}';
  int? minutes(String s) {
    final m = RegExp(r'^(\d{2}):(\d{2})$').firstMatch(s);
    if (m == null) return null;
    final h = int.parse(m[1]!), n = int.parse(m[2]!);
    return h < 24 && n < 60 ? h * 60 + n : null;
  }

  Future<void> editSettings(BuildContext context) async {
    final zone = TextEditingController(
          text: repo.settings['timezone'] as String,
        ),
        start = TextEditingController(
          text: clockText(repo.settings['quiet_start'] as int),
        ),
        end = TextEditingController(
          text: clockText(repo.settings['quiet_end'] as int),
        ),
        threshold = TextEditingController(
          text: '${repo.settings['threshold']}',
        );
    bool quiet = repo.settings['quiet_enabled'] == true;
    String? validation;
    final value = await settledDialog<Map<String, dynamic>>(
      context: context,
      builder: (c) => StatefulBuilder(
        builder: (c, update) => AlertDialog(
          title: Text(t('settings')),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(t('settingsHelp')),
                const SizedBox(height: 12),
                TextField(
                  controller: threshold,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: t('threshold')),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: zone,
                  decoration: InputDecoration(labelText: t('timezone')),
                ),
                SwitchListTile(
                  title: Text(t('quiet')),
                  value: quiet,
                  onChanged: (v) => update(() => quiet = v),
                ),
                TextField(
                  controller: start,
                  decoration: InputDecoration(labelText: t('start')),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: end,
                  decoration: InputDecoration(labelText: t('end')),
                ),
                if (validation != null)
                  Text(validation!, style: const TextStyle(color: red)),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                final a = minutes(start.text),
                    b = minutes(end.text),
                    n = int.tryParse(threshold.text);
                if (a == null ||
                    b == null ||
                    n == null ||
                    n < 1 ||
                    n > 100000 ||
                    zone.text.isEmpty) {
                  update(() => validation = t('error'));
                  return;
                }
                Navigator.pop(c, {
                  'threshold': n,
                  'timezone': zone.text,
                  'quiet_start': a,
                  'quiet_end': b,
                  'quiet_enabled': quiet,
                });
              },
              child: Text(t('save')),
            ),
          ],
        ),
      ),
    );
    for (final c in [zone, start, end, threshold]) {
      c.dispose();
    }
    if (value != null) await perform(() => repo.saveSettings(value));
  }

  Widget loginForm() => CredentialsForm(
    title: t('signin'),
    emailLabel: t('email'),
    passwordLabel: t('password'),
    signupLabel: t('signup'),
    busy: busy,
    onSubmit: (email, password, signup) => perform(() async {
      if (signup) {
        final credential = await FirebaseAuth.instance
            .createUserWithEmailAndPassword(email: email, password: password);
        await credential.user!.sendEmailVerification();
        await FirebaseAuth.instance.signOut();
        notice(t('verify'));
        return;
      }
      final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      if (!credential.user!.emailVerified) {
        await FirebaseAuth.instance.signOut();
        notice(t('verify'));
        return;
      }
      await (repo as LiveRepository).restore();
      if (mounted) setState(() => login = false);
      await refresh();
      if (repo.shop.isNotEmpty) await restorePush();
      if (pending != null) await openPush(pending!);
    }, notify: false),
  );
  Widget connectForm() => ConnectionForm(
    title: t('connect'),
    help: t('linkHelp'),
    uidLabel: t('uid'),
    uid: FirebaseAuth.instance.currentUser?.uid ?? '',
    domainLabel: t('domain'),
    codeLabel: t('code'),
    busy: busy,
    onSubmit: (shop, code) => perform(() async {
      await (repo as LiveRepository).connect(shop, code);
      await refresh();
      await restorePush();
      if (pending != null) await openPush(pending!);
    }),
  );
}

class CredentialsForm extends StatefulWidget {
  final String title, emailLabel, passwordLabel, signupLabel;
  final bool busy;
  final void Function(String, String, bool) onSubmit;
  const CredentialsForm({
    super.key,
    required this.title,
    required this.emailLabel,
    required this.passwordLabel,
    required this.signupLabel,
    required this.busy,
    required this.onSubmit,
  });
  @override
  State<CredentialsForm> createState() => _CredentialsState();
}

class _CredentialsState extends State<CredentialsForm> {
  final email = TextEditingController(), password = TextEditingController();
  @override
  void dispose() {
    email.dispose();
    password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(24),
    children: [
      Text(
        widget.title,
        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 24),
      TextField(
        controller: email,
        keyboardType: TextInputType.emailAddress,
        decoration: InputDecoration(labelText: widget.emailLabel),
      ),
      const SizedBox(height: 16),
      TextField(
        controller: password,
        obscureText: true,
        decoration: InputDecoration(labelText: widget.passwordLabel),
      ),
      const SizedBox(height: 24),
      FilledButton(
        onPressed: widget.busy
            ? null
            : () => widget.onSubmit(email.text.trim(), password.text, false),
        child: Text(widget.title),
      ),
      TextButton(
        onPressed: widget.busy
            ? null
            : () => widget.onSubmit(email.text.trim(), password.text, true),
        child: Text(widget.signupLabel),
      ),
    ],
  );
}

class ConnectionForm extends StatefulWidget {
  final String title, help, uidLabel, uid, domainLabel, codeLabel;
  final bool busy;
  final void Function(String, String) onSubmit;
  const ConnectionForm({
    super.key,
    required this.title,
    required this.help,
    required this.uidLabel,
    required this.uid,
    required this.domainLabel,
    required this.codeLabel,
    required this.busy,
    required this.onSubmit,
  });
  @override
  State<ConnectionForm> createState() => _ConnectionState();
}

class _ConnectionState extends State<ConnectionForm> {
  final shop = TextEditingController(), code = TextEditingController();
  @override
  void dispose() {
    shop.dispose();
    code.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(24),
    children: [
      Text(
        widget.title,
        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 16),
      Text(widget.help),
      const SizedBox(height: 16),
      SelectableText('${widget.uidLabel}: ${widget.uid}'),
      const SizedBox(height: 24),
      TextField(
        controller: shop,
        autocorrect: false,
        decoration: InputDecoration(labelText: widget.domainLabel),
      ),
      const SizedBox(height: 16),
      TextField(
        controller: code,
        autocorrect: false,
        decoration: InputDecoration(labelText: widget.codeLabel),
      ),
      const SizedBox(height: 24),
      FilledButton(
        onPressed: widget.busy
            ? null
            : () => widget.onSubmit(
                shop.text.trim().toLowerCase(),
                code.text.trim(),
              ),
        child: Text(widget.title),
      ),
    ],
  );
}
