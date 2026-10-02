import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:storecontrol/main.dart';
import 'package:storecontrol/repository.dart';

void main() {
  testWidgets('demo is visible on overview, detail, alerts and settings', (
    tester,
  ) async {
    await tester.pumpWidget(StoreControlApp(repository: DemoRepository()));
    await tester.pumpAndSettle();
    expect(find.text('데모 · 샘플 데이터'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('데일리 캔버스 토트백'),
      180,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.tap(find.text('데일리 캔버스 토트백').first);
    await tester.pumpAndSettle();
    expect(find.text('상품 상세'), findsOneWidget);
    expect(find.text('데모 · 샘플 데이터'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    await tester.tap(find.text('알림').last);
    await tester.pumpAndSettle();
    expect(find.textContaining('발생 당시 수량'), findsWidgets);
    await tester.tap(find.text('설정').last);
    await tester.pumpAndSettle();
    expect(find.text('데모 · 샘플 데이터'), findsOneWidget);
  });
  testWidgets(
    'Korean default, English switching and search work without Firebase',
    (tester) async {
      await tester.pumpWidget(StoreControlApp(repository: DemoRepository()));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), 'no matching product');
      await tester.pumpAndSettle();
      await tester.scrollUntilVisible(
        find.text('검색 결과가 없습니다'),
        180,
        scrollable: find.byType(Scrollable).first,
      );
      expect(find.text('검색 결과가 없습니다'), findsOneWidget);
      await tester.tap(find.byIcon(Icons.translate));
      await tester.pumpAndSettle();
      expect(find.text('DEMO · Sample data'), findsOneWidget);
    },
  );
  test('demo instances never share data or call the live repository', () async {
    final a = DemoRepository(), b = DemoRepository();
    await a.updateItem(a.items.first, 9, false);
    expect(b.items.first.threshold, 5);
    expect(a.items.first.threshold, 9);
    expect(
      a.items.firstWhere((item) => item.id == 'demo-5').status,
      'untracked',
    );
  });
}
