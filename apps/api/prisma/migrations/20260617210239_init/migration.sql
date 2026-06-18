-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'blocked');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'OWNER', 'MANAGER', 'RECEPTIONIST', 'FINANCE', 'TEACHER', 'ORGANIZER', 'PLAYER');

-- CreateEnum
CREATE TYPE "ClubMemberStatus" AS ENUM ('active', 'invited', 'inactive');

-- CreateEnum
CREATE TYPE "ClubStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "CourtStatus" AS ENUM ('active', 'inactive', 'maintenance');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('draft', 'registration_open', 'in_progress', 'finished', 'cancelled');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'walkover');

-- CreateEnum
CREATE TYPE "PlayerLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'mixed');

-- CreateEnum
CREATE TYPE "TournamentFormat" AS ENUM ('group_knockout', 'knockout', 'round_robin');

-- CreateEnum
CREATE TYPE "RankingType" AS ENUM ('manual', 'automatic');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'past_due', 'cancelled', 'trialing');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('in_app', 'email', 'push', 'whatsapp');

-- CreateEnum
CREATE TYPE "ClassAttendanceStatus" AS ENUM ('present', 'absent', 'justified', 'makeup');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sport_level" "PlayerLevel",
    "favorite_sports" TEXT[],
    "city" TEXT,
    "state" CHAR(2),
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "cover_url" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" CHAR(2),
    "country" CHAR(2) NOT NULL DEFAULT 'BR',
    "zip_code" TEXT,
    "sport_types" TEXT[],
    "status" "ClubStatus" NOT NULL DEFAULT 'active',
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_members" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "ClubMemberStatus" NOT NULL DEFAULT 'invited',
    "invited_by" TEXT,
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courts" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport_type" TEXT NOT NULL,
    "surface_type" TEXT,
    "is_indoor" BOOLEAN NOT NULL DEFAULT false,
    "player_capacity" INTEGER NOT NULL DEFAULT 4,
    "price_per_hour" DECIMAL(10,2) NOT NULL,
    "status" "CourtStatus" NOT NULL DEFAULT 'active',
    "photo_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_schedules" (
    "id" TEXT NOT NULL,
    "court_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "opens_at" TEXT NOT NULL,
    "closes_at" TEXT NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "court_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "court_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "price" DECIMAL(10,2) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_method" TEXT,
    "notes" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "cancelled_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_participants" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT,
    "guest_name" TEXT,
    "is_host" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "level" "PlayerLevel" NOT NULL DEFAULT 'beginner',
    "favorite_sport" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "sports" TEXT[],
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "court_id" TEXT,
    "name" TEXT NOT NULL,
    "sport_type" TEXT NOT NULL,
    "level" "PlayerLevel" NOT NULL,
    "max_students" INTEGER NOT NULL,
    "price_per_month" DECIMAL(10,2) NOT NULL,
    "schedule" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_students" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "enrolled_at" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_attendance" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "class_date" DATE NOT NULL,
    "status" "ClassAttendanceStatus" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sport_type" TEXT NOT NULL,
    "cover_url" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "registration_start" DATE NOT NULL,
    "registration_end" DATE NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'draft',
    "visibility" "Visibility" NOT NULL DEFAULT 'public',
    "requires_payment" BOOLEAN NOT NULL DEFAULT false,
    "regulations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_categories" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport_type" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "format" "TournamentFormat" NOT NULL,
    "max_registrations" INTEGER NOT NULL,
    "registration_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_registrations" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "partner_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_id" TEXT,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT,
    "category_id" TEXT,
    "club_id" TEXT NOT NULL,
    "court_id" TEXT,
    "round" TEXT,
    "match_number" INTEGER,
    "start_time" TIMESTAMP(3),
    "status" "MatchStatus" NOT NULL DEFAULT 'scheduled',
    "score" JSONB,
    "winner_id" TEXT,
    "is_walkover" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_participants" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "partner_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rankings" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport_type" TEXT NOT NULL,
    "category" TEXT,
    "type" "RankingType" NOT NULL DEFAULT 'manual',
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "season_start" DATE,
    "season_end" DATE,
    "last_calculated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranking_entries" (
    "id" TEXT NOT NULL,
    "ranking_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "previous_position" INTEGER,
    "points" DECIMAL(10,2) NOT NULL,
    "tournaments_played" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ranking_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "subscription_id" TEXT,
    "tournament_registration_id" TEXT,
    "class_id" TEXT,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "method" TEXT,
    "due_date" DATE NOT NULL,
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_monthly" DECIMAL(10,2) NOT NULL,
    "price_yearly" DECIMAL(10,2) NOT NULL,
    "max_courts" INTEGER NOT NULL,
    "max_team_members" INTEGER NOT NULL,
    "max_tournaments_per_month" INTEGER NOT NULL,
    "features" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'trialing',
    "current_period_start" DATE NOT NULL,
    "current_period_end" DATE NOT NULL,
    "trial_end" DATE,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "club_id" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "channel" "NotificationChannel" NOT NULL,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "club_id" TEXT,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,
    "club_id" TEXT,
    "original_name" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_slug_key" ON "clubs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "club_members_club_id_user_id_key" ON "club_members"("club_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_bookings_club_court_start" ON "bookings"("club_id", "court_id", "start_time");

-- CreateIndex
CREATE INDEX "idx_bookings_created_by" ON "bookings"("created_by_id");

-- CreateIndex
CREATE INDEX "idx_bookings_status_date" ON "bookings"("status", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "class_students_class_id_player_id_key" ON "class_students"("class_id", "player_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_attendance_class_id_player_id_class_date_key" ON "class_attendance"("class_id", "player_id", "class_date");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_slug_key" ON "tournaments"("slug");

-- CreateIndex
CREATE INDEX "idx_matches_tournament_status" ON "matches"("tournament_id", "status");

-- CreateIndex
CREATE INDEX "idx_rankings_club" ON "rankings"("club_id");

-- CreateIndex
CREATE INDEX "idx_ranking_entries_position" ON "ranking_entries"("ranking_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ranking_entries_ranking_id_player_id_key" ON "ranking_entries"("ranking_id", "player_id");

-- CreateIndex
CREATE INDEX "idx_payments_club_status_due" ON "payments"("club_id", "status", "due_date");

-- CreateIndex
CREATE INDEX "idx_payments_user_id" ON "payments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_club_id_key" ON "subscriptions"("club_id");

-- CreateIndex
CREATE INDEX "idx_notifications_user_unread" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_audit_logs_club_created" ON "audit_logs"("club_id", "created_at");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_schedules" ADD CONSTRAINT "court_schedules_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cancelled_by_id_fkey" FOREIGN KEY ("cancelled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_participants" ADD CONSTRAINT "booking_participants_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_participants" ADD CONSTRAINT "booking_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_students" ADD CONSTRAINT "class_students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_students" ADD CONSTRAINT "class_students_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_attendance" ADD CONSTRAINT "class_attendance_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_attendance" ADD CONSTRAINT "class_attendance_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_categories" ADD CONSTRAINT "tournament_categories_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tournament_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking_entries" ADD CONSTRAINT "ranking_entries_ranking_id_fkey" FOREIGN KEY ("ranking_id") REFERENCES "rankings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking_entries" ADD CONSTRAINT "ranking_entries_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

