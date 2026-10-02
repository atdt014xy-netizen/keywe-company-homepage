import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import 'config.dart';
import 'demo_catalog.dart';
import 'model.dart';

abstract class Repository {
  String shop = '';
  List<StockItem> items = [];
  List<AlertEntry> alerts = [];
  Map<String, dynamic> settings = {
    'threshold': 5,
    'timezone': 'UTC',
    'quiet_start': 1320,
    'quiet_end': 480,
    'quiet_enabled': false,
  };
  String? synced, error;
  bool stale = false;
  int activeDiscounts = 0;
  bool get demo;
  Future<void> load();
  Future<void> updateItem(StockItem item, int threshold, bool enabled);
  Future<void> acknowledge(AlertEntry alert, String note);
  Future<void> saveSettings(Map<String, dynamic> value);
  Future<void> sync();
  Future<void> testPush();
}

class DemoRepository extends Repository {
  @override
  bool get demo => true;
  DemoRepository() {
    shop = 'KEYWE COMPANY';
    settings['timezone'] = 'Asia/Seoul';
    final now = DateTime.now();
    synced = now.subtract(const Duration(minutes: 2)).toIso8601String();
    items = [
      for (final (index, product) in demoCatalog.indexed)
        StockItem(
          id: 'demo-${index + 1}',
          productId:
              'demo-product-${demoCatalog.indexWhere((p) => p.title == product.title) + 1}',
          variantId: 'demo-variant-${index + 1}',
          title: product.title,
          variant: product.variant,
          locationId: 'demo-location',
          location: '서울 성수 물류센터',
          quantity: product.stock,
          tracked: product.stock != null,
          threshold: product.threshold,
          updated: now
              .subtract(Duration(minutes: 2 + index * 3))
              .toIso8601String(),
        ),
    ];
    final recentItems = [0, 1, 12, 20, 17, 2, 24, 27, 8, 34, 15, 7, 21, 35];
    alerts = [
      for (final (index, itemIndex) in recentItems.indexed)
        AlertEntry(
          id: 'demo-alert-${index + 1}',
          title: items[itemIndex].title,
          kind: items[itemIndex].status == 'out' ? 'out' : 'low',
          time: now
              .subtract(Duration(minutes: 8 + index * index * 17))
              .toIso8601String(),
          itemId: items[itemIndex].id,
          locationId: items[itemIndex].locationId,
          location: items[itemIndex].location,
          quantity: items[itemIndex].status == 'out'
              ? 0
              : items[itemIndex].threshold - 1,
          current: items[itemIndex].quantity,
          seen: index >= 6,
          note: index >= 11
              ? '입고 검수 완료. 현재 판매 가능 재고에 반영했습니다.'
              : index >= 6
              ? '공급사 재입고 일정 확인 중입니다. 담당자: 김민지'
              : '',
        ),
    ];
  }
  @override
  Future<void> load() async {
    await Future<void>.delayed(const Duration(milliseconds: 180));
  }

  @override
  Future<void> updateItem(StockItem item, int threshold, bool enabled) async {
    items = items
        .map(
          (i) => i.id == item.id
              ? i.copy(threshold: threshold, enabled: enabled)
              : i,
        )
        .toList();
  }

  @override
  Future<void> acknowledge(AlertEntry alert, String note) async {
    alert.seen = true;
    alert.note = note;
  }

  @override
  Future<void> saveSettings(Map<String, dynamic> value) async {
    settings = Map.of(value);
  }

  @override
  Future<void> sync() async {
    synced = DateTime.now().toIso8601String();
  }

  @override
  Future<void> testPush() async {
    alerts.insert(
      0,
      AlertEntry(
        id: DateTime.now().toString(),
        title: 'Demo test · inbox only',
        kind: 'test',
        time: DateTime.now().toIso8601String(),
      ),
    );
  }
}

class SignInRequired implements Exception {}

class LiveRepository extends Repository {
  @override
  bool get demo => false;
  final storage = const FlutterSecureStorage();
  Future<Map<String, dynamic>> request(
    String path, {
    Map<String, dynamic>? data,
    String method = 'GET',
  }) async {
    final base = Uri.tryParse(apiBase);
    if (base == null || base.scheme != 'https' || base.host.isEmpty) {
      throw Exception('Configure an HTTPS API_BASE.');
    }
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) throw SignInRequired();
    final token = await user.getIdToken();
    if (token == null) throw SignInRequired();
    await storage.write(key: 'live_id_token', value: token);
    final values = <String, dynamic>{
      if (shop.isNotEmpty) 'shop': shop,
      ...?data,
    };
    var uri = base.resolve('/api/mobile/$path');
    if (method == 'GET') {
      uri = uri.replace(
        queryParameters: values.map((k, v) => MapEntry(k, v.toString())),
      );
    }
    final req = http.Request(method, uri)
      ..headers.addAll({
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      });
    if (method != 'GET') req.body = jsonEncode(values);
    final response = await http.Response.fromStream(
      await req.send().timeout(const Duration(seconds: 25)),
    );
    if (response.statusCode == 401) throw SignInRequired();
    final result = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400) {
      throw Exception(result['error'] ?? 'Request failed');
    }
    return result;
  }

  Future<void> restore() async {
    shop = await storage.read(key: 'live_shop') ?? '';
    final result = await request('stores');
    final stores = result['stores'] as List;
    if (!stores.any((s) => s['shop'] == shop)) {
      shop = stores.isEmpty ? '' : stores.first['shop'];
    }
    if (shop.isNotEmpty) await storage.write(key: 'live_shop', value: shop);
  }

  Future<void> connect(String domain, String code) async {
    await request('link', method: 'POST', data: {'shop': domain, 'code': code});
    shop = domain;
    await storage.write(key: 'live_shop', value: shop);
  }

  @override
  Future<void> load() async {
    final result = await request('overview');
    final store = result['store'] as Map<String, dynamic>;
    settings = {
      for (final key in [
        'threshold',
        'timezone',
        'quiet_start',
        'quiet_end',
        'quiet_enabled',
      ])
        key: store[key],
    };
    items = (result['inventory'] as List)
        .map((j) => StockItem.fromJson(j, settings['threshold'] as int))
        .toList();
    synced = store['synced_at'];
    error = store['sync_error'];
    stale = result['stale'] == true;
    activeDiscounts = (result['discounts'] as List)
        .where((x) => x['state'] == 'active')
        .length;
    final inbox = await request('alerts');
    alerts = (inbox['alerts'] as List)
        .map((j) => AlertEntry.fromJson(j))
        .toList();
  }

  @override
  Future<void> updateItem(StockItem item, int threshold, bool enabled) async {
    await request(
      'inventory-settings',
      method: 'POST',
      data: {
        'item_id': item.id,
        'location_id': item.locationId,
        'threshold': threshold,
        'enabled': enabled,
      },
    );
    await load();
  }

  @override
  Future<void> acknowledge(AlertEntry alert, String note) async {
    await request('ack', method: 'POST', data: {'id': alert.id, 'note': note});
    await load();
  }

  @override
  Future<void> saveSettings(Map<String, dynamic> value) async {
    await request('settings', method: 'POST', data: value);
    settings = Map.of(value);
  }

  @override
  Future<void> sync() async {
    await request('sync', method: 'POST');
  }

  @override
  Future<void> testPush() async {
    await request('test-push', method: 'POST');
  }

  Future<void> registerToken(String token) async {
    await request('device', method: 'POST', data: {'token': token});
    final previous = await storage.read(key: 'live_fcm_token');
    await storage.write(key: 'live_fcm_token', value: token);
    if (previous != null && previous != token) {
      await request('device', method: 'DELETE', data: {'token': previous});
    }
  }

  Future<void> logout(String? token, {bool disconnect = false}) async {
    token ??= await storage.read(key: 'live_fcm_token');
    if (shop.isNotEmpty) {
      if (disconnect) {
        await request('disconnect', method: 'POST');
      } else if (token != null) {
        await request('device', method: 'DELETE', data: {'token': token});
      }
    }
    await storage.deleteAll();
    await FirebaseAuth.instance.signOut();
    shop = '';
    items = [];
    alerts = [];
  }
}
