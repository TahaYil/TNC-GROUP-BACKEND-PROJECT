# Görev Yönetim API'si

Node.js, Express ve TypeScript ile hazırlanmış; şirket içi projelerde görev oluşturma, çalışanlara atama, durum ve öncelik takibi, arama/filtreleme ve özet raporlama sağlayan REST API.

## Gereksinimler

- Node.js 18 veya üzeri
- npm

## Kurulum ve çalıştırma

```bash
npm install
npm run dev
```

Geliştirme sunucusu varsayılan olarak `http://localhost:3000` adresinde çalışır. Port `PORT` ortam değişkeniyle değiştirilebilir. Üretim derlemesi için `npm run build`, derlenmiş uygulamayı başlatmak için `npm start` kullanılır.

## Veri modeli

Görev verileri şu anda bellekte tutulur. Uygulama yeniden başladığında kayıtlar sıfırlanır. İlk açılışta örnek kayıt eklenmez.

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `id` | string (UUID) | Sunucu tarafından üretilir |
| `title` | string | Zorunlu görev başlığı |
| `description` | string | Zorunlu açıklama |
| `priority` | string | `dusuk`, `orta` veya `yuksek` |
| `assignee` | string | Zorunlu sorumlu çalışan |
| `project` | string | İsteğe bağlı proje adı |
| `status` | string | `bekliyor` (varsayılan), `devam-ediyor`, `tamamlandi` |
| `createdAt`, `updatedAt` | ISO tarih string'i | Sunucu tarafından üretilir/güncellenir |

İstenen alanlardan (`title`, `description`, `priority`, `assignee`) biri eksik ya da geçersizse API `400` ve alan bazlı hata mesajları döndürür. JSON dışındaki dosya/görsel içerikleri desteklenmez.

## API uçları

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `POST` | `/api/tasks` | Görev oluştur |
| `GET` | `/api/tasks` | Görevleri listele, filtrele ve sayfala |
| `GET` | `/api/tasks/:id` | Görev detayını getir |
| `PUT` | `/api/tasks/:id` | Görevi tam alan setiyle güncelle |
| `PATCH` | `/api/tasks/:id` | Gönderilen alanları güncelle |
| `DELETE` | `/api/tasks/:id` | Görevi sil |
| `GET` | `/api/tasks/reports/summary` | Durum ve öncelik özeti |

### Görev oluşturma örneği

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Giriş ekranını hazırla",
  "description": "Kullanıcı giriş API bağlantısını tamamla",
  "priority": "yuksek",
  "assignee": "Ayşe Yılmaz",
  "project": "Kurumsal Portal"
}
```

Başarılı oluşturma `201` döndürür; `status` verilmediyse `bekliyor` atanır.

### Listeleme, arama ve filtreleme

`GET /api/tasks?page=1&limit=10&search=giriş&status=bekliyor&priority=yuksek&assignee=ayşe&project=portal`

- `page`: 1'den başlayan sayfa (varsayılan `1`)
- `limit`: sayfa başına kayıt (varsayılan `10`, en fazla `100`)
- `search`: başlık, açıklama, sorumlu veya proje içinde metin araması
- `status`, `priority`, `assignee`, `project`: isteğe bağlı filtreler

Yanıt `{ "data": [...], "pagination": { "page", "limit", "total", "totalPages" } }` biçimindedir.

### Raporlama

`GET /api/tasks/reports/summary` toplam görev, tamamlanan (`completed`), bekleyen (`pending`), devam eden ve durum/öncelik dağılımlarını döndürür. Başlangıç verisi boş olduğu için ilk raporda sayılar `0` olur.

## Middleware ve hata yanıtları

- İstek logger'ı metot, URL, HTTP durumu ve süreyi konsola yazar.
- Validation middleware hatalı/eksik alanları `400` yanıtında `errors` dizisiyle belirtir.
- Bulunmayan görev `404`, bilinmeyen endpoint `404`, geçersiz JSON `400` döndürür.

## Örnek hata yanıtı

```json
{
  "message": "Görev doğrulaması başarısız.",
  "errors": ["title alanı zorunludur.", "assignee alanı zorunludur."]
}
```
