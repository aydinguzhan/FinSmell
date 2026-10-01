# FinSmell API

FinSmell, NestJS ve PostgreSQL ile geliştirilen bir REST API projesidir. Kullanıcı kaydı, giriş işlemi ve JWT tabanlı kimlik doğrulama altyapısı içerir.

## Teknolojiler

- NestJS ve TypeScript
- PostgreSQL ve TypeORM
- JWT ve Passport
- Docker Compose

## Gereksinimler

- Node.js 22+
- Docker Desktop (PostgreSQL'i Docker ile çalıştırmak için)

## Ortam değişkenleri

Örnek ayar dosyasını kopyalayın:

```bash
cp .env.example .env
```

`.env` içindeki `JWT_SECRET` değerini uzun ve rastgele bir anahtarla değiştirin. Bu dosya `.gitignore` tarafından dışarıda tutulur ve repoya eklenmez.

```env
DATABASE_USER=finsmell_user
DATABASE_PASSWORD=finsmell_dev_password
DATABASE_NAME=finsmell_db
DATABASE_PORT=5432
APP_PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=15m
```

## Docker ile çalıştırma

API ve PostgreSQL'i birlikte başlatın:

```bash
docker compose up --build
```

| Servis | Adres |
| --- | --- |
| API | `http://localhost:3000` |
| PostgreSQL | `localhost:5432` |

PostgreSQL, Compose ağı içinde `postgres:5432` adresinde çalışır. Veriler `postgres_data` volume'ünde tutulur.

```bash
# Servisleri durdurur, veriyi korur
docker compose down

# Servisleri ve PostgreSQL verisini siler
docker compose down -v
```

## Yerel geliştirme

Bağımlılıkları kurun ve uygulamayı başlatın:

```bash
npm install
npm run start:dev
```

Yerelde PostgreSQL'i Docker ile ayrı başlatmak için:

```bash
docker compose up postgres
```

## API uç noktaları

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `POST` | `/auth/register` | Kullanıcı kaydı oluşturur |
| `POST` | `/auth/login` | Başarılı girişte JWT access token döner |
| `GET` | `/users` | Kullanıcıları listeler |

Kayıt isteği örneği:

```json
{
  "email": "ayse@example.com",
  "first_name": "Ayşe",
  "last_name": "Yılmaz",
  "password": "GucluBirSifre123!"
}
```

Giriş isteği örneği:

```json
{
  "email": "ayse@example.com",
  "password": "GucluBirSifre123!"
}
```

JWT ile korunan bir endpoint'e istek atarken header'a token eklenir:

```http
Authorization: Bearer <access_token>
```

## Komutlar

```bash
npm run build      # Derleme
npm run start:dev  # İzleme modunda çalıştırma
npm run test       # Unit testler
npm run test:e2e   # E2E testler
```

## Veritabanı şeması

Yerel Docker yapılandırması `DATABASE_SYNCHRONIZE=true` ile entity değişikliklerini veritabanına uygular. Üretimde bu ayarı kapatın ve şema değişikliklerini TypeORM migration'ları ile yönetin.
