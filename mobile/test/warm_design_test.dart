import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:storecontrol/main.dart';
import 'package:storecontrol/model.dart';
import 'package:storecontrol/repository.dart';

void main() {
  testWidgets('summary cards open matching stock and unread-only lists', (
    tester,
  ) async {
    final repo = DemoRepository();
    repo.alerts = [repo.alerts[0], repo.alerts[1], repo.alerts[6]];
    await tester.pumpWidget(StoreControlApp(repository: repo));
    await tester.pumpAndSettle();
    for (final entry in {'재고 부족': 8, '품절': 3}.entries) {
      await tester.tap(find.byKey(ValueKey('summary-${entry.key}')));
      await tester.pumpAndSettle();
      expect(find.text('상품 목록 · ${entry.value}개 옵션'), findsOneWidget);
      await tester.tap(find.text('현황').last);
      await tester.pumpAndSettle();
    }
    await tester.tap(find.byKey(const ValueKey('summary-미확인 알림')));
    await tester.pumpAndSettle();
    expect(find.byKey(ValueKey('alert-${repo.alerts[0].id}')), findsOneWidget);
    expect(find.byKey(ValueKey('alert-${repo.alerts[2].id}')), findsNothing);
    await tester.tap(find.text('확인 완료').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('변경 저장'));
    await tester.pumpAndSettle();
    expect(find.byKey(ValueKey('alert-${repo.alerts[0].id}')), findsNothing);
    expect(find.text('1 미확인'), findsOneWidget);
  });

  Future<void> start(
    WidgetTester tester,
    DemoRepository repo, {
    double width = 390,
    double scale = 1,
  }) async {
    tester.view.physicalSize = Size(width, 844);
    tester.view.devicePixelRatio = 1;
    tester.platformDispatcher.textScaleFactorTestValue = scale;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
      tester.platformDispatcher.clearTextScaleFactorTestValue();
    });
    await tester.pumpWidget(StoreControlApp(repository: repo));
    await tester.pumpAndSettle();
  }

  testWidgets(
    'shared product filters, search, and attention panel use actual inventory',
    (tester) async {
      final repo = DemoRepository();
      await start(tester, repo);
      expect(find.text('진행 중 할인'), findsNothing);
      expect(find.text('Shopify 미연결'), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('attention-panel')));
      await tester.pumpAndSettle();
      expect(find.text('상품 목록 · 11개 옵션'), findsOneWidget);
      for (final entry in {
        'all': 40,
        'low': 8,
        'out': 3,
        'healthy': 27,
      }.entries) {
        await tester.tap(find.byKey(ValueKey('filter-${entry.key}')));
        await tester.pumpAndSettle();
        expect(find.text('상품 목록 · ${entry.value}개 옵션'), findsOneWidget);
      }
      await tester.tap(find.byKey(const ValueKey('filter-all')));
      await tester.enterText(
        find.byKey(const ValueKey('product-search')),
        '오션 블루',
      );
      await tester.pumpAndSettle();
      expect(find.text('상품 목록 · 1개 옵션'), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('product-demo-2')));
      await tester.pumpAndSettle();
      expect(find.text('상품 상세'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'reviewing an alert preserves quantity and updates unread state',
    (tester) async {
      final repo = DemoRepository();
      await start(tester, repo);
      final before = repo.alerts.where((a) => !a.seen).length;
      await tester.tap(find.text('알림').last);
      await tester.pumpAndSettle();
      expect(find.textContaining('발생 당시 수량'), findsWidgets);
      await tester.tap(find.text('확인 완료').first);
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), '입고 일정 확인');
      await tester.tap(find.text('변경 저장'));
      await tester.pumpAndSettle();
      expect(repo.alerts.where((a) => !a.seen).length, before - 1);
      expect(repo.alerts.first.note, '입고 일정 확인');
      expect(repo.items.first.quantity, 0);
    },
  );

  testWidgets(
    '360px enlarged text, long product, missing photo and navigation stay usable',
    (tester) async {
      final repo = DemoRepository();
      repo.items = [
        StockItem(
          id: 'long',
          productId: 'long',
          variantId: 'long',
          title: '아주 긴 상품명과 한글 옵션이 포함된 프리미엄 매장 전용 스페셜 에디션 상품',
          variant: '내추럴 오트밀 / 특별 구성 선물 패키지 / 라지 사이즈',
          locationId: 'l',
          location: '서울 성수 물류센터',
          quantity: 1,
          updated: '2026-10-02T09:00:00Z',
        ),
      ];
      await start(tester, repo, width: 360, scale: 2);
      for (final label in ['상품', '알림', '설정', '현황']) {
        await tester.tap(find.text(label).last);
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull, reason: label);
      }
      await tester.tap(find.text('상품').last);
      await tester.pumpAndSettle();
      await tester.scrollUntilVisible(
        find.byKey(const ValueKey('product-long')),
        200,
        scrollable: find.byType(Scrollable).first,
      );
      expect(find.text('사진 없음'), findsWidgets);
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.byKey(const ValueKey('product-long')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('product-long')));
      await tester.pumpAndSettle();
      expect(find.text('상품 상세'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets('keyboard activation supports Enter and Space on product cards', (
    tester,
  ) async {
    await start(tester, DemoRepository());
    await tester.tap(find.text('상품').last);
    await tester.pumpAndSettle();
    final card = find.byKey(const ValueKey('product-demo-1'));
    await tester.ensureVisible(card);
    final ink = find.descendant(of: card, matching: find.byType(InkWell));
    final focus = Focus.of(
      tester.element(
        find.descendant(of: ink, matching: find.byType(Padding)).first,
      ),
    );
    focus.requestFocus();
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(find.text('상품 상세'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    await tester.ensureVisible(card);
    Focus.of(
      tester.element(
        find
            .descendant(
              of: find.descendant(of: card, matching: find.byType(InkWell)),
              matching: find.byType(Padding),
            )
            .first,
      ),
    ).requestFocus();
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(find.text('상품 상세'), findsOneWidget);
  });
}
