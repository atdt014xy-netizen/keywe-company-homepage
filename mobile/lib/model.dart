class StockItem {
  final String id,
      productId,
      variantId,
      title,
      variant,
      locationId,
      location,
      updated;
  final String? image;
  final int? quantity;
  final int threshold;
  final bool tracked, enabled;
  const StockItem({
    required this.id,
    required this.productId,
    required this.variantId,
    required this.title,
    required this.variant,
    required this.locationId,
    required this.location,
    required this.quantity,
    required this.updated,
    this.image,
    this.threshold = 5,
    this.tracked = true,
    this.enabled = true,
  });
  String get status => !tracked || quantity == null
      ? 'untracked'
      : quantity! <= 0
      ? 'out'
      : quantity! < threshold
      ? 'low'
      : 'healthy';
  factory StockItem.fromJson(Map<String, dynamic> j, int defaultThreshold) =>
      StockItem(
        id: j['item_id'],
        productId: j['product_id'],
        variantId: j['variant_id'],
        title: j['title'],
        variant: j['variant'],
        locationId: j['location_id'],
        location: j['location_name'],
        quantity: j['available'],
        updated: j['observed_at'],
        image: j['image'],
        threshold: j['threshold'] ?? defaultThreshold,
        tracked: j['tracked'],
        enabled: j['enabled'],
      );
  StockItem copy({int? quantity, int? threshold, bool? enabled}) => StockItem(
    id: id,
    productId: productId,
    variantId: variantId,
    title: title,
    variant: variant,
    locationId: locationId,
    location: location,
    quantity: quantity ?? this.quantity,
    updated: DateTime.now().toIso8601String(),
    image: image,
    threshold: threshold ?? this.threshold,
    tracked: tracked,
    enabled: enabled ?? this.enabled,
  );
}

class AlertEntry {
  final String id, title, kind, time;
  final String? itemId, locationId, location;
  final int? quantity, current;
  bool seen;
  String note;
  AlertEntry({
    required this.id,
    required this.title,
    required this.kind,
    required this.time,
    this.itemId,
    this.locationId,
    this.location,
    this.quantity,
    this.current,
    this.seen = false,
    this.note = '',
  });
  factory AlertEntry.fromJson(Map<String, dynamic> j) => AlertEntry(
    id: j['id'],
    title: j['title'],
    kind: j['kind'],
    time: j['created_at'],
    itemId: j['item_id'],
    locationId: j['location_id'],
    location: j['location_name'],
    quantity: j['quantity'],
    current: j['current_quantity'],
    seen: j['seen_at'] != null,
    note: j['response_note'] ?? '',
  );
}
